import HeroSection from "@/components/sections/HeroSection";
import ServicesSection from "@/components/sections/ServicesSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import AboutSection from "@/components/sections/AboutSection";
import FeaturedDoctorsSection from "@/components/sections/FeaturedDoctorsSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import CTASection from "@/components/sections/CTASection";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <ServicesSection />
      <HowItWorksSection />
      <AboutSection />
      <FeaturedDoctorsSection />
      <TestimonialsSection />
      <CTASection />
    </main>
  );
}
