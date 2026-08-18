import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { API_BASE_URL } from "@/lib/api";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Please enter a valid email"),
  phone: z.string().trim().regex(/^[+]?[\d\s()-]{7,15}$/, "Please enter a valid phone number"),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(1000),
});

type ContactForm = z.infer<typeof contactSchema>;

const contactInfo = [
  { icon: Mail, label: "Email", value: "ltrixon2026@gmail.com", href: "mailto:ltrixon2026@gmail.com" },
  { icon: Phone, label: "Phone", value: "+91 6369641717", href: "tel:+916369641717" },
  { icon: MapPin, label: "Location", value: "India", href: "#" },
];

const ContactSection = () => {
  const { toast } = useToast();
  const [form, setForm] = useState<ContactForm>({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactForm, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof ContactForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactForm, string>> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof ContactForm;
        if (!fieldErrors[field]) fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api_save_lead.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: form.name, 
          email: form.email, 
          phone: form.phone, 
          project: "Contact Form", 
          intent: form.message 
        })
      });
      
      const result = await response.json();

      if (result.success) {
        setSubmitted(true);
        toast({ title: "Inquiry Saved!", description: result.message });
      } else {
        toast({ variant: "destructive", title: "Error", description: result.message });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Network Error", description: "Could not connect to database." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section-padding bg-secondary relative overflow-hidden">
      <div className="absolute top-0 right-0 w-48 md:w-72 h-48 md:h-72 bg-primary/5 rounded-bl-[100px]" />
      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">Get In Touch</p>
          <h2 className="heading-lg text-foreground">Contact Us</h2>
          <div className="w-16 h-1 bg-primary mx-auto mt-4 rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-6 md:space-y-8"
          >
            <div>
              <h3 className="font-heading font-bold text-xl md:text-2xl text-foreground mb-3">Let's Build Something Great</h3>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                Ready to start your project? Reach out and our team will respond within 24 hours.
              </p>
            </div>
            <div className="space-y-4 md:space-y-5">
              {contactInfo.map((item) => (
                <a key={item.label} href={item.href} className="flex items-center gap-4 group">
                  <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                    <item.icon size={20} className="text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{item.label}</p>
                    <p className="text-foreground font-medium text-sm md:text-base">{item.value}</p>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            {submitted ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-background rounded-2xl p-8 md:p-12 shadow-lg text-center"
              >
                <CheckCircle size={56} className="text-primary mx-auto mb-4" />
                <h3 className="font-heading font-bold text-xl md:text-2xl text-foreground mb-2">Thank You!</h3>
                <p className="text-muted-foreground text-sm md:text-base">We've received your message and will get back to you soon.</p>
                <Button onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", message: "" }); }} className="mt-6 rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                  Send Another
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-background rounded-2xl p-6 md:p-8 shadow-lg space-y-4 md:space-y-5">
                <div className="grid sm:grid-cols-2 gap-4 md:gap-5">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Name</label>
                    <Input placeholder="Your name" value={form.name} onChange={(e) => handleChange("name", e.target.value)} className={errors.name ? "border-destructive" : ""} />
                    {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
                    <Input type="email" placeholder="you@example.com" value={form.email} onChange={(e) => handleChange("email", e.target.value)} className={errors.email ? "border-destructive" : ""} />
                    {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Phone</label>
                  <Input placeholder="+91 6369641717" value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} className={errors.phone ? "border-destructive" : ""} />
                  {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Message</label>
                  <Textarea placeholder="Tell us about your project..." rows={4} value={form.message} onChange={(e) => handleChange("message", e.target.value)} className={errors.message ? "border-destructive" : ""} />
                  {errors.message && <p className="text-destructive text-xs mt-1">{errors.message}</p>}
                </div>
                <Button type="submit" disabled={loading} className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 h-11 md:h-12 text-base font-semibold">
                  {loading ? "Sending..." : <><Send size={18} className="mr-2" /> Send Message</>}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
