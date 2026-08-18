import { motion } from "framer-motion";
import { Code, Globe, Smartphone, Database, Cloud, Shield, ArrowUpRight } from "lucide-react";

const services = [
  { icon: Code, title: "Custom Software", desc: "Tailored solutions built from the ground up for your unique business needs.", image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop" },
  { icon: Globe, title: "Web Development", desc: "High-performance web applications with modern frameworks and best practices.", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop" },
  { icon: Smartphone, title: "Mobile Apps", desc: "Native and cross-platform mobile applications that users love.", image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2070&auto=format&fit=crop" },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
  }),
};

const ServicesSection = () => (
  <section id="services" className="section-padding bg-secondary relative overflow-hidden">
    {/* Decorative corner accent */}
    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-bl-[100px]" />

    <div className="container mx-auto relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">What We Do</p>
        <h2 className="heading-lg text-foreground">Our Wide Range of Services</h2>
        <div className="w-16 h-1 bg-primary mx-auto mt-4 rounded-full" />
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((s, i) => (
          <motion.div
            key={s.title}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={cardVariants}
            whileHover={{ y: -10, transition: { duration: 0.3 } }}
            className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl border border-border/50 hover:border-primary/30 transition-all duration-500 cursor-pointer"
          >
            {/* Attractive Image Visual Area */}
            <div className="relative h-56 overflow-hidden bg-muted">
              {/* Image Background */}
              <img 
                src={s.image} 
                alt={s.title} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              {/* Overlay for better text and icon visibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-500" />
              
              {/* Floating Icon */}
              <div className="absolute top-4 left-4 z-10 transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1">
                 <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-primary group-hover:border-primary transition-all duration-300 shadow-xl">
                    <s.icon className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" />
                 </div>
              </div>
            </div>

            <div className="p-8 relative">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-bold text-foreground text-xl group-hover:text-primary transition-colors">{s.title}</h3>
                <ArrowUpRight size={20} className="text-muted-foreground/0 group-hover:text-primary transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                {s.desc}
              </p>
              <div className="flex items-center gap-2 text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Learn More <ArrowUpRight size={14} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ServicesSection;
