import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import StatusBadge from "@/components/StatusBadge";
import { useAuth } from "@/hooks/useAuth";
import { getUsers } from "@/lib/api/users";
import { getDoctors } from "@/lib/api/doctors";
import { getSpecialities } from "@/lib/api/specialities";
import { getAllAppointments, getMyAppointments } from "@/lib/api/appointments";

const formatDate = (value) => new Date(value).toLocaleDateString();

export default function DashboardOverview() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        if (user?.role === "ADMIN") {
          const [users, doctors, specialities, all] = await Promise.all([
            getUsers(),
            getDoctors(),
            getSpecialities(true),
            getAllAppointments(),
          ]);
          if (!active) return;
          setStats([
            { label: "Users", value: users.length, url: "/dashboard/users" },
            { label: "Doctors", value: doctors.length, url: "/dashboard/doctors" },
            {
              label: "Specialities",
              value: specialities.length,
              url: "/dashboard/specialities",
            },
            {
              label: "Appointments",
              value: all.length,
              url: "/dashboard/appointments",
            },
          ]);
          setAppointments(all.slice(0, 5));
        } else {
          const mine = await getMyAppointments();
          if (!active) return;
          const count = (status) =>
            mine.filter((a) => a.status === status).length;
          setStats([
            { label: "Total", value: mine.length },
            { label: "Pending", value: count("PENDING") },
            { label: "Confirmed", value: count("CONFIRMED") },
            { label: "Completed", value: count("COMPLETED") },
          ]);
          setAppointments(
            mine
              .filter((a) => ["PENDING", "CONFIRMED"].includes(a.status))
              .slice(0, 5),
          );
        }
      } catch {
        if (active) setError(true);
      }
    };

    if (user) load();
    return () => {
      active = false;
    };
  }, [user]);

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">
        Welcome back, {user?.name?.split(" ")[0]}
      </h1>
      <p className="mt-1 text-muted-foreground">
        {user?.role === "ADMIN"
          ? "Here's a quick look at your platform."
          : user?.role === "DOCTOR"
            ? "Here's an overview of your appointments."
            : "Here's an overview of your bookings."}
      </p>

      {error && (
        <p className="mt-8 text-sm text-muted-foreground">
          Could not load your dashboard data. Please try again later.
        </p>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(stats ?? Array.from({ length: 4 })).map((stat, i) => {
          if (!stat) {
            return (
              <div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />
            );
          }
          const card = (
            <Card key={stat.label}>
              <CardContent>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="mt-2 text-2xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          );
          return stat.url ? (
            <Link key={stat.label} to={stat.url}>
              {card}
            </Link>
          ) : (
            card
          );
        })}
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {user?.role === "ADMIN" ? "Latest appointments" : "Upcoming appointments"}
          </h2>
          <Link
            to="/dashboard/appointments"
            className="text-sm font-medium text-primary hover:underline"
          >
            View all →
          </Link>
        </div>

        {appointments.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            Nothing to show yet.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {appointments.map((a) => (
              <Card key={a._id}>
                <CardContent className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">
                      {user?.role === "USER"
                        ? `Dr. ${a.doctor?.name ?? "Doctor"}`
                        : (a.patient?.name ?? "Patient")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(a.date)} at {a.startTime}
                    </p>
                  </div>
                  <StatusBadge status={a.status} />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
