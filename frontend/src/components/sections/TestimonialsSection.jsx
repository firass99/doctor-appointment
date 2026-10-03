import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Sarra Ben Ali",
    role: "Patient",
    quote:
      "Booking took less than a minute and I found a dermatologist available the next day. No more waiting on hold.",
  },
  {
    name: "Karim Trabelsi",
    role: "Patient",
    quote:
      "I love that I can see the doctor's experience and price before booking. Everything is transparent.",
  },
  {
    name: "Nour Jendoubi",
    role: "Patient",
    quote:
      "Reminders and notifications kept me on track. I never missed an appointment since I started using it.",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="bg-muted/30">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold text-primary">Testimonials</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Trusted by patients
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.name} className="h-full">
              <CardContent className="flex h-full flex-col gap-4">
                <div className="flex gap-1 text-warning">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-4 fill-current" />
                  ))}
                </div>
                <p className="flex-1 text-sm text-muted-foreground">
                  “{t.quote}”
                </p>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
