import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FounderSection from "@/components/FounderSection";
import ServicesSection from "@/components/ServicesSection";
import AboutSection from "@/components/AboutSection";
import TechStackSection from "@/components/TechStackSection";
import ProjectsSection from "@/components/ProjectsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";
import CTASection from "@/components/CTASection";
import FooterSection from "@/components/FooterSection";
import ChatBot from "@/components/ChatBot";
import PageLoader from "@/components/PageLoader";

const Index = () => (
  <div className="overflow-x-hidden">
    <PageLoader />
    <Header />
    <HeroSection />
    <ProjectsSection />
    <ServicesSection />
    <TechStackSection />
    <AboutSection />
    <TestimonialsSection />
    <CTASection />
    <ContactSection />
    <FooterSection />
    <ChatBot />
  </div>
);

export default Index;
