import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import projectPowerpack from "@/assets/project-powerpack.png";
import projectThillai from "@/assets/project-thillai.png";
import projectAts from "@/assets/project-ats.png";
import projectTsr from "@/assets/project-tsr.png";
import projectPerimas from "@/assets/project-perimas.png";
import projectSmartechon from "@/assets/project-smartechon.png";

const projects = [
  { 
    title: "Smartechon", 
    category: "Industrial Tech", 
    image: projectSmartechon, 
    link: "https://smartechon.com",
    description: "Cutting-edge industrial technology solutions and advanced smart manufacturing systems."
  },
  { 
    title: "Perima's Delight", 
    category: "Food & Culinary", 
    image: projectPerimas, 
    link: "https://perimasdelight.com/",
    description: "Premium food delivery platform specializing in traditional handmade dishes."
  },
  { 
    title: "TSR Foods", 
    category: "E-Commerce", 
    image: projectTsr, 
    link: "https://tsrfoods.in/",
    description: "Heat and eat products delivered fresh with zero preservatives."
  },
  { 
    title: "The Power Pack Supplements", 
    category: "Health & Fitness", 
    image: projectPowerpack, 
    link: "https://thepowerpacksupplements.in",
    description: "Modern e-commerce for high-performance fitness supplements."
  },
  { 
    title: "Thillai Construction", 
    category: "Corporate", 
    image: projectThillai, 
    link: "https://www.thillaiconstruction.com",
    description: "A professional architectural and construction showcase website."
  },
  { 
    title: "Compact Recruit Suite", 
    category: "Saas Platform", 
    image: projectAts, 
    link: "#",
    description: "Streamlined applicant tracking and recruitment management system."
  },
];

const ProjectsSection = () => (
  <section id="projects" className="section-padding bg-secondary/50 relative overflow-hidden">
    <div className="container mx-auto relative z-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <p className="text-primary font-bold text-[10px] uppercase tracking-[0.2em] mb-3">Our Showcase</p>
        <h2 className="heading-lg text-foreground">Recent Projects</h2>
        <div className="w-12 h-1 bg-primary mx-auto mt-4 rounded-full" />
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {projects.map((p, i) => (
          <motion.a
            key={p.title}
            href={p.link}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="group block bg-card rounded-sm overflow-hidden shadow-sm hover:shadow-xl border border-border/50 hover:border-primary/20 transition-all duration-300"
          >
            {/* Project image Container with full visibility */}
            <div className="relative aspect-[4/3] overflow-hidden bg-white flex items-center justify-center p-2">
              <img
                src={p.image}
                alt={p.title}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-500">
                  <ExternalLink size={18} className="text-primary-foreground" />
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="p-6">
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest block mb-2">{p.category}</span>
              <h3 className="text-foreground font-heading font-bold text-lg group-hover:text-primary transition-colors flex items-center justify-between">
                {p.title}
                <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity ml-2" />
              </h3>
              <p className="mt-2 text-muted-foreground text-xs leading-relaxed line-clamp-2">
                {p.description}
              </p>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  </section>
);

export default ProjectsSection;
