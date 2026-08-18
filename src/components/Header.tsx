import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LtrixonLogo from "./LtrixonLogo";
import BookingModal from "./BookingModal";

const navItems = ["Home", "Projects", "Services", "About", "Founder", "Contact"];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (location.pathname === "/") {
        const sections = navItems.filter(item => item !== "Founder").map((item) => ({
          id: item.toLowerCase(),
          el: document.getElementById(item.toLowerCase()),
        }));

        for (let i = sections.length - 1; i >= 0; i--) {
          const el = sections[i].el;
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= 150) {
              setActiveSection(sections[i].id);
              break;
            }
          }
        }
      } else if (location.pathname === "/founder") {
        setActiveSection("founder");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  const handleNavClick = (item: string) => {
    const id = item.toLowerCase();
    setMobileOpen(false);

    if (id === "founder") {
      navigate("/founder");
      return;
    }

    if (location.pathname !== "/") {
      navigate("/#" + id);
    } else {
      const el = document.getElementById(id);
      if (id === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        el?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <motion.header
      initial={{ y: -100, x: "-50%", opacity: 0 }}
      animate={{ y: 0, x: "-50%", opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-3 left-1/2 z-50 w-[calc(100%-1.5rem)] max-w-5xl"
    >
      <nav className="backdrop-blur-lg bg-black text-white rounded-full px-4 sm:px-6 py-1.5 flex items-center justify-between shadow-2xl border border-white/10">
        <div className="shrink-0 flex items-center">
          <Link to="/" onClick={() => window.scrollTo(0, 0)} className="flex-shrink-0">
            <LtrixonLogo size="md" />
          </Link>
        </div>

        <ul className="hidden md:flex items-center gap-6 lg:gap-8 flex-shrink-0">
          {navItems.map((item) => (
            <li key={item}>
              <button
                onClick={() => handleNavClick(item)}
                className={`text-[11px] lg:text-xs font-bold tracking-widest transition-all duration-300 relative group uppercase ${
                  activeSection === item.toLowerCase()
                    ? "text-primary"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {item}
                <span className={`absolute -bottom-1 left-0 w-full h-[2px] bg-primary transition-transform duration-300 origin-left ${
                  activeSection === item.toLowerCase() ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                }`} />
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <Button
              size="sm"
              onClick={() => setIsBookingOpen(true)}
              className="rounded-full bg-[#F97316] text-white hover:bg-orange-600 font-black px-6 text-[11px] h-9 uppercase tracking-[0.15em] transition-all hover:scale-105 active:scale-95 shadow-lg shadow-orange-500/20 shadow-sm border-none"
            >
              Start Project
            </Button>
          </div>

          <button
            className="md:hidden text-white p-2 hover:bg-white/10 rounded-full transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden mt-2 bg-black backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/10"
          >
            <ul className="flex flex-col items-center text-center gap-4">
              {navItems.map((item) => (
                <li key={item} className="w-full">
                  <button
                    onClick={() => handleNavClick(item)}
                    className={`font-semibold text-sm uppercase tracking-widest transition-colors py-2 block w-full ${
                      activeSection === item.toLowerCase()
                        ? "text-primary"
                        : "text-white/80 hover:text-white"
                    }`}
                  >
                    {item}
                  </button>
                </li>
              ))}
              <li className="w-full">
                <Button
                  onClick={() => setIsBookingOpen(true)}
                  className="w-full rounded-full bg-white text-black border border-black h-12 font-bold uppercase tracking-wider"
                >
                  Start Project
                </Button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
      />
    </motion.header>
  );
};

export default Header;
