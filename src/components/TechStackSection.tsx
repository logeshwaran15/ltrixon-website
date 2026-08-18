import { motion } from "framer-motion";
import { Zap, Cpu, LineChart, Layers, Lock, RefreshCw } from "lucide-react";

const features = [
  { icon: Zap, title: "Lightning Fast", desc: "Optimized for speed and performance at every layer." },
  { icon: Cpu, title: "AI-Powered", desc: "Intelligent automation and machine learning integration." },
  { icon: LineChart, title: "Analytics Built-in", desc: "Real-time insights and data-driven decision making." },
  { icon: Layers, title: "Scalable Architecture", desc: "Built to grow with your business from day one." },
  { icon: Lock, title: "Enterprise Security", desc: "Bank-grade security and compliance standards." },
  { icon: RefreshCw, title: "Continuous Delivery", desc: "Agile workflows with automated CI/CD pipelines." },
];

const TechStackSection = () => (
  <section className="section-padding relative overflow-hidden">
    <div className="container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">Why Choose Us</p>
        <h2 className="heading-lg text-foreground">Built With Modern Technology</h2>
        <div className="w-16 h-1 bg-primary mx-auto mt-4 rounded-full" />
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="group flex items-start gap-4 p-4 rounded-xl hover:bg-secondary transition-colors duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
              <f.icon className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-foreground mb-1">{f.title}</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TechStackSection;
