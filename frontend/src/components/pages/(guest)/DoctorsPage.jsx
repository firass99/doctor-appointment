import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import DoctorCard from "@/components/DoctorCard";
import { getDoctors } from "@/lib/api/doctors";
import { getSpecialities } from "@/lib/api/specialities";
import { cn } from "@/lib/utils";

export default function DoctorsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const speciality = searchParams.get("speciality") ?? "";

  const [doctors, setDoctors] = useState([]);
  const [specialities, setSpecialities] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    getSpecialities().then(setSpecialities).catch(() => {});
  }, []);

  useEffect(() => {
    let active = true;
    setStatus("loading");
    getDoctors(speciality || undefined)
      .then((data) => active && (setDoctors(data), setStatus("ready")))
      .catch(() => active && setStatus("error"));
    return () => {
      active = false;
    };
  }, [speciality]);

  const onFilterChange = (id) => {
    if (id) setSearchParams({ speciality: id });
    else setSearchParams({});
  };

  return (
    <main className="container py-16">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold text-primary">Our doctors</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Find a specialist
        </h1>
        <p className="mt-4 text-muted-foreground">
          Filter by department to narrow down your search.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={() => onFilterChange("")}
          className={cn(
            "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
            !speciality
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-background hover:bg-muted",
          )}
        >
          All
        </button>
        {specialities.map((s) => (
          <button
            key={s._id}
            type="button"
            onClick={() => onFilterChange(s._id)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              speciality === s._id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background hover:bg-muted",
            )}
          >
            {s.name}
          </button>
        ))}
      </div>

      {status === "error" && (
        <p className="mt-12 text-center text-muted-foreground">
          Could not load doctors right now. Please try again later.
        </p>
      )}

      {status === "ready" && doctors.length === 0 && (
        <p className="mt-12 text-center text-muted-foreground">
          No doctors found for this department.
        </p>
      )}

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {status === "loading"
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-80 animate-pulse rounded-xl bg-muted" />
            ))
          : doctors.map((doctor) => (
              <DoctorCard key={doctor._id} doctor={doctor} />
            ))}
      </div>
    </main>
  );
}
