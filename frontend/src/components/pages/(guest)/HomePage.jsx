import FeaturesSection from "@/components/sections/FeaturesSection";
import AboutSection from "@/components/sections/AboutSection";
import TipsSection from "@/components/sections/TipsSection";
import Navbar from "@/components/sections/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import AppointmentsSection from "@/components/sections/AppointmentsSection";

export default function HomePage() {
  return (
    <main className="">
      <Navbar />
      <HeroSection />
      <AppointmentsSection />
      <FeaturesSection />
      <AboutSection />
      <TipsSection />
    </main>
  );
}
