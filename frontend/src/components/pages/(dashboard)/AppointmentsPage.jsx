import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/StatusBadge";
import { useAuth } from "@/hooks/useAuth";
import {
  cancelAppointment,
  getAllAppointments,
  getMyAppointments,
  updateStatus,
} from "@/lib/api/appointments";
import { cn } from "@/lib/utils";

const STATUSES = ["ALL", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];

const formatDate = (value) =>
  new Date(value).toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default function AppointmentsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const isDoctor = user?.role === "DOCTOR";

  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [status, setStatus] = useState("loading");
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const query = filter === "ALL" ? undefined : filter;
      const data = isAdmin
        ? await getAllAppointments({ status: query })
        : await getMyAppointments(query);
      setAppointments(data);
      setStatus("ready");
    } catch (error) {
      setStatus("error");
      toast.error(error.message || "Could not load appointments.");
    }
  }, [filter, isAdmin]);

  useEffect(() => {
    load();
  }, [load]);

  const handleStatus = async (id, next) => {
    setBusyId(id);
    try {
      await updateStatus(id, { status: next });
      toast.success(`Appointment ${next.toLowerCase()}.`);
      load();
    } catch (error) {
      toast.error(error.message || "Could not update the appointment.");
    } finally {
      setBusyId(null);
    }
  };

  const handleCancel = async (id) => {
    setBusyId(id);
    try {
      await cancelAppointment(id);
      toast.success("Appointment cancelled.");
      load();
    } catch (error) {
      toast.error(error.message || "Could not cancel the appointment.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">
        {isAdmin ? "All appointments" : "My appointments"}
      </h1>
      <p className="mt-1 text-muted-foreground">
        {isDoctor
          ? "Confirm, complete or cancel the appointments booked with you."
          : isAdmin
            ? "Every appointment booked on the platform."
            : "Track and manage the appointments you booked."}
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition-colors",
              filter === s
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background hover:bg-muted",
            )}
          >
            {s.toLowerCase()}
          </button>
        ))}
      </div>

      {status === "loading" && (
        <div className="mt-6 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      )}

      {status === "error" && (
        <p className="mt-6 text-sm text-muted-foreground">
          Could not load appointments.{" "}
          <button
            type="button"
            onClick={load}
            className="font-medium text-primary hover:underline"
          >
            Retry
          </button>
        </p>
      )}

      {status === "ready" && appointments.length === 0 && (
        <p className="mt-6 text-sm text-muted-foreground">
          No appointments found for this filter.
        </p>
      )}

      {status === "ready" && appointments.length > 0 && (
        <div className="mt-6 space-y-3">
          {appointments.map((a) => (
            <Card key={a._id}>
              <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">
                      {user?.role === "USER"
                        ? `Dr. ${a.doctor?.name ?? "Doctor"}`
                        : (a.patient?.name ?? "Patient")}
                    </p>
                    <StatusBadge status={a.status} />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatDate(a.date)} · {a.startTime} – {a.endTime}
                  </p>
                  {isAdmin && (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Dr. {a.doctor?.name} · {a.patient?.email}
                    </p>
                  )}
                  {a.reason && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      Reason: {a.reason}
                    </p>
                  )}
                  {a.notes && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      Notes: {a.notes}
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 flex-wrap gap-2">
                  {(isDoctor || isAdmin) &&
                    !["CANCELLED", "COMPLETED"].includes(a.status) && (
                      <>
                        {a.status === "PENDING" && (
                          <Button
                            size="sm"
                            disabled={busyId === a._id}
                            onClick={() => handleStatus(a._id, "CONFIRMED")}
                          >
                            Confirm
                          </Button>
                        )}
                        {a.status === "CONFIRMED" && (
                          <Button
                            size="sm"
                            variant="secondary"
                            disabled={busyId === a._id}
                            onClick={() => handleStatus(a._id, "COMPLETED")}
                          >
                            Complete
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={busyId === a._id}
                          onClick={() => handleStatus(a._id, "CANCELLED")}
                        >
                          Cancel
                        </Button>
                      </>
                    )}

                  {user?.role === "USER" &&
                    !["CANCELLED", "COMPLETED"].includes(a.status) && (
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={busyId === a._id}
                        onClick={() => handleCancel(a._id)}
                      >
                        Cancel
                      </Button>
                    )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
