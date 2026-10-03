import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Card, CardContent } from "@/components/ui/card";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
  message: z.string().trim().min(10, "Message must be at least 10 characters"),
});

const fields = [
  { name: "name", label: "Full name", type: "text", placeholder: "Sarra Ben Ali" },
  { name: "email", label: "Email", type: "email", placeholder: "you@example.com" },
];

const info = [
  { icon: MapPin, label: "Tunis, Tunisia" },
  { icon: Phone, label: "+216 20 123 456" },
  { icon: Mail, label: "contact@allodoctor.com" },
];

export default function ContactPage() {
  const form = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "" },
  });

  const onSubmit = async (values) => {
    // No backend endpoint exists yet for contact messages; acknowledge locally.
    await new Promise((resolve) => setTimeout(resolve, 400));
    toast.success("Message sent! We'll get back to you shortly.");
    form.reset();
  };

  return (
    <main className="container py-16">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold text-primary">Contact us</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          We'd love to hear from you
        </h1>
        <p className="mt-4 text-muted-foreground">
          Questions about booking, your account or a doctor's profile? Send
          us a message.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-4xl gap-8 md:grid-cols-5">
        <Card className="md:col-span-2">
          <CardContent className="flex flex-col gap-6">
            {info.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <span className="text-sm text-muted-foreground">{label}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
              <FieldGroup>
                {fields.map(({ name, label, type, placeholder }) => (
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
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                ))}

                <Controller
                  name="message"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="message">Message</FieldLabel>
                      <Textarea
                        {...field}
                        id="message"
                        placeholder="How can we help?"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Sending..." : "Send message"}
                </Button>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
