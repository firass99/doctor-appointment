import { Link } from "react-router-dom";
import { Star, Briefcase } from "lucide-react";
import Photo from "@/components/Photo";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function DoctorCard({ doctor }) {
  const name = doctor.user?.name ?? "Doctor";
  const speciality = doctor.speciality?.name ?? "General";

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <Photo
        src={doctor.user?.photo}
        alt={name}
        className="h-48 w-full"
      />
      <CardContent className="flex flex-col gap-2">
        <p className="text-xs font-medium text-primary">{speciality}</p>
        <h3 className="text-lg font-semibold">Dr. {name}</h3>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Briefcase className="size-3.5" />
            {doctor.experienceYears ?? 0} yrs
          </span>
          <span className="flex items-center gap-1">
            <Star className="size-3.5 text-warning" />
            New
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <span className="font-semibold">
          {doctor.price ? `${doctor.price} TND` : "Free"}
        </span>
        <Link
          to={`/doctors/${doctor.user?._id ?? doctor._id}`}
          className={cn(buttonVariants({ size: "sm" }))}
        >
          View profile
        </Link>
      </CardFooter>
    </Card>
  );
}
