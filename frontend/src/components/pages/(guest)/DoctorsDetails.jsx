import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Briefcase, Clock, Wallet } from "lucide-react";
import Photo from "@/components/Photo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getDoctorById, getDoctorSlots } from "@/lib/api/doctors";
import { createAppointment } from "@/lib/api/appointments";
import { useAuth } from "@/hooks/useAuth";

const todayISO = () => new Date().toISOString().slice(0, 10);

export default function DoctorsDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [doctor, setDoctor] = useState(null);
  const [status, setStatus] = useState("loading");

  const [date, setDate] = useState(todayISO());
  const [slots, setSlots] = useState([]);
  const [slotsStatus, setSlotsStatus] = useState("idle");
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    let active = true;
    getDoctorById(id)
      .then((data) => active && (setDoctor(data), setStatus("ready")))
      .catch(() => active && setStatus("error"));
    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    if (!date) return;
    let active = true;
    setSlotsStatus("loading");
    getDoctorSlots(id, date)
      .then((data) => active && (setSlots(data.slots), setSlotsStatus("ready")))
      .catch(() => active && setSlotsStatus("error"));
    return () => {
      active = false;
    };
  }, [id, date]);

  const canBook = useMemo(() => !user || user.role === "USER", [user]);

  const handleBook = async (slot) => {
    if (!isAuthenticated) {
      toast.info("Please sign in to book an appointment.");
      navigate("/login");
      return;
    }
    if (!canBook) {
      toast.error("Only patients can book appointments.");
      return;
    }

    setBooking(slot.startTime);
    try {
      await createAppointment({
        doctor: id,
        date,
        startTime: slot.startTime,
        endTime: slot.endTime,
      });
      toast.success("Appointment booked! Check your dashboard for details.");
      setSlots((prev) => prev.filter((s) => s.startTime !== slot.startTime));
    } catch (error) {
      toast.error(error.message || "Could not book this slot.");
    } finally {
      setBooking(null);
    }
  };

  if (status === "loading") {
    return (
      <main className="container py-16">
        <div className="h-96 animate-pulse rounded-xl bg-muted" />
      </main>
    );
  }

  if (status === "error" || !doctor) {
    return (
      <main className="container py-24 text-center">
        <h1 className="text-2xl font-semibold">Doctor not found</h1>
        <p className="mt-2 text-muted-foreground">
          This doctor profile doesn't exist or is no longer available.
        </p>
      </main>
    );
  }

  const name = doctor.user?.name ?? "Doctor";

  return (
    <main className="container py-16">
      <div className="grid gap-10 md:grid-cols-3">
        <div className="md:col-span-1">
          <Photo
            src={doctor.user?.photo}
            alt={name}
            className="aspect-square w-full rounded-2xl shadow-lg"
          />
        </div>

        <div className="md:col-span-2">
          <p className="text-sm font-semibold text-primary">
            {doctor.speciality?.name ?? "General"}
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">
            Dr. {name}
          </h1>

          <div className="mt-4 flex flex-wrap gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Briefcase className="size-4 text-primary" />
              {doctor.experienceYears ?? 0} years of experience
            </span>
            <span className="flex items-center gap-2">
              <Wallet className="size-4 text-primary" />
              {doctor.price ? `${doctor.price} TND / consultation` : "Free"}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="size-4 text-primary" />
              {doctor.slotDuration ?? 30} min per appointment
            </span>
          </div>

          {doctor.bio && (
            <p className="mt-6 max-w-prose text-muted-foreground">
              {doctor.bio}
            </p>
          )}

          <Card className="mt-10">
            <CardContent>
              <h2 className="text-lg font-semibold">Book an appointment</h2>

              <div className="mt-4">
                <label className="text-sm font-medium" htmlFor="date">
                  Choose a date
                </label>
                <input
                  id="date"
                  type="date"
                  min={todayISO()}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 block rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
              </div>

              <div className="mt-6">
                {slotsStatus === "loading" && (
                  <p className="text-sm text-muted-foreground">
                    Loading available slots...
                  </p>
                )}
                {slotsStatus === "error" && (
                  <p className="text-sm text-muted-foreground">
                    Could not load slots for this date.
                  </p>
                )}
                {slotsStatus === "ready" && slots.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No free slots on this date. Try another day.
                  </p>
                )}
                {slotsStatus === "ready" && slots.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {slots.map((slot) => (
                      <Button
                        key={slot.startTime}
                        variant="outline"
                        size="sm"
                        disabled={booking === slot.startTime}
                        onClick={() => handleBook(slot)}
                      >
                        {slot.startTime}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
