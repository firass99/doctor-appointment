import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Stethoscope, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { label: "Home", href: "#home" },
  { label: "Appointments", href: "#appointments" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Tips", href: "#tips" },
];

const outline = cn(
  buttonVariants({ variant: "outline" }),
  "border-white/60 bg-transparent text-white hover:bg-white/10 hover:text-white",
);
const solid = cn(buttonVariants(), "bg-white text-primary hover:bg-white/90");

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-30 text-white">
      <nav className="container flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold">
          <Stethoscope className="size-6" />
          DocCare
        </Link>

        <ul className="hidden items-center gap-8 text-sm md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="opacity-90 hover:opacity-100">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/login" className={outline}>
            Log in
          </Link>
          <Link to="/register" className={solid}>
            Sign up
          </Link>
        </div>

        <button
          className="rounded-md p-2 hover:bg-white/10 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {open && (
        <div className="container md:hidden">
          <div className="animate-rise space-y-1 rounded-xl bg-white p-4 text-foreground shadow-xl">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-md px-3 py-2 hover:bg-secondary"
              >
                {l.label}
              </a>
            ))}
            <div className="flex gap-3 pt-3">
              <Link
                to="/login"
                className={cn(buttonVariants({ variant: "outline" }), "flex-1")}
              >
                Log in
              </Link>
              <Link to="/register" className={cn(buttonVariants(), "flex-1")}>
                Sign up
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
