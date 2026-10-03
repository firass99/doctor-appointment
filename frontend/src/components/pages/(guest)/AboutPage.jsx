import { Link } from "react-router-dom";
import { ShieldCheck, Clock3, HeartHandshake } from "lucide-react";
import Photo from "@/components/Photo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const values = [
  {
    icon: ShieldCheck,
    title: "Verified doctors",
    description:
      "Every specialist on Allo Doctor is reviewed before they can accept patients.",
  },
  {
    icon: Clock3,
    title: "Real availability",
    description:
      "Doctors manage their own working hours, so the slots you see are accurate.",
  },
  {
    icon: HeartHandshake,
    title: "Patient first",
    description:
      "No hidden fees, no phone queues. Just a simple way to get the care you need.",
  },
];

const stats = [
  { value: "50+", label: "Verified doctors" },
  { value: "10k+", label: "Appointments booked" },
  { value: "15", label: "Specialities" },
  { value: "4.8/5", label: "Average rating" },
];

export default function AboutPage() {
  return (
    <main>
      <section className="bg-accent/40">
        <div className="container grid items-center gap-10 py-20 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-primary">About us</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Healthcare that fits your schedule
            </h1>
            <p className="mt-4 max-w-prose text-muted-foreground">
              Allo Doctor connects patients with trusted specialists across
              every speciality. We built the platform so booking a doctor
              takes as little effort as booking a table, without
              compromising on the quality of care.
            </p>
            <Link
              to="/doctors"
              className={cn(buttonVariants({ size: "lg" }), "mt-6")}
            >
              Find a doctor
            </Link>
          </div>
          <Photo
            src="/images/doctor-1.jpg"
            alt="Doctor smiling at the camera"
            className="h-80 w-full rounded-2xl shadow-lg md:h-96"
          />
        </div>
      </section>

      <section>
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Why patients choose us
            </h2>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {values.map((value) => (
              <div key={value.title} className="text-center">
                <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <value.icon className="size-7" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{value.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary text-primary-foreground">
        <div className="container grid grid-cols-2 gap-8 py-16 text-center md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-bold sm:text-4xl">{stat.value}</p>
              <p className="mt-1 text-sm text-primary-foreground/90">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
