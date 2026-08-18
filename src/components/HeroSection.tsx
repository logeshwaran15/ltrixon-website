import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import useTypewriter from "@/hooks/useTypewriter";
import BookingModal from "./BookingModal";
import heroImage from "@/assets/founder-portrait.png";
import heroVideo from "@/assets/Futuristic_background_video_202604101654.mp4";

const HeroSection = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const { displayed, isTyping } = useTypewriter({
    words: [
      "HIGH-PERFORMANCE",
      "SCALABLE MOBILE & WEB",
      "ENTERPRISE-GRADE",
      "INNOVATIVE DIGITAL",
      "FUTURE-READY"
    ],
    typingSpeed: 60,
    deletingSpeed: 30,
    pauseDuration: 2500,
  });

  return (
    <section ref={ref} id="home" className="relative min-h-screen flex items-center section-padding pt-28 md:pt-32 overflow-hidden bg-background">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
      >
        <source src={heroVideo} type="video/mp4" />
      </video>
      {/* Dark Overlay to ensure text readability against the complex video */}
      <div className="absolute inset-0 z-0 bg-black/60" />

      <div className="container mx-auto relative z-10 flex flex-col items-center justify-center pt-10">
        {/* Centered Text */}
        <motion.div style={{ y: textY, opacity }} className="flex flex-col items-center text-center w-full max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-8 backdrop-blur-sm"
          >
            <Sparkles size={14} className="text-primary" />
            <span className="text-white font-semibold text-xs uppercase tracking-widest">Your Trusted Software Development Partner</span>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight drop-shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            BUILD POWERFUL{" "}
            <br className="hidden sm:block" />
            <span className="relative inline-block">
              <span className="text-primary">{displayed}</span>
              <span
                className="inline-block w-[3px] h-[0.85em] bg-primary ml-1 align-middle rounded-sm"
                style={{
                  animation: isTyping ? "none" : "blink 0.8s step-end infinite",
                  opacity: isTyping ? 1 : undefined,
                }}
              />
            </span>
            <br />
            SOLUTIONS
          </motion.h1>

          <motion.p
            className="text-gray-200 text-sm md:text-xl mb-10 leading-relaxed max-w-3xl px-4 md:px-0 drop-shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            We transform business visions into scalable mobile and web applications. From initial concept to market-ready deployment, our team delivers high-performance solutions tailored for growth.
          </motion.p>


        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
         <span className="text-white/70 text-xs uppercase tracking-widest">Scroll</span>
         <ChevronDown size={18} className="text-white/50" />
      </motion.div>

      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </section>
  );
};

export default HeroSection;
