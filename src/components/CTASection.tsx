import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import BookingModal from "./BookingModal";

const CTASection = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  return (
    <section ref={ref} className="relative overflow-hidden section-padding">
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 bg-primary"
      />
      {/* Decorative shapes */}
      <div className="absolute top-0 left-0 w-48 h-48 rounded-full bg-primary-foreground/5 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-primary-foreground/5 translate-x-1/3 translate-y-1/3" />
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
        backgroundSize: "40px 40px"
      }} />

      <div className="relative z-10 container mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="heading-lg text-primary-foreground mb-4"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Ready to Build Your Next Product?
          </motion.h2>
          <p className="text-primary-foreground/80 max-w-lg mx-auto mb-8 text-lg">
            Let's discuss how we can help transform your ideas into powerful digital solutions.
          </p>
          <Button
            size="lg"
            onClick={() => setIsBookingOpen(true)}
            className="group rounded-lg bg-foreground text-primary-foreground hover:bg-foreground/90 font-semibold px-10 gap-2 shadow-xl hover:shadow-2xl transition-all"
          >
            Contact Us <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </section>
  );
};

export default CTASection;
