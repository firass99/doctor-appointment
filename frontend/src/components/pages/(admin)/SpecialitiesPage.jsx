import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  createSpeciality,
  deleteSpeciality,
  getSpecialities,
  updateSpeciality,
} from "@/lib/api/specialities";

export default function SpecialitiesPage() {
  const [specialities, setSpecialities] = useState([]);
  const [status, setStatus] = useState("loading");
  const [busyId, setBusyId] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      setSpecialities(await getSpecialities(true));
      setStatus("ready");
    } catch (error) {
      setStatus("error");
      toast.error(error.message || "Could not load specialities.");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("A name is required.");
      return;
    }
    setCreating(true);
    try {
      await createSpeciality({ name: name.trim(), description: description.trim() });
      toast.success("Speciality created.");
      setName("");
      setDescription("");
      load();
    } catch (error) {
      toast.error(error.message || "Could not create the speciality.");
    } finally {
      setCreating(false);
    }
  };

  const handleToggle = async (s) => {
    setBusyId(s._id);
    try {
      await updateSpeciality(s._id, { isActive: !s.isActive });
      toast.success(s.isActive ? "Speciality hidden." : "Speciality visible.");
      load();
    } catch (error) {
      toast.error(error.message || "Could not update the speciality.");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (s) => {
    if (!window.confirm(`Delete "${s.name}"? This cannot be undone.`)) return;
    setBusyId(s._id);
    try {
      await deleteSpeciality(s._id);
      toast.success("Speciality deleted.");
      load();
    } catch (error) {
      toast.error(error.message || "Could not delete the speciality.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Specialities</h1>
      <p className="mt-1 text-muted-foreground">
        The departments patients browse. Hide one instead of deleting it if
        doctors still use it.
      </p>

      <Card className="mt-6 max-w-xl">
        <CardContent>
          <h2 className="font-semibold">Add a speciality</h2>
          <form onSubmit={handleCreate} className="mt-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Cardiology"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Heart and blood vessels"
                />
              </Field>
              <Button type="submit" disabled={creating}>
                {creating ? "Creating..." : "Create speciality"}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      {status === "loading" && (
        <div className="mt-10 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      )}

      {status === "ready" && (
        <div className="mt-10 space-y-3">
          {specialities.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No specialities yet.
            </p>
          )}
          {specialities.map((s) => (
            <Card key={s._id}>
              <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{s.name}</p>
                    {!s.isActive && (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                        HIDDEN
                      </span>
                    )}
                  </div>
                  {s.description && (
                    <p className="text-sm text-muted-foreground">
                      {s.description}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={busyId === s._id}
                    onClick={() => handleToggle(s)}
                  >
                    {s.isActive ? "Hide" : "Show"}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={busyId === s._id}
                    onClick={() => handleDelete(s)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
