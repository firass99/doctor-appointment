import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  HeartPulse,
  Stethoscope,
  Brain,
  Bone,
  Baby,
  Eye,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getSpecialities } from "@/lib/api/specialities";

const ICONS = [HeartPulse, Stethoscope, Brain, Bone, Baby, Eye];

export default function DepartmentsPage() {
  const [specialities, setSpecialities] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let active = true;
    getSpecialities()
      .then((data) => active && (setSpecialities(data), setStatus("ready")))
      .catch(() => active && setStatus("error"));
    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="container py-16">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold text-primary">Departments</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Browse our medical specialities
        </h1>
        <p className="mt-4 text-muted-foreground">
          Pick a department to see the doctors available in that field.
        </p>
      </div>

      {status === "error" && (
        <p className="mt-12 text-center text-muted-foreground">
          Could not load departments right now. Please try again later.
        </p>
      )}

      {status === "ready" && specialities.length === 0 && (
        <p className="mt-12 text-center text-muted-foreground">
          No departments available yet.
        </p>
      )}

      <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {status === "loading"
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-36 animate-pulse rounded-xl bg-muted" />
            ))
          : specialities.map((speciality, i) => {
              const Icon = ICONS[i % ICONS.length];
              return (
                <Link key={speciality._id} to={`/doctors?speciality=${speciality._id}`}>
                  <Card className="h-full items-center text-center transition-shadow hover:shadow-md">
                    <CardContent className="flex flex-col items-center gap-3">
                      <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Icon className="size-7" />
                      </div>
                      <div>
                        <p className="font-semibold">{speciality.name}</p>
                        {speciality.description && (
                          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                            {speciality.description}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
      </div>
    </main>
  );
}
