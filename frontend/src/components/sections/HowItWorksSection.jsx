import { Search, CalendarCheck, Stethoscope } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Find a doctor",
    description:
      "Search by speciality and compare experience, price and availability.",
  },
  {
    icon: CalendarCheck,
    title: "Book a slot",
    description:
      "Pick a free time that works for you, confirmed instantly, no phone calls.",
  },
  {
    icon: Stethoscope,
    title: "Get seen",
    description:
      "Show up for your appointment and get the care you need, on time.",
  },
];

export default function HowItWorksSection() {
  return (
    <section>
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold text-primary">How it works</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Booking made simple
          </h2>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.title} className="relative text-center">
              <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <step.icon className="size-7" />
              </div>
              <span className="mt-4 block text-sm font-semibold text-primary">
                Step {index + 1}
              </span>
              <h3 className="mt-1 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
