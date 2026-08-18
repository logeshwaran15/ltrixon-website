import Header from "@/components/Header";
import FounderSection from "@/components/FounderSection";
import FooterSection from "@/components/FooterSection";
import ChatBot from "@/components/ChatBot";
import PageLoader from "@/components/PageLoader";
import { useEffect } from "react";

const FounderPage = () => {
  // Ensure we start at the top of the page when navigating here
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="overflow-x-hidden min-h-screen bg-background">
      <PageLoader />
      <Header />
      <main className="pt-20"> {/* Add padding for fixed header */}
        <FounderSection />
      </main>
      <FooterSection />
      <ChatBot />
    </div>
  );
};

export default FounderPage;
