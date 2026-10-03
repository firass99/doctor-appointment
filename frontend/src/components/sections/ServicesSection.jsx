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

// Cycled over as a visual fallback since specialities don't always ship an icon
const ICONS = [HeartPulse, Stethoscope, Brain, Bone, Baby, Eye];

export default function ServicesSection() {
  const [specialities, setSpecialities] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let active = true;
    getSpecialities()
      .then((data) => {
        if (active) {
          setSpecialities(data);
          setStatus("ready");
        }
      })
      .catch(() => active && setStatus("error"));
    return () => {
      active = false;
    };
  }, []);

  if (status === "error" || (status === "ready" && specialities.length === 0)) {
    return null;
  }

  return (
    <section id="services" className="bg-muted/30">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold text-primary">Specialities</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Care for every need
          </h2>
          <p className="mt-4 text-muted-foreground">
            Browse our departments and find the right specialist for your
            symptoms.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {status === "loading"
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-32 animate-pulse rounded-xl bg-muted"
                />
              ))
            : specialities.slice(0, 6).map((speciality, i) => {
                const Icon = ICONS[i % ICONS.length];
                return (
                  <Link key={speciality._id} to={`/doctors?speciality=${speciality._id}`}>
                    <Card className="h-full items-center justify-center text-center transition-shadow hover:shadow-md">
                      <CardContent className="flex flex-col items-center gap-3 py-2">
                        <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Icon className="size-6" />
                        </div>
                        <p className="text-sm font-medium">{speciality.name}</p>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/departments"
            className="text-sm font-medium text-primary hover:underline"
          >
            View all departments →
          </Link>
        </div>
      </div>
    </section>
  );
}
