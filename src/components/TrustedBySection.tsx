import { motion } from "framer-motion";

const logos = ["TechCorp", "InnovateLab", "ScaleUp", "DataFlow", "CloudPeak", "NexGen"];
const doubled = [...logos, ...logos];

const TrustedBySection = () => (
  <section className="py-14 border-y border-border bg-secondary overflow-hidden">
    <div className="container mx-auto px-6 mb-8">
      <p className="text-center text-sm font-semibold uppercase tracking-widest text-muted-foreground">
        Companies We've Proudly Worked With
      </p>
    </div>
    {/* Infinite scroll marquee */}
    <div className="relative">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-secondary to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-secondary to-transparent z-10" />
      <motion.div
        className="flex gap-16 items-center whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((name, i) => (
          <span
            key={`${name}-${i}`}
            className="text-muted-foreground/30 font-heading font-bold text-2xl md:text-3xl tracking-tight select-none shrink-0 hover:text-primary/50 transition-colors duration-500"
          >
            {name}
          </span>
        ))}
      </motion.div>
    </div>
  </section>
);

export default TrustedBySection;
