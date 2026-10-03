import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "@/components/ui/field";
import { Card, CardContent } from "@/components/ui/card";
import { getMyProfile, updateMyProfile } from "@/lib/api/doctors";

const profileSchema = z.object({
  bio: z.string().trim().max(1000, "Bio is too long").or(z.literal("")),
  price: z.coerce.number().min(0, "Price can't be negative"),
  experienceYears: z.coerce.number().min(0, "Experience can't be negative"),
  slotDuration: z.coerce
    .number()
    .min(10, "Minimum is 10 minutes")
    .max(120, "Maximum is 120 minutes"),
});

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function DoctorProfilePage() {
  const [profile, setProfile] = useState(null);
  const [status, setStatus] = useState("loading");

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { bio: "", price: 0, experienceYears: 0, slotDuration: 30 },
  });

  useEffect(() => {
    let active = true;
    getMyProfile()
      .then((data) => {
        if (!active) return;
        setProfile(data);
        form.reset({
          bio: data.bio ?? "",
          price: data.price ?? 0,
          experienceYears: data.experienceYears ?? 0,
          slotDuration: data.slotDuration ?? 30,
        });
        setStatus("ready");
      })
      .catch((error) => {
        if (!active) return;
        setStatus("error");
        toast.error(error.message || "Could not load your profile.");
      });
    return () => {
      active = false;
    };
  }, [form]);

  const onSubmit = async (values) => {
    try {
      const updated = await updateMyProfile(values);
      setProfile(updated);
      toast.success("Profile updated.");
    } catch (error) {
      toast.error(error.message || "Could not update your profile.");
    }
  };

  if (status === "loading") {
    return <div className="h-96 max-w-xl animate-pulse rounded-xl bg-muted" />;
  }

  if (status === "error") {
    return (
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My profile</h1>
        <p className="mt-2 text-muted-foreground">
          We couldn't find a doctor profile for your account. Ask an
          administrator to set one up.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold tracking-tight">My profile</h1>
      <p className="mt-1 text-muted-foreground">
        Patients see this information on your public profile.
      </p>

      <Card className="mt-6">
        <CardContent>
          <div className="mb-5 flex flex-wrap items-center gap-2 text-sm">
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-medium text-primary">
              {profile?.speciality?.name ?? "No speciality"}
            </span>
            <span className="text-muted-foreground">
              {profile?.isActive ? "Visible to patients" : "Hidden"}
            </span>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
            <FieldGroup>
              <Controller
                name="bio"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="bio">Bio</FieldLabel>
                    <Textarea
                      {...field}
                      id="bio"
                      placeholder="Tell patients about your background and approach."
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="price"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="price">Consultation price (TND)</FieldLabel>
                    <Input
                      {...field}
                      id="price"
                      type="number"
                      min="0"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="experienceYears"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="experienceYears">
                      Years of experience
                    </FieldLabel>
                    <Input
                      {...field}
                      id="experienceYears"
                      type="number"
                      min="0"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="slotDuration"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="slotDuration">
                      Appointment length (minutes)
                    </FieldLabel>
                    <Input
                      {...field}
                      id="slotDuration"
                      type="number"
                      min="10"
                      max="120"
                      aria-invalid={fieldState.invalid}
                    />
                    <FieldDescription>
                      Between 10 and 120 minutes.
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

      <Card className="mt-6">
        <CardContent>
          <h2 className="font-semibold">Working hours</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Your current weekly schedule.
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {(profile?.workingHours ?? []).length === 0 && (
              <li className="text-muted-foreground">No working hours set.</li>
            )}
            {(profile?.workingHours ?? []).map((w) => (
              <li key={w.day} className="flex justify-between gap-4">
                <span className="font-medium">{DAYS[w.day]}</span>
                <span className="text-muted-foreground">
                  {w.start} – {w.end}
                  {w.breakStart && ` (break ${w.breakStart}–${w.breakEnd})`}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
