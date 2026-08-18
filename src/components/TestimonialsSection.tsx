import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  { name: "Rajesh Kumar", role: "Founder, The Power Pack", text: "The Ltrixon team perfectly understood our business requirements and delivered beyond expectations. Exceptional quality and strictly on time!", rating: 5 },
  { name: "Priya Dharshini", role: "CEO, Perima's Delight", text: "Our food delivery platform was highly complex, but Ltrixon handled the development seamlessly. They built a solution that truly connects with our audience.", rating: 5 },
  { name: "Logesh", role: "Tech Lead, Smartechon", text: "Technically exceptional. They designed a specialized UI/UX for our engineering products that exceeded our standards. Truly impressed!", rating: 5 },
  { name: "Vignesh S", role: "Director, Thillai Construction", text: "We needed a premium website for our architecture firm, and the results were exactly what we envisioned. Outstanding work from a great team!", rating: 5 },
];

const doubled = [...testimonials, ...testimonials];

const TestimonialsSection = () => (
  <section className="section-padding overflow-hidden">
    <div className="container mx-auto mb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">Testimonials</p>
        <h2 className="heading-lg text-foreground">What Our Clients Say</h2>
        <div className="w-16 h-1 bg-primary mx-auto mt-4 rounded-full" />
      </motion.div>
    </div>

    {/* Marquee */}
    <div className="relative">
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
      <motion.div
        className="flex gap-6"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((t, i) => (
          <div
            key={`${t.name}-${i}`}
            className="shrink-0 w-80 bg-card border border-border rounded-xl p-6 hover:border-primary/30 hover:shadow-card-hover transition-all duration-300"
          >
            <div className="flex gap-1 mb-4">
              {Array.from({ length: t.rating }).map((_, j) => (
                <Star key={j} size={14} className="fill-primary text-primary" />
              ))}
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4 italic">"{t.text}"</p>
            <div>
              <p className="font-heading font-bold text-foreground text-sm">{t.name}</p>
              <p className="text-muted-foreground text-xs">{t.role}</p>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default TestimonialsSection;
