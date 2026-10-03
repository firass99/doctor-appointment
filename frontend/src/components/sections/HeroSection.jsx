import { Link } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function HeroSection() {
  return (
    <section className="w-full min-h-[80vh] flex items-center bg-accent/40">
      <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row items-center gap-10">
        {/* Left: text + CTA */}
        <div className="w-full md:w-1/2">
          <p className="font-medium text-primary">Allo Doctor</p>
          <h1 className="mt-3 text-4xl md:text-6xl font-extrabold leading-tight text-foreground">
            See a doctor today, not next week.
          </h1>
          <p className="mt-5 max-w-md text-lg text-muted-foreground">
            Find a verified specialist near you and book in under a minute.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/doctors"
              className={cn(buttonVariants({ size: "lg" }), "rounded-full px-7")}
            >
              Book an appointment
            </Link>
            <Link
              to="/departments"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "rounded-full px-7",
              )}
            >
              Explore departments
            </Link>
          </div>
        </div>

        {/* Right: image */}
        <div className="w-full md:w-1/2">
          <img
            src="https://plus.unsplash.com/premium_photo-1658506671316-0b293df7c72b?q=80&w=1170&auto=format&fit=crop"
            alt="Doctor consulting a patient"
            className="w-full h-[320px] md:h-[480px] object-cover rounded-3xl shadow-xl"
          />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
