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

const registerSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Include at least one uppercase letter")
    .regex(/[0-9]/, "Include at least one number"),
});

const fields = [
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "you@example.com",
    autoComplete: "email",
  },

  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "At least 8 characters",
    autoComplete: "new-password",
  },
];

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      await login(values);
      toast.success("Welcome back!");
      form.reset();
      navigate("/dashboard");
    } catch (error) {
      // Our client automatically extracts the backend error message (e.g., "Email already exists")
      // If the server is down, it falls back to the default message.
      toast.error(error.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="flex max-h-screen w-full">
      {/* Left image (desktop only) */}
      <div className="hidden w-full md:inline-block">
        <img
          className="h-full w-full object-cover"
          src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/leftSideImage.png"
          alt="Allo Doctor"
        />
      </div>

      {/* Form */}
      <div className="flex w-full flex-col max-h-[80vh] items-center justify-center px-4 py-10">
        <div className="w-80 md:w-96">
          <h2 className="text-center text-4xl font-medium text-gray-900">
            Sign
          </h2>
          <p className="mt-3 text-center text-sm text-gray-500/90">
            Login to Allo Doctor account to book appointments
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
                  ? "Connecting..."
                  : "Create account"}
              </Button>
            </FieldGroup>
          </form>

          <p className="mt-4 text-center text-sm text-gray-500/90">
            Dont have an account?{" "}
            <Link className="text-teal-600 hover:underline" to="/register">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
