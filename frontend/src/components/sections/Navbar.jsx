import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, LayoutDashboard, UserCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import NotificationBell from "@/components/NotificationBell";

const links = [
  { name: "About", url: "/about" },
  { name: "Departments", url: "/departments" },
  { name: "Doctors", url: "/doctors" },
  { name: "Contact", url: "/contact" },
];

const authLinks = [
  { name: "Register", url: "/register", variant: "outline" },
  { name: "Login", url: "/login", variant: "default" },
];

const linkClass = ({ isActive }) =>
  cn(
    "text-sm font-medium transition-colors hover:text-primary",
    isActive ? "text-primary" : "text-muted-foreground",
  );

function Navbar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    close();
    logout();
    navigate("/");
  };

  // close the mobile menu with the Escape key
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        <Link to="/" onClick={close} className="text-2xl font-bold">
          Allo<span className="text-primary"> Doctor</span>
        </Link>

        {/* desktop */}
        <div className="hidden items-center gap-8 md:flex">
          <div className="flex items-center gap-6">
            {links.map((link) => (
              <NavLink key={link.url} to={link.url} className={linkClass}>
                {link.name}
              </NavLink>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <NotificationBell />
                <Link
                  to="/dashboard"
                  title="Go to dashboard"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "gap-2",
                  )}
                >
                  <UserCircle className="size-4" />
                  {user?.name?.split(" ")[0] ?? "Profile"}
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className={buttonVariants({ variant: "default" })}
                >
                  Log out
                </button>
              </>
            ) : (
              authLinks.map((btn) => (
                <Link
                  key={btn.url}
                  to={btn.url}
                  className={buttonVariants({ variant: btn.variant })}
                >
                  {btn.name}
                </Link>
              ))
            )}
          </div>
        </div>

        {/* mobile toggle */}
        <div className="flex items-center gap-1 md:hidden">
          {isAuthenticated && <NotificationBell />}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="rounded-md p-2 hover:bg-accent"
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </nav>

      {/* mobile panel */}
      {open && (
        <div
          id="mobile-menu"
          className="absolute inset-x-0 top-full border-b bg-background shadow-md md:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
            {links.map((link) => (
              <NavLink
                key={link.url}
                to={link.url}
                onClick={close}
                className={({ isActive }) =>
                  cn(
                    "rounded-md px-3 py-2 text-base font-medium hover:bg-accent",
                    isActive ? "text-primary" : "text-foreground",
                  )
                }
              >
                {link.name}
              </NavLink>
            ))}
            <div className="mt-3 flex gap-3">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={close}
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "flex-1 gap-2",
                    )}
                  >
                    <LayoutDashboard className="size-4" />
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className={cn(buttonVariants({ variant: "default" }), "flex-1")}
                  >
                    Log out
                  </button>
                </>
              ) : (
                authLinks.map((btn) => (
                  <Link
                    key={btn.url}
                    to={btn.url}
                    onClick={close}
                    className={cn(
                      buttonVariants({ variant: btn.variant }),
                      "flex-1",
                    )}
                  >
                    {btn.name}
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
