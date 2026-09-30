import { Link } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";
import Photo from "../Photo";

export default function AboutSection() {
  return (
    <section id="about" className="py-16 md:py-24">
      <div className="container grid items-center gap-10 md:grid-cols-2">
        <div className="order-2 md:order-1">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Care you can trust, on your schedule
          </h2>
          <p className="mt-4 max-w-prose text-muted-foreground">
            Every doctor on DocCare has a profile with their speciality,
            experience and consultation price, so you know who you are booking
            before you confirm.
          </p>
          <p className="mt-3 max-w-prose text-muted-foreground">
            Doctors set their own working hours, which means the times you see
            are the times they can really see you.
          </p>
          <Link
            to="/doctors"
            className={`${buttonVariants({ size: "lg" })} mt-8`}
          >
            Meet our doctors
          </Link>
        </div>

        <Photo
          src="/images/doctor-2.jpg"
          alt="Doctor with a stethoscope, arms crossed"
          className="order-1 h-80 w-full rounded-2xl shadow-lg sm:h-96 md:order-2 md:h-[28rem]"
        />
      </div>
    </section>
  );
}
