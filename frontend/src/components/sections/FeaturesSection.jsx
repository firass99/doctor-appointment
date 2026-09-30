import { Link } from "react-router-dom";
import { BellRing, CalendarCheck, Clock, ShieldCheck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Photo from "../Photo";

const features = [
  {
    icon: CalendarCheck,
    title: "Easy booking",
    text: "Pick a doctor and a free slot in a few taps.",
  },
  {
    icon: Clock,
    title: "Live availability",
    text: "Working hours, breaks and days off are already handled.",
  },
  {
    icon: BellRing,
    title: "Notifications",
    text: "Know when your appointment is confirmed or cancelled.",
  },
  {
    icon: ShieldCheck,
    title: "Private account",
    text: "Your details are protected behind a secure login.",
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="services"
      className="bg-linear-to-b from-secondary to-background py-16 md:py-24"
    >
      <div className="container grid items-center gap-10 md:grid-cols-2">
        <Photo
          src="/images/nurse.jpg"
          alt="Smiling nurse holding a tablet"
          className="h-80 w-full rounded-2xl shadow-lg sm:h-96 md:h-[28rem]"
        />

        <div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need for your care
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {features.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
                <div>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{text}</p>
                </div>
              </div>
            ))}
          </div>
          <Link
            to="/register"
            className={cn(buttonVariants({ variant: "outline" }), "mt-8")}
          >
            Create an account
          </Link>
        </div>
      </div>
    </section>
  );
}
