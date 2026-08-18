import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, User, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import LtrixonLogo from "@/components/LtrixonLogo";
import { API_BASE_URL } from "@/lib/api";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // In production, configure PHP to listen to this route smoothly
      const response = await fetch(`${API_BASE_URL}/api_login.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();

      if (data.success) {
        localStorage.setItem("adminSession", data.session_token);
        localStorage.setItem("adminUserkey", data.userkey);
        // Successful login, redirect to Admin dashboard
        navigate("/admin");
      } else {
        setError(data.message || "Invalid credentials.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-6 font-body">
      
      <div className="w-full max-w-[400px]">
        {/* Logo Section */}
        <div className="flex justify-center mb-16">
          <LtrixonLogo size="lg" light={true} />
        </div>

        {/* Error Message */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 text-center text-xs font-bold text-destructive bg-destructive/5 py-2 rounded"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-10">
          {/* Email/Username Field */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Email / Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-transparent border-b border-border/60 py-2 focus:border-[#F97316] outline-none transition-colors text-sm text-foreground"
              placeholder="admin"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Password
              </label>
              <a href="#" className="text-[10px] text-[#F97316] font-bold hover:underline">
                Forgot password?
              </a>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b border-border/60 py-2 focus:border-[#F97316] outline-none transition-colors text-sm text-foreground"
              placeholder="••••••••"
            />
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-between pt-4">
            <label className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-border bg-transparent text-[#F97316] focus:ring-0 cursor-pointer"
              />
              <span className="ml-3 text-[13px] text-muted-foreground group-hover:text-foreground transition-colors">
                Remember me
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#F97316] text-white px-8 py-2.5 rounded shadow-lg shadow-orange-500/20 text-xs font-black uppercase tracking-widest hover:bg-[#EA580C] transition-all disabled:opacity-50"
            >
              {loading ? "..." : "SIGN IN"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default LoginPage;
