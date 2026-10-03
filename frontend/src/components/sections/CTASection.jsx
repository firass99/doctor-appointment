import { Link } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function CTASection() {
  return (
    <section>
      <div className="container">
        <div className="flex flex-col items-center gap-6 rounded-3xl bg-primary px-6 py-16 text-center text-primary-foreground sm:px-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to see a doctor?
          </h2>
          <p className="max-w-xl text-primary-foreground/90">
            Create a free account and book your first appointment in minutes.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/register"
              className={cn(
                buttonVariants({ size: "lg", variant: "secondary" }),
              )}
            >
              Create an account
            </Link>
            <Link
              to="/doctors"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10",
              )}
            >
              Browse doctors
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
