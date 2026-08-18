import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Users, Briefcase, Award, Clock } from "lucide-react";

const stats = [
  { icon: Users, value: 150, suffix: "+", label: "Happy Clients" },
  { icon: Briefcase, value: 300, suffix: "+", label: "Projects Delivered" },
  { icon: Award, value: 12, suffix: "+", label: "Years Experience" },
  { icon: Clock, value: 99, suffix: "%", label: "On-Time Delivery" },
];

const Counter = ({ target, suffix }: { target: number; suffix: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
};

const StatsSection = () => (
  <section className="section-padding bg-secondary/50 relative overflow-hidden">
    {/* Diagonal accent */}
    <div className="absolute top-0 left-0 w-full h-1 bg-primary/20" />

    <div className="container mx-auto">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15, duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center group"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
              <stat.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
            </div>
            <div className="text-4xl md:text-5xl font-heading font-extrabold text-foreground mb-2">
              <Counter target={stat.value} suffix={stat.suffix} />
            </div>
            <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default StatsSection;
