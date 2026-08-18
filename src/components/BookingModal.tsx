import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { X, CalendarDays, User, Mail, Phone, Check } from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/api";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BookingModal = ({ isOpen, onClose }: BookingModalProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !date) {
      toast.error("Please fill all fields and select a date.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api_save_lead.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, 
          email, 
          phone, 
          project: "Demo Booking", 
          intent: `Scheduled for: ${date.toLocaleDateString()}` 
        })
      });
      
      const result = await response.json();

      if (result.success) {
        setSuccess(true);
        toast.success(result.message);
        setTimeout(() => {
            setSuccess(false);
            setName("");
            setEmail("");
            setPhone("");
            onClose();
        }, 3000);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-white border-none rounded-3xl shadow-2xl">
        <div className="flex flex-col lg:flex-row min-h-[500px]">
          
          {/* Left Side: Calendar (Orange Theme) */}
          <div className="lg:w-1/2 p-8 bg-[#F97316]/5 border-r border-border">
            <DialogHeader className="mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#F97316] text-white flex items-center justify-center mb-4 shadow-lg shadow-orange-500/20">
                 <CalendarDays size={24} />
              </div>
              <DialogTitle className="text-2xl font-black text-black">Select a Date</DialogTitle>
              <DialogDescription className="text-muted-foreground font-medium">Choose a convenient time for our meeting.</DialogDescription>
            </DialogHeader>
            
            <div className="flex justify-center p-2 bg-white rounded-2xl border border-border shadow-sm">
               <Calendar
                 mode="single"
                 selected={date}
                 onSelect={setDate}
                 className="rounded-md border-none"
                 classNames={{
                   day_selected: "bg-[#F97316] text-white hover:bg-[#F97316] hover:text-white focus:bg-[#F97316] focus:text-white",
                   day_today: "bg-slate-100 text-black font-bold",
                 }}
               />
            </div>
            {date && (
                <p className="mt-4 text-center text-sm font-bold text-[#F97316]">
                    Meeting Scheduled for: {date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
            )}
          </div>

          {/* Right Side: Contact Form */}
          <div className="lg:w-1/2 p-8 lg:p-12 bg-white relative">
            <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-black"
            >
                <X size={20} />
            </button>

            <div className="h-full flex flex-col justify-center">
              <h3 className="text-2xl font-black text-black mb-8">Confirm Booking</h3>
              
              <AnimatePresence mode="wait">
                {!success ? (
                  <motion.form 
                    key="form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onSubmit={handleBook} 
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                       <Label className="text-xs font-bold uppercase tracking-widest text-[#F97316]">Full Name</Label>
                       <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                          <Input 
                             placeholder="Logeshwaran M" 
                             className="pl-10 h-12 rounded-xl border-slate-200 focus:border-[#F97316] transition-all"
                             value={name}
                             onChange={(e) => setName(e.target.value)}
                             required
                          />
                       </div>
                    </div>

                    <div className="space-y-2">
                       <Label className="text-xs font-bold uppercase tracking-widest text-[#F97316]">Email Address</Label>
                       <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                          <Input 
                             type="email"
                             placeholder="example@company.com" 
                             className="pl-10 h-12 rounded-xl border-slate-200 focus:border-[#F97316] transition-all"
                             value={email}
                             onChange={(e) => setEmail(e.target.value)}
                             required
                          />
                       </div>
                    </div>

                    <div className="space-y-2">
                       <Label className="text-xs font-bold uppercase tracking-widest text-[#F97316]">Contact Number</Label>
                       <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                          <Input 
                             type="tel"
                             placeholder="+91 00000 00000" 
                             className="pl-10 h-12 rounded-xl border-slate-200 focus:border-[#F97316] transition-all"
                             value={phone}
                             onChange={(e) => setPhone(e.target.value)}
                             required
                          />
                       </div>
                    </div>

                    <Button 
                        disabled={loading}
                        className="w-full h-14 rounded-xl bg-black hover:bg-black/90 text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all gap-2 mt-4"
                    >
                        {loading ? "Processing..." : "Book Meeting Now"}
                        {!loading && <Check size={18} />}
                    </Button>
                  </motion.form>
                ) : (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center text-center py-12"
                  >
                    <div className="w-20 h-20 rounded-full bg-emerald-500 text-white flex items-center justify-center mb-6 animate-bounce shadow-xl shadow-emerald-500/20">
                       <Check size={40} strokeWidth={3} />
                    </div>
                    <h4 className="text-2xl font-black text-black mb-2">Meeting Requested!</h4>
                    <p className="text-muted-foreground font-medium">Check your email for confirmation shortly.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
