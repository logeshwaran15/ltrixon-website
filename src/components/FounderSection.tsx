import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Download, Github, Mail, Globe, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import portraitLaptop from "@/assets/portrait-laptop.png";
import portraitHands from "@/assets/portrait-hands.png";
import BookingModal from "./BookingModal";

const FounderSection = () => {
  const [activeTab, setActiveTab] = useState("Experience");
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const tabData = {
    // ... same as before
    Education: [
      { title: "M.Sc Computer Science", subtitle: "SMR College, Katankulathur" }
    ],
    Experience: [
      { title: "1+ Years of professional experience in full stack development", subtitle: "" },
      { title: "Worked on multiple real-time projects", subtitle: "" },
      { title: "Strong understanding of web application architecture", subtitle: "" }
    ],
    Interests: [
      { title: "Building modern web applications", subtitle: "" },
      { title: "Learning new technologies and frameworks", subtitle: "" },
      { title: "Solving real-world problems through coding", subtitle: "" },
      { title: "UI/UX design and improving user experience", subtitle: "" },
      { title: "Exploring AI and automation", subtitle: "" }
    ]
  };

  return (
    <div className="bg-white min-h-screen">
      {/* ─────────────────────────────────────────────────────────────
          BLOCK 1: HERO VIEW (Seamless SaaS Style)
          ───────────────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-32 px-4 overflow-hidden">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left: Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative mb-6">
                <span className="text-lg font-medium text-foreground flex items-center gap-2">
                  Hey! 👋
                </span>
                
                {/* Floating Tags - Orange Themed */}
                <div className="absolute -top-12 left-1/4 sm:left-1/3 hidden sm:block">
                  <motion.div 
                    animate={{ y: [0, -10, 0] }} 
                    transition={{ duration: 3, repeat: Infinity }}
                    className="bg-[#F97316] text-white px-6 py-1.5 rounded-full font-bold text-sm shadow-xl rotate-[-12deg]"
                  >
                    Full Stack
                  </motion.div>
                </div>
                <div className="absolute top-0 right-0 hidden sm:block">
                  <motion.div 
                    animate={{ y: [0, 10, 0] }} 
                    transition={{ duration: 4, repeat: Infinity }}
                    className="bg-black text-white px-6 py-1.5 rounded-full font-bold text-sm shadow-xl rotate-[12deg]"
                  >
                    Developer
                  </motion.div>
                </div>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-black mb-8 tracking-tight">
                I am <span className="text-[#F97316]">Logeshwaran</span>
              </h1>
              
              <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-2xl mb-10">
                I am Logeshwaran M, a passionate Full Stack Developer with over 1+ years of experience in building modern web applications. 
                I specialize in creating scalable, user-friendly, and efficient solutions for real-world problems.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 mb-16">
                <Button 
                   size="lg" 
                   className="rounded-xl bg-[#F97316] hover:bg-[#EA580C] px-10 h-14 text-lg font-bold shadow-lg shadow-orange-500/20 gap-2 overflow-hidden group border-none"
                   onClick={() => setIsBookingOpen(true)}
                >
                  Get Started 
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-white" />
                </Button>
              </div>

              {/* Verified Badges - Clean Style */}
              <div className="flex flex-wrap gap-6 items-center">
                <div className="bg-white border border-border shadow-sm rounded-2xl p-4 flex items-center gap-4 hover:shadow-md transition-shadow cursor-default group/f">
                   <div className="w-10 h-10 rounded-full bg-[#1DBF73] flex items-center justify-center text-white font-black text-xl">f</div>
                   <div className="pr-4">
                      <div className="flex items-center gap-1 text-[#F97316]">
                         {[1,2,3,4,5].map(s => <span key={s} className="text-[12px]">★</span>)}
                         <span className="text-black font-bold text-xs ml-1">5.0</span>
                      </div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Top Rated Client Reviews</p>
                   </div>
                </div>
                <div className="bg-white border border-border shadow-sm rounded-2xl p-4 flex items-center gap-4 hover:shadow-md transition-shadow cursor-default">
                   <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white font-black text-xl group-hover:bg-[#F97316] transition-colors">Lt</div>
                   <div className="pr-4">
                      <div className="flex items-center gap-1 text-[#F97316]">
                         {[1,2,3,4,5].map(s => <span key={s} className="text-[12px]">★</span>)}
                         <span className="text-black font-bold text-xs ml-1">5.0</span>
                      </div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Ltrixon Team</p>
                   </div>
                </div>
              </div>
            </motion.div>

            {/* Right: Full Subject Portrait - No Arche/Curves (SaaS Style) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative flex justify-center lg:justify-end"
            >
              <div className="relative w-full max-w-lg sm:max-w-xl group">
                {/* Subject - Full View, Fit to Page */}
                <div className="relative w-full h-full flex items-end">
                  <img 
                    src={portraitLaptop} 
                    alt="Founder Hero" 
                    className="w-full h-auto object-contain z-10 hover:scale-105 transition-transform duration-700"
                  />
                </div>

                {/* Subtle Floating Elements */}
                <div className="absolute top-1/4 -right-6 w-14 h-14 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl flex items-center justify-center text-[#F97316] text-2xl font-bold z-20 animate-bounce-slow">
                   {"{}"}
                </div>
                <div className="absolute top-1/2 -left-10 w-12 h-12 bg-white/80 backdrop-blur-xl rounded-xl shadow-lg flex items-center justify-center text-[#F97316] z-20 animate-pulse">
                   <Globe size={24} />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* BLOCK 1.5: TILTED SKILLS MARQUEE STRIP (Inverted Colors Style) */}
      <div className="relative h-24 sm:h-32 flex items-center overflow-hidden z-20 mt-[-40px] mb-8 bg-[#F97316]/5">
        <motion.div 
           className="absolute w-[120%] h-14 sm:h-20 bg-white border-y border-[#F97316]/20 -rotate-2 flex items-center shadow-2xl overflow-hidden shadow-black/5"
           initial={{ x: "-10%" }}
        >
           <div className="flex whitespace-nowrap animate-marquee">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-12 sm:gap-24 px-6 sm:px-12">
                   <div className="flex items-center gap-4 text-black font-black text-sm sm:text-lg uppercase tracking-tight italic">
                      <span className="text-[#F97316]">Frontend:</span> <span>HTML / CSS / JS / React</span>
                      <span className="text-[#F97316]">✦</span>
                   </div>
                   <div className="flex items-center gap-4 text-black font-black text-sm sm:text-lg uppercase tracking-tight italic">
                      <span className="text-[#F97316]">Backend:</span> <span>ASP.NET / PHP</span>
                      <span className="text-[#F97316]">✦</span>
                   </div>
                   <div className="flex items-center gap-4 text-black font-black text-sm sm:text-lg uppercase tracking-tight italic">
                      <span className="text-[#F97316]">Database:</span> <span>SQL Server / MySQL</span>
                      <span className="text-[#F97316]">✦</span>
                   </div>
                   <div className="flex items-center gap-4 text-black font-black text-sm sm:text-lg uppercase tracking-tight italic">
                      <span className="text-[#F97316]">Interactive:</span> <span>API / Responsive Design</span>
                      <span className="text-[#F97316]">✦</span>
                   </div>
                </div>
              ))}
           </div>
        </motion.div>
        
        {/* Secondary Background Arch-Tint */}
        <div className="absolute inset-0 bg-[#F97316] opacity-10 pointer-events-none" style={{ zIndex: -2 }} />
      </div>

      {/* BLOCK 2: ABOUT / STATS - Clean Seamless Style */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto max-w-7xl px-4 relative z-10">
          
          <div className="text-center mb-20">
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               className="inline-flex flex-col items-center"
            >
               <span className="text-[#F97316] font-extrabold text-sm uppercase tracking-[0.3em] mb-4">About me</span>
               <h2 className="text-4xl md:text-6xl font-black text-black leading-tight">Things you should know <br/>before starting!</h2>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-12 gap-20 items-center">
            
            {/* Left: Full Portrait - Clean & Seamless */}
            <div className="lg:col-span-12 lg:flex lg:justify-center mb-16 lg:mb-0 lg:col-start-1 lg:col-end-6">
               <motion.div 
                 initial={{ opacity: 0, y: 40 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 className="relative w-full max-w-md flex items-end overflow-hidden"
                 style={{ clipPath: "inset(0 0 0 2%)" }}
               >
                 <img 
                   src={portraitHands} 
                   alt="Founder Profile" 
                   className="w-full h-auto object-contain z-10 hover:scale-105 transition-all duration-700"
                 />
               </motion.div>
            </div>

            {/* Right: Tabs & Experience Content */}
            <div className="lg:col-span-7">
               <div className="mb-10 flex gap-8 border-b border-border pb-4 overflow-x-auto no-scrollbar">
                  {Object.keys(tabData).map((tab) => (
                     <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`text-lg font-bold pb-4 relative transition-all duration-300 min-w-[100px] ${activeTab === tab ? 'text-[#F97316]' : 'text-muted-foreground hover:text-black'}`}
                     >
                        {tab}
                        {activeTab === tab && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 w-full h-[3px] bg-[#F97316]" />}
                     </button>
                  ))}
               </div>

               {/* Stats Area */}
               <div className="grid grid-cols-3 gap-6 mb-12">
                  <div>
                     <h3 className="text-3xl font-black text-[#F97316] mb-1">6+</h3>
                     <p className="text-sm font-bold text-black">Project Completed</p>
                  </div>
                  <div>
                     <h3 className="text-3xl font-black text-black mb-1">1+</h3>
                     <p className="text-sm font-bold text-black">Year Of Experience</p>
                  </div>
                  <div>
                     <h3 className="text-3xl font-black text-[#F97316] mb-1">5+</h3>
                     <p className="text-sm font-bold text-black">Happy Clients</p>
                  </div>
               </div>

               {/* Tab Content List */}
               <div className="min-h-[200px]">
                 <AnimatePresence mode="wait">
                   <motion.div
                     key={activeTab}
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     className="space-y-4"
                   >
                     {tabData[activeTab as keyof typeof tabData].map((item, i) => (
                       <div key={i} className="flex gap-4 items-start bg-slate-50 p-4 rounded-xl hover:bg-[#F97316]/5 transition-colors group">
                          <CheckCircle2 size={24} className="text-[#F97316] shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-bold text-black leading-snug">{item.title}</h4>
                            {item.subtitle && <p className="text-sm text-muted-foreground mt-1">{item.subtitle}</p>}
                          </div>
                       </div>
                     ))}
                   </motion.div>
                 </AnimatePresence>
               </div>

               <div className="flex flex-wrap gap-4 mt-12">
                  <Button size="lg" className="rounded-xl bg-black hover:bg-black/90 px-8 py-7 font-bold gap-2 group text-white">
                     Download CV <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                  </Button>
                  <Button size="lg" variant="outline" className="rounded-xl border-black text-black hover:bg-black/5 px-8 py-7 font-bold gap-2 group">
                     Git Hub <Github className="w-5 h-5 transition-transform" />
                  </Button>
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer Contact Connect */}
      <section id="contact" className="py-24 px-4 bg-slate-50">
          <div className="container mx-auto max-w-4xl text-center">
             <div className="w-16 h-16 bg-[#F97316]/10 rounded-full flex items-center justify-center text-[#F97316] mx-auto mb-8">
                <Mail size={32} />
             </div>
             <h2 className="text-4xl md:text-6xl font-black mb-8 text-black leading-tight">Let's connect and build <br/>your next big project.</h2>
             <div className="flex flex-col md:flex-row justify-center gap-10 items-center">
                <div className="flex flex-col items-center">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">WhatsApp Me</span>
                    <a href="tel:+916369641717" className="text-2xl font-bold text-black hover:text-[#F97316] transition-colors">+91 6369641717</a>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Email Inquiry</span>
                    <a href="mailto:logeshwaran0415@gmail.com" className="text-2xl font-bold text-black hover:text-[#F97316] transition-colors">logeshwaran0415@gmail.com</a>
                </div>
             </div>
          </div>
      </section>

      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
      />

      {/* Vertical 'Hire Me' Floating Button */}
      <motion.button
         initial={{ opacity: 0, x: 50 }}
         animate={{ opacity: 1, x: 0 }}
         transition={{ delay: 1, duration: 0.8 }}
         onClick={() => setIsBookingOpen(true)}
         className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-[60] bg-white border-2 border-black text-black px-3 py-10 rounded-full flex flex-col items-center gap-4 hover:scale-110 active:scale-95 transition-all shadow-xl group"
      >
         <span className="text-xl font-black [writing-mode:vertical-rl] tracking-[0.2em] group-hover:tracking-[0.4em] transition-all">Hire Me</span>
         <div className="w-1.5 h-1.5 bg-[#F97316] rounded-full animate-bounce" />
      </motion.button>
    </div>
  );
};

export default FounderSection;
