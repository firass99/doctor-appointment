import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DoctorCard from "@/components/DoctorCard";
import { getDoctors } from "@/lib/api/doctors";

export default function FeaturedDoctorsSection() {
  const [doctors, setDoctors] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let active = true;
    getDoctors()
      .then((data) => {
        if (active) {
          setDoctors(data.slice(0, 4));
          setStatus("ready");
        }
      })
      .catch(() => active && setStatus("error"));
    return () => {
      active = false;
    };
  }, []);

  if (status === "error" || (status === "ready" && doctors.length === 0)) {
    return null;
  }

  return (
    <section>
      <div className="container">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-primary">Our doctors</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Meet our specialists
            </h2>
          </div>
          <Link
            to="/doctors"
            className="text-sm font-medium text-primary hover:underline"
          >
            View all doctors →
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {status === "loading"
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-80 animate-pulse rounded-xl bg-muted" />
              ))
            : doctors.map((doctor) => (
                <DoctorCard key={doctor._id} doctor={doctor} />
              ))}
        </div>
      </div>
    </section>
  );
}
