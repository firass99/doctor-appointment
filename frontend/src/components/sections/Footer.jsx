import { Link } from "react-router-dom";
import { Stethoscope, Mail, Phone, MapPin } from "lucide-react";

const explore = [
  { name: "About", url: "/about" },
  { name: "Departments", url: "/departments" },
  { name: "Doctors", url: "/doctors" },
  { name: "Contact", url: "/contact" },
];

const account = [
  { name: "Login", url: "/login" },
  { name: "Register", url: "/register" },
];

function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container grid gap-10 py-12 md:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2 text-xl font-bold">
            <Stethoscope className="size-6 text-primary" />
            Allo<span className="text-primary"> Doctor</span>
          </Link>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Find verified specialists and book appointments online in under a
            minute.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Explore</h3>
          <ul className="mt-4 space-y-2">
            {explore.map((link) => (
              <li key={link.url}>
                <Link
                  to={link.url}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Account</h3>
          <ul className="mt-4 space-y-2">
            {account.map((link) => (
              <li key={link.url}>
                <Link
                  to={link.url}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <MapPin className="size-4 shrink-0 text-primary" />
              Tunis, Tunisia
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4 shrink-0 text-primary" />
              +216 20 123 456
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4 shrink-0 text-primary" />
              contact@allodoctor.com
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t py-6">
        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Allo Doctor. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
