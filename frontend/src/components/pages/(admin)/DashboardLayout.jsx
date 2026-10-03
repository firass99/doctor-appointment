import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Tags,
  CalendarCheck,
  Bell,
  UserCog,
  LogOut,
  Menu,
  X,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import NotificationBell from "@/components/NotificationBell";

const LINKS_BY_ROLE = {
  ADMIN: [
    { name: "Overview", url: "/dashboard", icon: LayoutDashboard, end: true },
    { name: "Users", url: "/dashboard/users", icon: Users },
    { name: "Doctors", url: "/dashboard/doctors", icon: Stethoscope },
    { name: "Specialities", url: "/dashboard/specialities", icon: Tags },
    { name: "Appointments", url: "/dashboard/appointments", icon: CalendarCheck },
  ],
  DOCTOR: [
    { name: "Overview", url: "/dashboard", icon: LayoutDashboard, end: true },
    { name: "Appointments", url: "/dashboard/appointments", icon: CalendarCheck },
    { name: "My Profile", url: "/dashboard/doctor-profile", icon: Stethoscope },
  ],
  USER: [
    { name: "Overview", url: "/dashboard", icon: LayoutDashboard, end: true },
    { name: "My Appointments", url: "/dashboard/appointments", icon: CalendarCheck },
  ],
};

const COMMON_LINKS = [
  { name: "Notifications", url: "/dashboard/notifications", icon: Bell },
  { name: "Account", url: "/dashboard/account", icon: UserCog },
];

function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const links = [...(LINKS_BY_ROLE[user?.role] ?? []), ...COMMON_LINKS];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItems = (
    <nav className="flex-1 space-y-1 px-3">
      {links.map((link) => (
        <NavLink
          key={link.url}
          to={link.url}
          end={link.end}
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )
          }
        >
          <link.icon className="size-4" />
          {link.name}
        </NavLink>
      ))}
    </nav>
  );

  const sidebarFooter = (
    <div className="border-t p-3">
      <div className="px-3 py-2">
        <p className="truncate text-sm font-medium">{user?.name}</p>
        <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
        <span className="mt-1 inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
          {user?.role}
        </span>
      </div>
      <Link
        to="/"
        onClick={() => setOpen(false)}
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <Home className="size-4" />
        Back to site
      </Link>
      <button
        type="button"
        onClick={handleLogout}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <LogOut className="size-4" />
        Log out
      </button>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      {/* desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r bg-muted/30 lg:flex">
        <div className="px-6 py-5 text-xl font-bold">
          Allo<span className="text-primary"> Doctor</span>
        </div>
        {navItems}
        {sidebarFooter}
      </aside>

      {/* mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setOpen(false)}
          />
          <aside className="relative flex h-full w-72 flex-col border-r bg-background">
            <div className="flex items-center justify-between px-6 py-5">
              <span className="text-xl font-bold">
                Allo<span className="text-primary"> Doctor</span>
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="rounded-md p-2 hover:bg-muted"
              >
                <X className="size-5" />
              </button>
            </div>
            {navItems}
            {sidebarFooter}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur sm:px-6">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="rounded-md p-2 hover:bg-muted lg:hidden"
          >
            <Menu className="size-5" />
          </button>
          <span className="hidden text-sm text-muted-foreground lg:block">
            Dashboard
          </span>
          <div className="ml-auto flex items-center gap-2">
            <NotificationBell />
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
