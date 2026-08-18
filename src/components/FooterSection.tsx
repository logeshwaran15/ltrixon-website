import { motion } from "framer-motion";
import { Mail, Phone, MapPin, ArrowUp, Settings } from "lucide-react";
import LtrixonLogo from "./LtrixonLogo";

const FooterSection = () => (
  <footer className="bg-black text-white relative overflow-hidden">
    <div className="h-1 bg-primary" />

    <div className="section-padding pb-8">
      <div className="container mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12 lg:mb-16">
          <div className="sm:col-span-2 lg:col-span-1">
            <a href="#" className="mb-5 block">
              <LtrixonLogo size="md" />
            </a>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              Building powerful software solutions for businesses worldwide. Quality, innovation, and reliability.
            </p>
            <div className="flex gap-3">
              {["X", "Li", "Gh", "Ig"].map((s) => (
                <div key={s} className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-white/50 hover:bg-primary hover:text-background transition-all duration-300 cursor-pointer text-xs font-bold">
                  {s}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-heading font-bold uppercase text-sm mb-4 tracking-wider">Quick Links</h4>
            <ul className="space-y-2.5">
              {["Home", "About", "Services", "Projects"].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: "smooth" })}
                    className="text-white/50 hover:text-primary hover:translate-x-1 transition-all duration-300 text-sm inline-block"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold uppercase text-sm mb-4 tracking-wider">Services</h4>
            <ul className="space-y-2.5">
              {["Web Development", "Mobile Apps", "Custom Software"].map((item) => (
                <li key={item}>
                  <span className="text-white/50 hover:text-primary transition-colors text-sm cursor-pointer">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold uppercase text-sm mb-4 tracking-wider">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-white/50 text-sm">
                <Mail size={16} className="text-primary shrink-0" /> ltrixon2026@gmail.com
              </li>
              <li className="flex items-center gap-3 text-white/50 text-sm">
                <Phone size={16} className="text-primary shrink-0" /> +91 6369641717
              </li>
              <li className="flex items-center gap-3 text-white/50 text-sm">
                <MapPin size={16} className="text-primary shrink-0" /> India
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 relative">
          <div className="flex items-center gap-2">
            <p className="text-white/30 text-sm">
              © {new Date().getFullYear()} Ltrixon. All rights reserved.
            </p>
            {/* Hidden admin trigger */}
            <a href="/login" aria-label="Admin Login" className="opacity-5 hover:opacity-100 transition-opacity duration-300 ml-1 mt-0.5">
              <Settings size={14} className="text-white/50 hover:text-primary transition-colors" />
            </a>
          </div>
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            whileHover={{ y: -3 }}
            className="w-10 h-10 rounded-lg bg-primary/20 hover:bg-primary flex items-center justify-center text-primary hover:text-background transition-all"
          >
            <ArrowUp size={18} />
          </motion.button>
        </div>
      </div>
    </div>
  </footer>
);

export default FooterSection;
