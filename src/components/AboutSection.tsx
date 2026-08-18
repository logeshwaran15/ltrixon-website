import { motion } from "framer-motion";
import { Target, Eye, Award } from "lucide-react";

const highlights = [
  { icon: Target, title: "Our Mission", desc: "To deliver exceptional quality and consistency in every project we work on.", bg: "bg-foreground text-primary-foreground" },
  { icon: Eye, title: "Our Vision", desc: "To be the most trusted software partner for businesses worldwide.", bg: "bg-primary text-primary-foreground" },
  { icon: Award, title: "Experience", desc: "Years of expertise delivering professional solutions on time and budget.", bg: "bg-secondary text-foreground border border-border" },
];

const AboutSection = () => (
  <section id="about" className="section-padding relative overflow-hidden">
    {/* Decorative dots pattern */}
    <div className="absolute top-10 left-10 grid grid-cols-5 gap-3 opacity-10">
      {Array.from({ length: 25 }).map((_, i) => (
        <div key={i} className="w-2 h-2 rounded-full bg-primary" />
      ))}
    </div>

    <div className="container mx-auto max-w-5xl">
      <div className="flex flex-col lg:flex-row gap-16 items-start">
        <div className="lg:w-1/2">
          <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">Who We Are</p>
          <h2 className="heading-lg text-foreground mb-2 text-primary font-bold">About Ltrixon Solutions</h2>
          <div className="w-16 h-1 bg-primary rounded-full mb-6" />
          <p className="text-muted-foreground leading-relaxed mb-8 text-lg">
            Ltrixon is committed to providing top-tier software development services to businesses of all sizes. With a comprehensive portfolio that includes web applications, mobile apps, cloud solutions, and more, our team is ready to tackle projects of any scale.
          </p>
        </div>

        <div className="lg:w-1/2">
          <div className="grid gap-4">
            {highlights.map((h, i) => (
              <motion.div
                key={h.title}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ x: 8 }}
                className={`${h.bg} rounded-xl p-5 flex items-start gap-4 cursor-pointer transition-shadow hover:shadow-lg`}
              >
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                  <h.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm uppercase mb-1">{h.title}</h4>
                  <p className="text-sm opacity-80">{h.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default AboutSection;
