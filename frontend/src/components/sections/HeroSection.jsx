import { Link } from "react-router-dom";
import { CalendarCheck, Clock, ShieldCheck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Navbar from "./Navbar";
import Photo from "../Photo";

const perks = [
  { icon: ShieldCheck, label: "Verified doctors" },
  { icon: Clock, label: "Live availability" },
  { icon: CalendarCheck, label: "Instant confirmation" },
];

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-linear-to-br from-primary via-teal-600 to-teal-500 pt-28 text-white md:pt-32"
    >
      <Navbar />

      <div className="container grid items-end gap-8 md:grid-cols-2">
        <div className="animate-rise pb-10 md:pb-24">
          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Book your doctor appointment in minutes
          </h1>
          <p className="mt-5 max-w-md text-base text-white/85 sm:text-lg">
            Find a trusted doctor, pick a free time slot and get instant
            confirmation. No phone calls, no waiting rooms.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/doctors"
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-white text-primary hover:bg-white/90",
              )}
            >
              Find a doctor
            </Link>
            <a
              href="#services"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "border-white/60 bg-transparent text-white hover:bg-white/10 hover:text-white",
              )}
            >
              How it works
            </a>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/90">
            {perks.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2">
                <Icon className="size-4" />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div className="animate-rise relative flex justify-center [animation-delay:200ms] md:justify-end">
          <Photo
            src="/images/hero-doctor.jpg"
            alt="Smiling doctor in a white coat"
            className="h-80 w-full max-w-sm rounded-t-3xl sm:h-[26rem] md:h-[32rem]"
          />
          <div className="animate-float absolute bottom-10 left-2 flex items-center gap-3 rounded-xl bg-white p-3 text-foreground shadow-xl sm:left-0 md:-left-4">
            <span className="flex size-10 items-center justify-center rounded-full bg-secondary text-primary">
              <CalendarCheck className="size-5" />
            </span>
            <div className="text-sm">
              <p className="text-muted-foreground">Next available</p>
              <p className="font-semibold">Today, 3:30 PM</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
