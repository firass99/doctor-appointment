import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { deleteUser, getUsers, updateRole } from "@/lib/api/users";
import { cn } from "@/lib/utils";

const ROLES = ["ADMIN", "DOCTOR", "USER"];

const ROLE_STYLES = {
  ADMIN: "bg-info/15 text-info",
  DOCTOR: "bg-success/15 text-success",
  USER: "bg-muted text-muted-foreground",
};

export default function UsersPage() {
  const { user: me } = useAuth();
  // login returns `id`, /users/me returns the full doc with `_id`
  const myId = me?._id ?? me?.id;
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("loading");
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      setUsers(await getUsers());
      setStatus("ready");
    } catch (error) {
      setStatus("error");
      toast.error(error.message || "Could not load users.");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleRole = async (id, role) => {
    setBusyId(id);
    try {
      await updateRole(id, { role });
      toast.success(`Role changed to ${role}.`);
      load();
    } catch (error) {
      toast.error(error.message || "Could not change the role.");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) return;
    setBusyId(id);
    try {
      await deleteUser(id);
      toast.success("User deleted.");
      load();
    } catch (error) {
      toast.error(error.message || "Could not delete the user.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Users</h1>
      <p className="mt-1 text-muted-foreground">
        Manage accounts and roles. To make someone a doctor, use the Doctors
        page so their profile is created too.
      </p>

      {status === "loading" && (
        <div className="mt-6 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      )}

      {status === "error" && (
        <p className="mt-6 text-sm text-muted-foreground">
          Could not load users.{" "}
          <button
            type="button"
            onClick={load}
            className="font-medium text-primary hover:underline"
          >
            Retry
          </button>
        </p>
      )}

      {status === "ready" && (
        <div className="mt-6 space-y-3">
          {users.map((u) => (
            <Card key={u._id}>
              <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate font-medium">{u.name}</p>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                        ROLE_STYLES[u.role],
                      )}
                    >
                      {u.role}
                    </span>
                    {u._id === myId && (
                      <span className="text-xs text-muted-foreground">(you)</span>
                    )}
                  </div>
                  <p className="truncate text-sm text-muted-foreground">
                    {u.email}
                    {u.phone && ` · ${u.phone}`}
                  </p>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <select
                    value={u.role}
                    disabled={busyId === u._id || u._id === myId}
                    onChange={(e) => handleRole(u._id, e.target.value)}
                    className="h-8 rounded-lg border border-input bg-transparent px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
                  >
                    {ROLES.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={busyId === u._id || u._id === myId}
                    onClick={() => handleDelete(u._id, u.name)}
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
