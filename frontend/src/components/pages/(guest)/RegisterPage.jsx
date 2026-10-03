import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { useAuth } from "@/hooks/useAuth";

const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(60, "Name is too long"),
    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .email("Enter a valid email address"),
    phone: z
      .string()
      .trim()
      .regex(
        /^\+?[0-9\s-]{8,15}$/,
        "Enter a valid phone number (8 to 15 digits)",
      ),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Include at least one uppercase letter")
      .regex(/[0-9]/, "Include at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const fields = [
  {
    name: "name",
    label: "Full name",
    type: "text",
    placeholder: "Sarra Ben Ali",
    autoComplete: "name",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "you@example.com",
    autoComplete: "email",
  },
  {
    name: "phone",
    label: "Phone number",
    type: "tel",
    placeholder: "+216 20 123 456",
    autoComplete: "tel",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "At least 8 characters",
    autoComplete: "new-password",
  },
  {
    name: "confirmPassword",
    label: "Confirm password",
    type: "password",
    placeholder: "Repeat your password",
    autoComplete: "new-password",
  },
];

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values) => {
    // Don't send confirmPassword to the API
    const { confirmPassword, ...payload } = values;

    try {
      await register(payload);
      toast.success("Account created! Welcome to Allo Doctor.");
      form.reset();
      navigate("/dashboard");
    } catch (error) {
      // Our client automatically extracts the backend error message (e.g., "Email already exists")
      // If the server is down, it falls back to the default message.
      toast.error(error.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Left image (desktop only) */}
      <div className="hidden w-full md:inline-block">
        <img
          className="h-full w-full object-cover"
          src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/leftSideImage.png"
          alt="Allo Doctor"
        />
      </div>

      {/* Form */}
      <div className="flex w-full flex-col items-center justify-center px-4 py-10">
        <div className="w-80 md:w-96">
          <h2 className="text-center text-4xl font-medium text-gray-900">
            Sign up
          </h2>
          <p className="mt-3 text-center text-sm text-gray-500/90">
            Create your Allo Doctor account to book appointments
          </p>

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-8"
            noValidate
          >
            <FieldGroup>
              {fields.map(
                ({ name, label, type, placeholder, autoComplete }) => (
                  <Controller
                    key={name}
                    name={name}
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={name}>{label}</FieldLabel>
                        <Input
                          {...field}
                          id={name}
                          type={type}
                          placeholder={placeholder}
                          autoComplete={autoComplete}
                          aria-invalid={fieldState.invalid}
                          className="h-12 rounded-full px-5"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                ),
              )}

              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="h-11 w-full rounded-full bg-teal-600 text-white hover:bg-teal-700"
              >
                {form.formState.isSubmitting
                  ? "Creating account..."
                  : "Create account"}
              </Button>
            </FieldGroup>
          </form>

          <p className="mt-4 text-center text-sm text-gray-500/90">
            Already have an account?{" "}
            <Link className="text-teal-600 hover:underline" to="/login">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
