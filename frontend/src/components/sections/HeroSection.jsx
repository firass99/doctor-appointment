import React from "react";

function HeroSection() {
  return (
    <section className="w-full min-h-[80vh] flex items-center bg-[#F2F8F5]">
      <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row items-center gap-10">
        {/* Left: text + CTA */}
        <div className="w-full md:w-1/2">
          <p className="text-teal-600 font-medium">Allo Doctor</p>
          <h1 className="mt-3 text-4xl md:text-6xl font-extrabold leading-tight text-slate-900">
            See a doctor today, not next week.
          </h1>
          <p className="mt-5 max-w-md text-lg text-slate-600">
            Find a verified specialist near you and book in under a minute.
          </p>
          <a
            href="/book"
            className="mt-8 inline-block rounded-full bg-teal-600 px-7 py-3.5 font-medium text-white transition hover:bg-teal-700"
          >
            Book an appointment
          </a>
        </div>

        {/* Right: image */}
        <div className="w-full md:w-1/2">
          <img
            src="https://plus.unsplash.com/premium_photo-1658506671316-0b293df7c72b?q=80&w=1170&auto=format&fit=crop"
            alt="Doctor consulting a patient"
            className="w-full h-[320px] md:h-[480px] object-cover rounded-3xl shadow-xl"
          />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
