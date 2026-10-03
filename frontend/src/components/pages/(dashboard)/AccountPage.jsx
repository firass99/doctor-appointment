import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "@/components/ui/field";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { updateMe } from "@/lib/api/auth";

const accountSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s-]{8,15}$/, "Enter a valid phone number")
    .or(z.literal("")),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Include at least one uppercase letter")
    .regex(/[0-9]/, "Include at least one number")
    .or(z.literal("")),
});

export default function AccountPage() {
  const { user, refreshUser } = useAuth();

  const form = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: user?.name ?? "",
      phone: user?.phone ?? "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      await updateMe({
        name: values.name,
        phone: values.phone || undefined,
        password: values.password || undefined,
      });
      await refreshUser();
      form.reset({ ...values, password: "" });
      toast.success("Profile updated.");
    } catch (error) {
      toast.error(error.message || "Could not update your profile.");
    }
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold tracking-tight">Account</h1>
      <p className="mt-1 text-muted-foreground">
        Update your personal details and password.
      </p>

      <Card className="mt-6">
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
            <FieldGroup>
              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input value={user?.email ?? ""} disabled readOnly />
                <FieldDescription>Your email can't be changed.</FieldDescription>
              </Field>

              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="name">Full name</FieldLabel>
                    <Input
                      {...field}
                      id="name"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="phone"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="phone">Phone number</FieldLabel>
                    <Input
                      {...field}
                      id="phone"
                      type="tel"
                      placeholder="+216 20 123 456"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="password">New password</FieldLabel>
                    <Input
                      {...field}
                      id="password"
                      type="password"
                      autoComplete="new-password"
                      aria-invalid={fieldState.invalid}
                    />
                    <FieldDescription>
                      Leave empty to keep your current password.
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : "Save changes"}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
