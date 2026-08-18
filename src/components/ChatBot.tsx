import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Sparkles, Zap, HelpCircle, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  from: "user" | "bot";
  text: string;
  time: string;
}

const quickActions = [
  { label: "Our Services", icon: Zap, query: "What services do you offer?" },
  { label: "Get a Quote", icon: DollarSign, query: "I'd like a price quote" },
  { label: "Chat with Human", icon: MessageCircle, query: "I want to talk to a human" },
];

const getTime = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const knowledgeBase: { keywords: string[]; response: string }[] = [
  { keywords: ["service", "offer", "do you do", "what do you"], response: "We offer a full range of services:\n\n🖥️ **Custom Software Development**\n🌐 **Web Applications** (React, Next.js)\n📱 **Mobile Apps** (iOS & Android)\n\nWhich area interests you most?" },
  { keywords: ["price", "cost", "quote", "budget", "how much"], response: "Our pricing depends on project scope:\n\n💡 **Starter projects**: from ₹25K\n🚀 **Mid-scale apps**: ₹1L–₹5L\n🏢 **Enterprise solutions**: Custom pricing\n\nWe offer free initial consultations! Email us at **ltrixon2026@gmail.com** or call **+91 6369641717**." },
  { keywords: ["process", "how it works", "workflow", "steps"], response: "Our proven 5-step process:\n\n1️⃣ **Discovery** — Understanding your needs\n2️⃣ **Design** — UI/UX prototyping\n3️⃣ **Development** — Agile sprints\n4️⃣ **Testing** — QA & security audits\n5️⃣ **Launch & Support** — Deployment + maintenance\n\nWant to get started?" },
  { keywords: ["hello", "hi", "hey", "good morning", "good afternoon"], response: "Hello! 👋 Welcome to **Ltrixon**! I'm here to help you with:\n\n• Information about our services\n• Pricing & project estimates\n• Our development process\n• Getting in touch with our team\n\nWhat would you like to know?" },
  { keywords: ["contact", "email", "phone", "reach", "talk"], response: "You can reach us through:\n\n📧 **Email**: ltrixon2026@gmail.com\n📞 **Phone**: +91 6369641717\n📍 **Location**: India\n\nOr fill out the form on our website — we typically respond within 2 hours!" },
  { keywords: ["technology", "tech stack", "framework", "language"], response: "We work with cutting-edge technologies:\n\n⚛️ **Frontend**: React, Next.js, Vue.js\n🔧 **Backend**: Node.js, Python, Go\n📱 **Mobile**: React Native, Flutter\n🗄️ **Database**: PostgreSQL, MongoDB\n🤖 **AI/ML**: TensorFlow, PyTorch" },
  { keywords: ["about", "company", "who are you", "team"], response: "**Ltrixon** is a premium software development company.\n\n🏆 Years of experience\n👥 150+ happy clients\n📦 300+ projects delivered\n⏱️ 99% on-time delivery rate\n\nWe specialize in building scalable, enterprise-grade digital products." },
  { keywords: ["project", "portfolio", "work", "built"], response: "Check out our recent work:\n\n🛒 **The Power Pack Supplements** — E-commerce platform\n💼 **Compact Recruit Suite** — ATS hiring platform\n🏗️ **Thillai Construction** — Construction company website\n\nScroll down to our Projects section to see more!" },
  { keywords: ["thank", "thanks", "great", "awesome", "perfect"], response: "You're welcome! 😊 Is there anything else I can help you with? Feel free to ask about our services, pricing, or anything else!" },
];

const getResponse = (msg: string): string => {
  const lower = msg.toLowerCase();
  for (const entry of knowledgeBase) {
    if (entry.keywords.some((kw) => lower.includes(kw))) return entry.response;
  }
  return "Thanks for your message! I'd love to help. You can ask me about:\n\n• Our **services** and capabilities\n• **Pricing** and project estimates\n• Our **development process**\n• **Technologies** we use\n• How to **contact** us\n\nOr email us directly at **ltrixon2026@gmail.com** 📧";
};

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { from: "bot", text: "Hi! 👋 Welcome to **Ltrixon**! Mama ready! Neenga enna build panna poreenga? Let's discuss!", time: getTime() },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(1);
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleText, setBubbleText] = useState("");
  const fullMessage = "Hai! 👋 Mama inge irukken. Epdi help pannalaam? 😄";
  const scrollRef = useRef<HTMLDivElement>(null);

  // Typewriter effect for bubble
  useEffect(() => {
    if (showBubble) {
      let i = 0;
      setBubbleText("");
      const interval = setInterval(() => {
        setBubbleText(fullMessage.slice(0, i));
        i++;
        if (i > fullMessage.length) {
          clearInterval(interval);
          // Hide bubble after 8 seconds of completion
          setTimeout(() => setShowBubble(false), 8000);
        }
      }, 50);
      return () => clearInterval(interval);
    }
  }, [showBubble]);

  // Periodic show bubble every 5 mins
  useEffect(() => {
    // Show immediately on first load after a short delay
    const initialTimeout = setTimeout(() => setShowBubble(true), 3000);

    const mainInterval = setInterval(() => {
      setShowBubble(true);
    }, 300000); // 5 minutes

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(mainInterval);
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const send = async (text?: string) => {
    const msg = text || input;
    if (!msg.trim()) return;
    const userMsg: Message = { from: "user", text: msg, time: getTime() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);

    // Hardcoded response logic instead of API call
    setTimeout(() => {
      setTyping(false);
      const replyText = getResponse(msg);
      const botMsg: Message = { from: "bot", text: replyText, time: getTime() };
      setMessages((m) => [...m, botMsg]);
      if (!open) setUnread((u) => u + 1);
    }, 800 + Math.random() * 700);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[360px] bg-card rounded-2xl shadow-2xl border border-border overflow-hidden"
          >
            {/* Header */}
            <div className="bg-primary p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <Bot size={20} className="text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h4 className="text-primary-foreground font-heading font-bold text-sm">Mama AI</h4>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-primary-foreground/70 text-xs">Online</span>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-primary-foreground/80 hover:text-primary-foreground p-1.5 rounded-lg hover:bg-primary-foreground/10 transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef} 
              className="h-72 sm:h-80 overflow-y-auto p-4 space-y-4 bg-secondary/30 [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]"
            >
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex gap-2 ${m.from === "user" ? "justify-end" : "justify-start"}`}
                >
                  {m.from === "bot" && (
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                      <Sparkles size={12} className="text-primary" />
                    </div>
                  )}
                  <div className={`max-w-[75%] ${m.from === "user" ? "order-first" : ""}`}>
                    <div
                      className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                        m.from === "user"
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-card text-card-foreground border border-border rounded-bl-md"
                      }`}
                      dangerouslySetInnerHTML={{
                        __html: m.text
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/\n/g, '<br/>')
                      }}
                    />
                    <p className={`text-[10px] text-muted-foreground mt-1 ${m.from === "user" ? "text-right" : ""}`}>{m.time}</p>
                  </div>
                  {m.from === "user" && (
                    <div className="w-7 h-7 rounded-full bg-foreground flex items-center justify-center shrink-0 mt-1">
                      <User size={12} className="text-primary-foreground" />
                    </div>
                  )}
                </motion.div>
              ))}

              {typing && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 items-start">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Sparkles size={12} className="text-primary" />
                  </div>
                  <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3 flex gap-1.5">
                    <motion.div className="w-2 h-2 rounded-full bg-muted-foreground" animate={{ y: [0, -6, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} />
                    <motion.div className="w-2 h-2 rounded-full bg-muted-foreground" animate={{ y: [0, -6, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }} />
                    <motion.div className="w-2 h-2 rounded-full bg-muted-foreground" animate={{ y: [0, -6, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }} />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Quick Actions */}
            {messages.length <= 2 && (
              <div className="px-4 py-2 flex gap-2 overflow-x-auto border-t border-border bg-card [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]">
                {quickActions.map((qa) => (
                  <button
                    key={qa.label}
                    onClick={() => send(qa.query)}
                    className="shrink-0 flex items-center gap-1.5 bg-secondary hover:bg-primary/10 hover:text-primary text-foreground text-xs font-medium px-3 py-1.5 rounded-full border border-border transition-colors"
                  >
                    <qa.icon size={12} /> {qa.label}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-2.5 border-t border-border flex gap-2 bg-card">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
                placeholder="Ask me anything..."
                className="flex-1 bg-secondary rounded-xl px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
              />
              <Button
                size="sm"
                onClick={() => send()}
                disabled={!input.trim()}
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl w-10 h-10 p-0 shrink-0 disabled:opacity-40 flex items-center justify-center"
              >
                <Send size={18} />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB with Dancing Robot */}
      <div className="fixed bottom-6 right-4 sm:right-6 z-50 flex flex-col items-end gap-3">
        {/* Speech Bubble */}
        <AnimatePresence>
          {showBubble && !open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-2xl rounded-br-none shadow-xl text-sm font-bold whitespace-normal max-w-[200px] mb-2 flex items-center gap-2 border-2 border-primary-foreground/20"
            >
              <span className="text-foreground font-bold text-xs">
                {bubbleText}
                <span className="inline-block w-1 h-3 bg-primary ml-1 animate-pulse" />
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => { setOpen(!open); setUnread(0); }}
          className={`relative transition-all duration-300 flex items-center justify-center ${
            open ? "w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-xl" : "w-16 h-16 bg-transparent"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {open ? (
            <X size={20} />
          ) : (
            <motion.div
              animate={{ 
                y: [0, -8, 0],
              }}
              transition={{ 
                duration: 2.8, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="relative w-24 h-24 flex items-center justify-center"
            >
              {/* Custom SVG Orange Robot - HD/Big Size with Hands */}
              <svg width="64" height="64" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-xl">
                {/* Antenna */}
                <rect x="23" y="4" width="2" height="6" fill="#FF9F00" />
                <circle cx="24" cy="4" r="3" fill="#FF9F00" />
                
                {/* Hands and Arms - Energy Waving */}
                <motion.g
                  animate={{ rotate: [0, -25, 0] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                  style={{ originX: "10px", originY: "35px" }}
                >
                  <path d="M10 35C10 35 4 35 4 28" stroke="#FF8000" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx="4" cy="28" r="2.5" fill="#FF9F00" />
                </motion.g>

                <motion.g
                  animate={{ rotate: [0, 25, 0] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  style={{ originX: "38px", originY: "35px" }}
                >
                  <path d="M38 35C38 35 44 35 44 28" stroke="#FF8000" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx="44" cy="28" r="2.5" fill="#FF9F00" />
                </motion.g>

                {/* Head */}
                <rect x="8" y="10" width="32" height="20" rx="10" fill="#FF9F00" />
                
                {/* Face Visor */}
                <rect x="11" y="14" width="26" height="10" rx="5" fill="#1A1A1A" />
                
                {/* Eyes */}
                <circle cx="18" cy="19" r="3" fill="#FF9F00" />
                <circle cx="18" cy="19" r="1" fill="#FFFFFF" opacity="0.9" />
                <circle cx="30" cy="19" r="3" fill="#FF9F00" />
                <circle cx="30" cy="19" r="1" fill="#FFFFFF" opacity="0.9" />
                
                {/* Smile */}
                <path d="M19 26C19 26 21 28 24 28C27 28 29 26 29 26" stroke="#4A2A00" strokeWidth="1.5" strokeLinecap="round" />
                
                {/* Body */}
                <path d="M16 31C16 31 16 42 24 42C32 42 32 31 32 31H16Z" fill="#FF8000" />
                <path d="M16 31C16 31 18 38 24 38C30 38 32 31 32 31H16Z" fill="#FF9F00" />
              </svg>
            </motion.div>
          )}

          {unread > 0 && !open && (
            <span className="absolute top-2 right-2 w-6 h-6 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center border-2 border-primary shadow-lg animate-bounce">
              {unread}
            </span>
          )}
        </motion.button>
      </div>
    </>
  );
};

export default ChatBot;
