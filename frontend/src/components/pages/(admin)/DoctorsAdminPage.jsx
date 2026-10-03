import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { createDoctor, getDoctors, setDoctorActive } from "@/lib/api/doctors";
import { getSpecialities } from "@/lib/api/specialities";
import { getUsers } from "@/lib/api/users";

const selectClass =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50";

export default function DoctorsAdminPage() {
  const [doctors, setDoctors] = useState([]);
  const [specialities, setSpecialities] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [status, setStatus] = useState("loading");
  const [busyId, setBusyId] = useState(null);

  const [userId, setUserId] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const [docs, specs, users] = await Promise.all([
        getDoctors(),
        getSpecialities(true),
        getUsers(),
      ]);
      setDoctors(docs);
      setSpecialities(specs);
      setCandidates(users.filter((u) => u.role === "USER"));
      setStatus("ready");
    } catch (error) {
      setStatus("error");
      toast.error(error.message || "Could not load doctors.");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!userId || !speciality) {
      toast.error("Pick a user and a speciality.");
      return;
    }
    setCreating(true);
    try {
      await createDoctor({ userId, speciality });
      toast.success("Doctor profile created.");
      setUserId("");
      setSpeciality("");
      load();
    } catch (error) {
      toast.error(error.message || "Could not create the doctor profile.");
    } finally {
      setCreating(false);
    }
  };

  const handleActive = async (id, isActive) => {
    setBusyId(id);
    try {
      await setDoctorActive(id, isActive);
      toast.success(isActive ? "Doctor is now visible." : "Doctor hidden.");
      load();
    } catch (error) {
      toast.error(error.message || "Could not update the doctor.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Doctors</h1>
      <p className="mt-1 text-muted-foreground">
        Promote a patient account into a doctor, and control who appears on the
        public site.
      </p>

      <Card className="mt-6 max-w-xl">
        <CardContent>
          <h2 className="font-semibold">Add a doctor</h2>
          <form onSubmit={handleCreate} className="mt-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="userId">User</FieldLabel>
                <select
                  id="userId"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className={selectClass}
                >
                  <option value="">Select a user…</option>
                  {candidates.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name} — {u.email}
                    </option>
                  ))}
                </select>
              </Field>

              <Field>
                <FieldLabel htmlFor="speciality">Speciality</FieldLabel>
                <select
                  id="speciality"
                  value={speciality}
                  onChange={(e) => setSpeciality(e.target.value)}
                  className={selectClass}
                >
                  <option value="">Select a speciality…</option>
                  {specialities.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </Field>

              <Button type="submit" disabled={creating}>
                {creating ? "Creating..." : "Create doctor profile"}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <h2 className="mt-10 font-semibold">Active doctors</h2>

      {status === "loading" && (
        <div className="mt-4 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      )}

      {status === "ready" && doctors.length === 0 && (
        <p className="mt-4 text-sm text-muted-foreground">No doctors yet.</p>
      )}

      {status === "ready" && doctors.length > 0 && (
        <div className="mt-4 space-y-3">
          {doctors.map((d) => (
            <Card key={d._id}>
              <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="truncate font-medium">
                    Dr. {d.user?.name ?? "Unknown"}
                  </p>
                  <p className="truncate text-sm text-muted-foreground">
                    {d.speciality?.name} · {d.price ?? 0} TND ·{" "}
                    {d.experienceYears ?? 0} yrs
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={busyId === d.user?._id}
                  onClick={() => handleActive(d.user?._id, !d.isActive)}
                >
                  {d.isActive ? "Hide" : "Show"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
