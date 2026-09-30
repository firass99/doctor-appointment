import { Check } from "lucide-react";
import Photo from "../Photo";

const points = [
  "Browse doctors by speciality",
  "See only the time slots that are really free",
  "Get a confirmation as soon as the doctor accepts",
  "Cancel from your account whenever plans change",
];

export default function AppointmentsSection() {
  return (
    <section id="appointments" className="py-16 md:py-24">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Doctor appointments
          </h2>
          <p className="mt-3 text-muted-foreground">
            Everything you need to see a doctor, from the first search to the
            visit.
          </p>
        </div>

        <div className="mt-12 grid items-center gap-10 md:grid-cols-2">
          <div>
            <p className="max-w-prose text-muted-foreground">
              Choose a speciality, compare doctors and book a slot that fits
              your day. Your appointments and notifications stay in one place.
            </p>
            <ul className="mt-6 space-y-4">
              {points.map((p) => (
                <li key={p} className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="size-4" />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <Photo
            src="/images/consultation.jpg"
            alt="Two doctors talking in a bright clinic"
            className="h-64 w-full rounded-2xl shadow-lg sm:h-80 md:h-96"
          />
        </div>
      </div>
    </section>
  );
}
