import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Users, MessageSquare, Settings, LogOut, Search, Bell, Menu, X, CheckCircle, Briefcase, Building, Shield, Activity, Server, Globe, Lock, ArrowLeftToLine, ArrowRightToLine, Image as ImageIcon, Trash2, Upload, Zap, Send, Calendar, FileText, Download, PieChart as PieChartIcon, TrendingUp, Moon, Sun, ChevronLeft, ChevronRight, Command } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import LtrixonLogo from "@/components/LtrixonLogo";
import { toast } from "sonner";
import InvoiceModal from "@/components/InvoiceModal";
import { API_BASE_URL } from "@/lib/api";
import CreateProjectForm from "@/components/CreateProjectForm";
import { Lead, Project, SystemStats } from "../types";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [expiringDomains, setExpiringDomains] = useState<Project[]>([]);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState("");
  const [customTasks, setCustomTasks] = useState<string[]>([]);
  const [feedTab, setFeedTab] = useState("recent");
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [sysStats, setSysStats] = useState<SystemStats | null>(null);
  const lastLeadCount = useRef<number>(0);
  const [notificationSound] = useState(new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3"));
  const isInitialLoad = useRef(true);
  const navigate = useNavigate();

  const themes = [
    { name: 'Orange', primary: '#F97316', hover: '#EA580C' },
    { name: 'Blue', primary: '#3B82F6', hover: '#2563EB' },
    { name: 'Green', primary: '#10B981', hover: '#059669' },
    { name: 'Purple', primary: '#8B5CF6', hover: '#7C3AED' },
    { name: 'Pink', primary: '#EC4899', hover: '#DB2777' },
    { name: 'Slate', primary: '#475569', hover: '#334155' },
    { name: 'Gold', primary: '#D4AF37', hover: '#B8860B' },
    { name: 'Teal Green', primary: '#0D9488', hover: '#0F766E' },
  ];

  const [currentTheme, setCurrentTheme] = useState(() => {
    const saved = localStorage.getItem("adminTheme");
    if (saved) {
      try { return JSON.parse(saved); } catch(e) { /* ignore */ }
    }
    return themes[0];
  });

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--admin-primary', currentTheme.primary);
    root.style.setProperty('--admin-hover', currentTheme.hover);
    const rgb = hexToRgb(currentTheme.primary);
    if (rgb) {
      root.style.setProperty('--admin-primary-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
    }
    localStorage.setItem("adminTheme", JSON.stringify(currentTheme));
  }, [currentTheme]);

  const templates = [
    { id: 'modern', name: 'Modern UI', radius: '12px', glass: false },
    { id: 'classic', name: 'Classic Pro', radius: '0px', glass: false },
    { id: 'glass', name: 'Glassmorphism', radius: '20px', glass: true },
    { id: 'compact', name: 'High Density', radius: '4px', glass: false },
  ];

  const [currentTemplate, setCurrentTemplate] = useState(() => {
    const saved = localStorage.getItem("adminTemplate");
    if (saved) {
      try { return JSON.parse(saved); } catch(e) { /* ignore */ }
    }
    return templates[0];
  });

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--admin-radius', currentTemplate.radius);
    if (currentTemplate.glass) {
      root.classList.add('glass-mode');
    } else {
      root.classList.remove('glass-mode');
    }
    localStorage.setItem("adminTemplate", JSON.stringify(currentTemplate));
  }, [currentTemplate]);

  const fontFamilies = [
    { id: 'poppins', name: 'Poppins', heading: 'Montserrat', body: 'Poppins' },
    { id: 'inter', name: 'Inter UI', heading: 'Inter', body: 'Inter' },
    { id: 'roboto', name: 'Roboto', heading: 'Roboto', body: 'Roboto' },
    { id: 'outfit', name: 'Outfit', heading: 'Outfit', body: 'Outfit' },
  ];

  const [currentFont, setCurrentFont] = useState(() => {
    const saved = localStorage.getItem("adminFont");
    if (saved) {
      try { return JSON.parse(saved); } catch(e) { /* ignore */ }
    }
    return fontFamilies[0];
  });

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--font-heading', `${currentFont.heading}, sans-serif`);
    root.style.setProperty('--font-body', `${currentFont.body}, sans-serif`);
    localStorage.setItem("adminFont", JSON.stringify(currentFont));
  }, [currentFont]);

  const fontSizes = [
    { id: 'small', name: 'Small', size: '14px' },
    { id: 'default', name: 'Default', size: '16px' },
    { id: 'large', name: 'Large', size: '18px' },
    { id: 'xl', name: 'Extra Large', size: '20px' },
  ];

  const [currentFontSize, setCurrentFontSize] = useState(() => {
    const saved = localStorage.getItem("adminFontSize");
    if (saved) {
      try { return JSON.parse(saved); } catch(e) { /* ignore */ }
    }
    return fontSizes[1];
  });

  useEffect(() => {
    document.documentElement.style.fontSize = currentFontSize.size;
    localStorage.setItem("adminFontSize", JSON.stringify(currentFontSize));
  }, [currentFontSize]);

  const isExpiringSoon = (dateStr: string, daysThreshold: number = 7) => {
    if (!dateStr) return false;
    const expiry = new Date(dateStr);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= daysThreshold;
  };

  const getDaysRemaining = (dateStr: string) => {
    if (!dateStr) return 999;
    const expiry = new Date(dateStr);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const [brandLogo, setBrandLogo] = useState<string | null>(() => localStorage.getItem("brandLogo"));
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem("adminDarkMode") === "true");
  const [trafficPeriod, setTrafficPeriod] = useState<"live" | "today" | "month">("live");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");


  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    localStorage.setItem("adminDarkMode", isDarkMode.toString());
  }, [isDarkMode]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Logo file too large (Max 2MB)");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setBrandLogo(base64);
        localStorage.setItem("brandLogo", base64);
        toast.success("Brand logo updated successfully");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setBrandLogo(null);
    localStorage.removeItem("brandLogo");
    toast.success("Branding reset to default");
  };

  const playNotification = () => {
    const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
    audio.play().catch(e => console.log("Sound enabled after interaction"));
  };

  const fetchLeads = useCallback(async (isInitial = false) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api_leads.php`);
      const result = await response.json();
      if (result.success) {
        if (!isInitial && result.data.length > lastLeadCount.current) {
          const newLead = result.data[0];
          playNotification();
          toast.success(`New Lead: ${newLead.name}`, {
            description: `Requested: ${newLead.project}`,
            duration: 5000,
          });
        }
        setLeads(result.data);
        lastLeadCount.current = result.data.length;
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      if (isInitial) setLoading(false);
    }
  }, []);

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api_projects.php`);
      const result = await res.json();
      if (result.success) setProjects(result.data);

      const resExpiring = await fetch(`${API_BASE_URL}/api_projects.php?action=expiring`);
      const resultExpiring = await resExpiring.json();
      if (resultExpiring.success) {
        if (resultExpiring.data.length > expiringDomains.length) {
            playNotification();
            toast.error(`Domain Expiry Alert: ${resultExpiring.data.length} domains expiring soon!`, { duration: 8000 });
        }
        setExpiringDomains(resultExpiring.data);
      }
    } catch (e) {
      console.error(e);
    }
  }, [expiringDomains.length]);

  const handleDeleteProject = async (projectkey: string) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    
    try {
      const res = await fetch(`${API_BASE_URL}/api_projects.php?projectkey=${projectkey}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Project deleted successfully");
        fetchProjects();
      } else {
        toast.error(data.message || "Failed to delete project");
      }
    } catch (e) {
      toast.error("Error deleting project");
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!window.confirm("Delete this lead permanently?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api_leads.php?id=${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Lead removed");
        fetchLeads();
      } else {
        toast.error(data.message || "Failed to delete lead");
      }
    } catch (e) {
      toast.error("Network error");
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api_leads.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'MARK_READ', id })
      });
      const data = await res.json();
      if (data.success) {
        fetchLeads();
      }
    } catch (e) {
      console.error("Failed to mark lead as read");
    }
  };

  const handlePromoteLead = async (id: string) => {
    // This is a UI-level promotion, shifting it from 'Contact Form' to a 'Qualified Lead'
    // in a real app, this would update the 'project' or 'intent' column.
    toast.success("Lead promoted to high-priority");
  };

  const handleExportCSV = () => {
    if (projects.length === 0) return;
    const headers = ["Client Name", "Project Name", "Phone", "Domain URL", "Expiry", "Total Amount"];
    const rows = projects.map(p => [
      p.client_name, 
      p.project_name, 
      p.client_phone, 
      p.domain_url, 
      p.domain_expiry_date, 
      p.total_amount
    ]);
    
    let csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ltrixon_projects_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    toast.success("CSV Export started");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const themeColor = currentTheme.primary;
    
    // Header
    doc.setFillColor(themeColor);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("LTRIXON PROJECT DIRECTORY", 15, 25);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 15, 33);

    const tableData = projects.map(p => [
      p.client_name,
      p.project_name,
      p.domain_url,
      p.domain_expiry_date,
      `INR ${p.total_amount}`
    ]);

    autoTable(doc, {
      head: [['Client', 'Project', 'Domain', 'Expiry', 'Amount']],
      body: tableData,
      startY: 50,
      headStyles: { fillColor: themeColor },
      styles: { fontSize: 9 }
    });

    doc.save(`ltrixon_report_${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success("PDF Report Generated");
  };

  const fetchSysStats = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api_admin_settings.php`);
      const data = await res.json();
      if (data.success) setSysStats(data.data);
    } catch (e) {
      console.error("Failed to fetch sys stats");
    }
  }, []);

  useEffect(() => {
    fetchLeads(true);
    fetchProjects();
    fetchSysStats();

    // Global Dynamic Refresh: Update all modules every 15s
    const globalSync = setInterval(() => {
      fetchLeads();
      fetchProjects();
      fetchSysStats();
    }, 15000);

    return () => clearInterval(globalSync);
  }, [fetchLeads, fetchProjects, fetchSysStats]);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      toast.error("New passwords do not match");
      return;
    }
    const userkey = localStorage.getItem("adminUserkey");
    try {
      const res = await fetch(`${API_BASE_URL}/api_admin_settings.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CHANGE_PASSWORD',
          userkey,
          currentPassword: passwords.current,
          newPassword: passwords.new
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Password changed successfully");
        setPasswords({ current: "", new: "", confirm: "" });
      } else {
        toast.error(data.message);
      }
    } catch (e) {
      toast.error("Server error");
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(prev => !prev);
      }
      if (e.key === 'Escape') setShowSearch(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredSearch = searchQuery.trim() === "" ? [] : [
    ...projects.filter(p => p.project_name.toLowerCase().includes(searchQuery.toLowerCase()) || p.client_name.toLowerCase().includes(searchQuery.toLowerCase())).map(p => ({ ...p, type: 'project' as const })),
    ...leads.filter(l => l.name.toLowerCase().includes(searchQuery.toLowerCase()) || l.project.toLowerCase().includes(searchQuery.toLowerCase())).map(l => ({ ...l, type: 'lead' as const }))
  ].slice(0, 5);

  useEffect(() => {
    const session = localStorage.getItem("adminSession");
    if (!session) {
      navigate("/login");
      return;
    }
    fetchLeads(true);
    fetchProjects();
    fetchSysStats();
    const interval = setInterval(() => {
      fetchLeads();
      fetchProjects();
      fetchSysStats();
    }, 8000);
    return () => clearInterval(interval);
  }, [navigate, fetchLeads, fetchProjects, fetchSysStats]);

  const handleLogout = () => {
    localStorage.removeItem("adminSession");
    localStorage.removeItem("adminUserkey");
    navigate("/login");
  };

  // --- Dynamic Dashboard Logic ---
  const totalRevenue = projects.reduce((sum, p) => sum + (Number(p.total_amount) || 0), 0);
  
  // Calculate upcoming renewals (within 30 days) across all services
  const domainExpiries = projects.filter(p => isExpiringSoon(p.domain_expiry_date, 30));
  const sslExpiries = projects.filter(p => isExpiringSoon(p.ssl_expiry_date, 30));
  const serverExpiries = projects.filter(p => isExpiringSoon(p.server_expiry_date, 30));
  const totalRenewalsCount = domainExpiries.length + sslExpiries.length + serverExpiries.length;

  const todayLeads = leads.filter(l => {
    const leadDate = new Date(l.created_at);
    const today = new Date();
    return leadDate.toDateString() === today.toDateString();
  });

  // Unified Task List Generator
  const generateDynamicTasks = () => {
    const tasks: { id?: string; text: string; sub: string | undefined; type: string; date: string | undefined }[] = [];
    
    // 1. Custom User Tasks
    customTasks.forEach((t, i) => tasks.push({ id: `custom-${i}`, text: t, sub: "Manual Task", type: 'user', date: 'Task' }));

    // 2. Expiry Tasks
    domainExpiries.forEach(p => tasks.push({ text: `Renew Domain: ${p.domain_url}`, sub: p.client_name, type: 'critical', date: p.domain_expiry_date }));
    sslExpiries.forEach(p => tasks.push({ text: `Update SSL: ${p.project_name}`, sub: p.client_name, type: 'warning', date: p.ssl_expiry_date }));
    serverExpiries.forEach(p => tasks.push({ text: `Renew Server: ${p.project_name}`, sub: p.client_name, type: 'critical', date: p.server_expiry_date }));
    
    // 3. Lead Follow-up Tasks
    todayLeads.forEach(l => tasks.push({ text: `Follow up with ${l.name}`, sub: l.project, type: 'lead', date: 'Today' }));

    return tasks;
  };

  const dynamicTasks = generateDynamicTasks();

  const handleAddTask = () => {
    if (!newTask.trim()) return;
    setCustomTasks([...customTasks, newTask]);
    setNewTask("");
    toast.success("Task added to priorities");
  };
  // -------------------------------

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col md:flex-row overflow-hidden font-body text-slate-800">
      
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-admin-primary text-white z-20 relative">
        <LtrixonLogo size="sm" light={false} />
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 text-white hover:bg-white/10 rounded-admin transition-colors"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button 
            onClick={() => setIsMobileOpen(!isMobileOpen)} 
            className="p-2 -mr-2 text-white hover:bg-white/10 rounded-admin transition-colors"
          >
            {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-20 md:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar (Light as per screenshot) */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-30 bg-white border-r border-slate-200 flex flex-col h-screen transform transition-all duration-300 ease-in-out 
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        ${isCollapsed ? "md:w-16" : "md:w-60"}
      `}>
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          {!isCollapsed && <LtrixonLogo size="sm" light={true} />}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex p-1.5 rounded-admin hover:bg-slate-100 text-slate-400 transition-colors mx-auto"
          >
            {isCollapsed ? <ArrowRightToLine size={18} className="text-admin-primary" /> : <ArrowLeftToLine size={18} />}
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          
          {[
            { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
            { id: "automation hub", icon: Zap, label: "Automation Hub" },
            { id: "seo manager", icon: Globe, label: "SEO & Metadata" },
            { id: "clients & projects", icon: Briefcase, label: "Clients & Projects" },
            { id: "leads", icon: Users, label: "Project Leads", badge: leads.length > 0 ? leads.length.toString() : undefined },
            { id: "messages", icon: MessageSquare, label: "Messages" },
            { id: "settings", icon: Settings, label: "System Config" }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsMobileOpen(false);
              }}
              className={`w-full flex items-center rounded-admin transition-all duration-200 p-3 group ${
                activeTab === item.id 
                  ? "bg-admin-primary-light text-admin-primary shadow-sm" 
                  : "text-slate-500 hover:bg-admin-primary-light hover:text-admin-primary"
              } ${isCollapsed ? "justify-center" : "justify-between"}`}
              title={isCollapsed ? item.label : ""}
            >
              <div className="flex items-center gap-3 text-sm">
                <item.icon size={18} />
                {!isCollapsed && <span>{item.label}</span>}
              </div>
              {!isCollapsed && item.badge && (
                <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-admin-primary text-white shadow-sm">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-admin transition-colors text-sm group"
          >
            <LogOut size={18} className="group-hover:animate-pulse" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto relative z-10 transition-all duration-300">
        {/* Top Header (Orange as per request) */}
        <header className="h-14 bg-admin-primary flex items-center justify-between px-6 sticky top-0 z-20 hidden md:flex shadow-md">
          <div className="flex items-center">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">{activeTab.replace('-', ' ')}</h2>
          </div>

          <div className="flex items-center gap-5 relative text-white">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-admin transition-colors"
            >
              <Bell size={18} />
              {(leads.length > lastLeadCount.current || expiringDomains.length > 0) && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full animate-pulse shadow-sm" />
              )}
            </button>
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="relative w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-admin transition-colors"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="relative w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-admin transition-colors">
              <MessageSquare size={18} />
            </button>

            <div className="flex items-center gap-3 border-l border-white/20 pl-5 ml-2">
              <div className="text-right hidden lg:block">
                <div className="text-sm font-semibold tracking-tight">Admin User</div>
                <div className="text-xs text-white/70">Super Admin</div>
              </div>
              <div className="w-9 h-9 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white font-semibold text-sm">
                A
              </div>
            </div>

            {/* Dynamic Notification Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowNotifications(false)} />
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute top-12 right-0 w-80 bg-white border border-slate-200 shadow-2xl rounded-admin overflow-hidden z-40 text-slate-800"
                  >
                    <div className="bg-admin-primary p-4 text-center border-b border-admin-primary">
                       <h4 className="text-white font-semibold text-sm">{leads.length} New Leads</h4>
                    </div>
                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                      {leads.length === 0 ? (
                        <div className="p-8 text-center text-sm text-slate-500 font-medium tracking-wide">No data available</div>
                      ) : (
                        leads.slice(0, 5).map((lead, i) => (
                          <div key={i} className="p-4 flex gap-3 hover:bg-slate-50 transition-colors cursor-pointer group">
                             <div className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center bg-slate-100 text-admin-primary">
                                <Users size={18} />
                             </div>
                             <div className="flex-1">
                                <h5 className="text-sm font-semibold text-slate-800 mb-0.5 group-hover:text-admin-primary transition-colors">{lead.name}</h5>
                                <p className="text-xs text-slate-500 line-clamp-1 mb-1">{lead.project}</p>
                                <span className="text-xs text-slate-400">{new Date(lead.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                             </div>
                          </div>
                        ))
                      )}
                    </div>
                    <button className="w-full py-3 bg-slate-50 border-t border-slate-100 text-center text-sm font-medium text-admin-primary hover:bg-slate-100 transition-all">
                      View Audit Log
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Top Stats - Only visible on Dashboard */}
            {activeTab === 'dashboard' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                {[
                  { label: "Active Projects", value: projects.length.toString() },
                  { label: "Total Leads", value: leads.length.toString() },
                  { label: "Check Renewals", value: totalRenewalsCount.toString(), alert: totalRenewalsCount > 0 },
                  { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}` },
                ].map((stat, i) => (
                  <div key={i} className={`bg-white border-l-4 rounded-admin p-6 shadow-[0_2px_10px_rgba(0,0,0,0.06)] group hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all ${stat.alert ? "border-red-500 bg-red-50/20" : "border-admin-primary"}`}>
                    <div className={`text-[10px] font-black uppercase tracking-widest mb-2 ${stat.alert ? "text-red-500" : "text-slate-400"}`}>{stat.label}</div>
                    <div className={`text-2xl font-black tracking-tight ${stat.alert ? "text-red-600" : "text-admin-primary"}`}>{stat.value}</div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'dashboard' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                 <div className="lg:col-span-2 bg-white border border-slate-100 rounded-admin p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                       <div>
                          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2"><TrendingUp size={16} className="text-admin-primary" /> Revenue Velocity</h3>
                          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Real-time financial performance</p>
                       </div>
                       <div className="text-right">
                          <div className="text-lg font-black text-admin-primary">₹{totalRevenue.toLocaleString()}</div>
                          <div className="text-[9px] text-green-500 font-bold uppercase">Total LTV</div>
                       </div>
                    </div>
                    <div className="h-64 w-full">
                       <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={
                            projects.length > 0 
                              ? projects.slice(-8).flatMap((p, i) => [
                                  { name: `P${i}.1`, value: Number(p.total_amount) * 0.8 },
                                  { name: `P${i}.2`, value: Number(p.total_amount) * 1.2 },
                                  { name: `P${i}.3`, value: Number(p.total_amount) }
                                ])
                              : []
                          }>
                             <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                   <stop offset="5%" stopColor="var(--admin-primary)" stopOpacity={0.2}/>
                                   <stop offset="95%" stopColor="var(--admin-primary)" stopOpacity={0}/>
                                </linearGradient>
                             </defs>
                             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" opacity={0.1} />
                             <XAxis dataKey="name" hide />
                             <YAxis hide domain={['dataMin - 1000', 'dataMax + 1000']} />
                             <Tooltip 
                                contentStyle={{ borderRadius: '8px', border: 'none', backgroundColor: '#111827', color: '#fff', fontSize: '12px', fontWeight: '800' }}
                                itemStyle={{ color: 'var(--admin-primary)' }}
                                cursor={{ stroke: 'var(--admin-primary)', strokeWidth: 1, strokeDasharray: '5 5' }}
                             />
                             <Area 
                               type="monotone" 
                               dataKey="value" 
                               stroke="var(--admin-primary)" 
                               strokeWidth={2} 
                               fillOpacity={1} 
                               fill="url(#colorRevenue)" 
                               animationDuration={3000}
                               isAnimationActive={true}
                             />
                          </AreaChart>
                       </ResponsiveContainer>
                    </div>
                 </div>

                 <div className="bg-white border border-slate-100 rounded-admin p-6 shadow-sm flex flex-col justify-between">
                    <div>
                       <div className="flex items-center justify-between mb-6">
                          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                             <div className={`w-2 h-2 rounded-full ${trafficPeriod === 'live' ? 'bg-green-500 animate-ping' : 'bg-slate-300'}`}></div> Traffic Monitor
                          </h3>
                          <div className="flex bg-slate-100 p-1 rounded-admin gap-1">
                             {(['live', 'today', 'month'] as const).map((p) => (
                               <button 
                                 key={p}
                                 onClick={() => setTrafficPeriod(p)}
                                 className={`px-2 py-1 text-[8px] font-black uppercase rounded-[3px] transition-all ${trafficPeriod === p ? 'bg-white text-admin-primary shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                               >
                                 {p}
                               </button>
                             ))}
                          </div>
                       </div>
                       <div className="flex items-baseline gap-2">
                          <div className="text-4xl font-black text-slate-800 tracking-tighter">
                            {trafficPeriod === 'live' ? (sysStats?.db_stats?.live_now || 0) : trafficPeriod === 'today' ? (sysStats?.db_stats?.visits_today || 0) : (sysStats?.db_stats?.visits_month || 0)}
                          </div>
                          <div className="text-xs font-bold text-admin-primary uppercase">{trafficPeriod === 'live' ? 'Active' : 'Visits'}</div>
                       </div>
                       <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">
                         {trafficPeriod === 'live' ? 'Current users browsing right now' : trafficPeriod === 'today' ? 'Total unique visitors today' : 'Estimated traffic this month'}
                       </p>
                    </div>

                    <div className="mt-8 space-y-4">
                       <div className="space-y-1.5">
                          <div className="flex justify-between text-[9px] font-black uppercase text-slate-500">
                             <span>Engagement Rate</span>
                             <span>{trafficPeriod === 'live' ? '84%' : '62%'}</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                             <motion.div 
                                initial={{ width: "0%" }}
                                animate={{ width: trafficPeriod === 'live' ? '84%' : '62%' }}
                                className="h-full bg-admin-primary shadow-[0_0_10px_rgba(var(--admin-primary-rgb),0.3)]"
                             />
                          </div>
                       </div>
                       <div className="p-3 bg-slate-50 rounded-admin border border-slate-100 text-[9px] font-bold text-slate-500 leading-tight">
                          {trafficPeriod === 'live' ? '💡 Real-time data is synced every 4 seconds.' : '📈 Traffic has increased by 12% compared to last period.'}
                       </div>
                    </div>
                 </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Security Center */}
                  <div className="lg:col-span-2 bg-white border border-slate-200 rounded-admin shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
                        <Shield size={20} />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-slate-800 tracking-tight">Security Center</h3>
                        <p className="text-xs text-slate-400 font-medium">Update account credentials</p>
                      </div>
                    </div>
                    <form onSubmit={handleChangePassword} className="p-8 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Current Password</label>
                           <div className="relative">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                              <input 
                                type="password" 
                                required
                                value={passwords.current}
                                onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-admin text-sm focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all" 
                                placeholder="••••••••" 
                              />
                           </div>
                         </div>
                         <div className="hidden md:block" />
                         <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">New Password</label>
                           <div className="relative">
                              <input 
                                type="password" 
                                required
                                value={passwords.new}
                                onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-admin text-sm focus:ring-2 focus:ring-admin-primary-light focus:border-admin-primary outline-none transition-all" 
                                placeholder="New password" 
                              />
                           </div>
                         </div>
                         <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Confirm New Password</label>
                           <div className="relative">
                              <input 
                                type="password" 
                                required
                                value={passwords.confirm}
                                onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-admin text-sm focus:ring-2 focus:ring-admin-primary-light focus:border-admin-primary outline-none transition-all" 
                                placeholder="Repeat password" 
                              />
                           </div>
                         </div>
                      </div>
                      <div className="flex justify-end pt-4">
                        <button type="submit" className="px-8 py-3 bg-slate-800 text-white text-xs font-black rounded-admin hover:bg-slate-900 transition-all uppercase tracking-widest shadow-lg shadow-slate-200 active:scale-[0.98]">
                          Update Security Credentials
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* System Health */}
                  <div className="bg-white border border-slate-200 rounded-admin shadow-sm overflow-hidden flex flex-col h-fit">
                    <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                        <Activity size={20} />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-slate-800 tracking-tight">System Health</h3>
                        <p className="text-xs text-slate-400 font-medium tracking-wide">Live environment status</p>
                      </div>
                    </div>
                    <div className="p-6 space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 text-slate-500 font-medium"><Server size={14} /> Database</div>
                          <span className="text-green-600 font-black flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> {sysStats?.status || "Online"}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 text-slate-500 font-medium"><Globe size={14} /> Network</div>
                          <span className="text-slate-800 font-black">Stable (32ms)</span>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-slate-50">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Instance Statistics</div>
                        <div className="flex gap-4">
                            <div className="flex-1 bg-slate-50 p-4 rounded-admin border-l-2 border-admin-primary">
                               <div className="text-xs font-black text-admin-primary">{sysStats?.db_stats?.projects || 0}</div>
                               <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Storage</div>
                            </div>
                            <div className="flex-1 bg-slate-50 p-4 rounded-admin border-l-2 border-admin-primary">
                               <div className="text-xs font-black text-admin-primary">{sysStats?.db_stats?.leads || 0}</div>
                               <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Leads Log</div>
                            </div>
                         </div>
                      </div>

                      <div className="bg-slate-900 p-4 rounded-admin mt-4 text-[10px] font-mono text-slate-400 leading-normal">
                         <span className="text-green-400">$</span> fetching system_metadata... <br/>
                         [OK] Core v{sysStats?.version || "2.1"} loaded <br/>
                         [OK] Auth tunnel secured
                      </div>
                    </div>
                  </div>
                </div>

                {/* Branding Config */}
                <div className="bg-white border border-slate-200 rounded-admin shadow-sm overflow-hidden p-8 flex items-center justify-between">
                   <div className="flex items-center gap-6">
                       <div className="w-16 h-16 bg-slate-100 rounded-admin flex items-center justify-center text-slate-300 relative group overflow-hidden border border-dashed border-slate-300 hover:border-admin-primary transition-all">
                          {brandLogo ? (
                            <>
                              <img src={brandLogo} alt="Logo" className="w-full h-full object-contain p-2" />
                              <button 
                                onClick={handleRemoveLogo}
                                className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-white"
                                title="Remove Logo"
                              >
                                <Trash2 size={20} />
                              </button>
                            </>
                          ) : (
                            <label className="cursor-pointer flex flex-col items-center gap-1">
                               <Upload size={20} className="text-slate-400 group-hover:text-admin-primary transition-all" />
                               <span className="text-[8px] font-black uppercase text-slate-400 group-hover:text-admin-primary transition-all">Upload</span>
                               <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                            </label>
                          )}
                       </div>
                       <div>
                          <h3 className="text-lg font-black text-slate-800 tracking-tight">Ltrixon Corporate Identity</h3>
                          <p className="text-xs text-slate-500 font-medium">Global system-wide branding and logo configurations.</p>
                       </div>
                     <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Typography Style</label>
                       <div className="flex flex-wrap gap-2">
                         {fontFamilies.map((f) => (
                           <button
                             key={f.id}
                             onClick={() => setCurrentFont(f)}
                             className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-admin border transition-all ${
                               currentFont.id === f.id 
                                 ? 'bg-slate-800 text-white border-slate-800 shadow-md scale-105' 
                                 : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                             }`}
                             style={{ fontFamily: f.body }}
                           >
                             {f.name}
                           </button>
                         ))}
                       </div>
                     </div>
                   </div>
                   <div className="flex flex-col gap-4">
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Interface Mode</label>
                        <div className="flex gap-2">
                           <button 
                             onClick={() => setIsDarkMode(false)}
                             className={`flex-1 py-3 rounded-admin border flex flex-col items-center gap-2 transition-all ${!isDarkMode ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                           >
                              <Sun size={20} />
                              <span className="text-[10px] font-black uppercase tracking-widest">Light Mode</span>
                           </button>
                           <button 
                             onClick={() => setIsDarkMode(true)}
                             className={`flex-1 py-3 rounded-admin border flex flex-col items-center gap-2 transition-all ${isDarkMode ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                           >
                              <Moon size={20} />
                              <span className="text-[10px] font-black uppercase tracking-widest">Dark Mode</span>
                           </button>
                        </div>
                      </div>
                     <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Color Preset</label>
                       <div className="flex flex-wrap gap-2">
                         {themes.map((t) => (
                           <button
                             key={t.name}
                             onClick={() => setCurrentTheme(t)}
                             className={`w-8 h-8 rounded-full border-2 transition-all transform hover:scale-110 shadow-sm ${
                               currentTheme.name === t.name ? 'border-slate-800 scale-125 z-10' : 'border-white'
                             }`}
                             style={{ backgroundColor: t.primary }}
                             title={t.name}
                           />
                         ))}
                       </div>
                     </div>
                     <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Layout Template</label>
                       <div className="flex flex-wrap gap-2">
                         {templates.map((temp) => (
                           <button
                             key={temp.id}
                             onClick={() => setCurrentTemplate(temp)}
                             className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-admin border transition-all ${
                               currentTemplate.id === temp.id 
                                 ? 'bg-slate-800 text-white border-slate-800 shadow-md scale-105' 
                                 : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                             }`}
                           >
                             {temp.name}
                           </button>
                         ))}
                       </div>
                     </div>
                     <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Text Scaling</label>
                       <div className="flex flex-wrap gap-2">
                         {fontSizes.map((s) => (
                           <button
                             key={s.id}
                             onClick={() => setCurrentFontSize(s)}
                             className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-admin border transition-all ${
                               currentFontSize.id === s.id 
                                 ? 'bg-slate-800 text-white border-slate-800 shadow-md scale-105' 
                                 : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                             }`}
                           >
                             {s.name}
                           </button>
                         ))}
                       </div>
                     </div>
                   </div>
                </div>
              </div>
            )}

             {activeTab === 'automation hub' && (
              <div className="space-y-6">
                 <div className="bg-admin-primary p-8 rounded-admin text-white shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                       <h2 className="text-2xl font-black tracking-tight mb-2 flex items-center gap-3"><Zap className="animate-pulse" /> Renewal Automation Center</h2>
                       <p className="text-white/90 max-w-lg text-sm font-bold">Predictive expiry detection and automated client follow-up hub. Increase your retention by 40% with smart alerts.</p>
                    </div>
                    <div className="absolute right-[-20px] top-[-20px] opacity-10 rotate-12"><Zap size={200} /></div>
                 </div>

                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                       <div className="bg-white border border-slate-200 rounded-admin shadow-sm p-6">
                          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2"><Activity size={16} className="text-admin-primary" /> Active Expiry Queue</h3>
                          <div className="space-y-4">
                             {projects.filter(p => isExpiringSoon(p.domain_expiry_date, 7) || isExpiringSoon(p.server_expiry_date, 7)).length === 0 ? (
                               <div className="text-center py-12 bg-slate-50 rounded-admin border-2 border-dashed border-slate-200">
                                  <CheckCircle size={32} className="text-green-500 mx-auto mb-3" />
                                  <p className="text-sm font-bold text-slate-500">All systems operational. No expiries in the next 7 days.</p>
                               </div>
                             ) : (
                               projects.filter(p => isExpiringSoon(p.domain_expiry_date, 7) || isExpiringSoon(p.server_expiry_date, 7)).map((p, idx) => {
                                 const daysLeft = Math.min(getDaysRemaining(p.domain_expiry_date), getDaysRemaining(p.server_expiry_date));
                                 const isCritical = daysLeft <= 5;
                                 
                                 return (
                                   <div key={idx} className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-admin border transition-all gap-4 ${isCritical ? 'bg-red-50/50 border-red-100 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'bg-white border-slate-100 hover:border-admin-primary/30'}`}>
                                      <div className="flex items-center gap-4">
                                         <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isCritical ? 'bg-red-100 text-red-600' : 'bg-admin-primary-light text-admin-primary'}`}>
                                            <Calendar size={18} />
                                         </div>
                                         <div>
                                            <div className="text-sm font-black text-slate-800">{p.project_name}</div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{p.client_name} • Expiring in {daysLeft} days</div>
                                         </div>
                                      </div>
                                      <div className="w-full sm:w-auto">
                                         <button 
                                           onClick={() => {
                                             const msg = `Hello ${p.client_name}, this is a reminder from Smartech/Ltrixon. Your renewal for ${p.project_name} is due in ${daysLeft} days (${p.domain_expiry_date}). Please renew to keep your service active.`;
                                             window.open(`https://wa.me/${p.client_phone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
                                           }}
                                           className={`w-full sm:w-auto px-4 py-2 rounded-admin text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-all shadow-sm ${isCritical ? 'bg-red-600 text-white hover:bg-red-700' : 'btn-theme-primary'}`}
                                         >
                                            <Send size={12} /> Send Smart Alert
                                         </button>
                                      </div>
                                   </div>
                                 );
                               })
                             )}
                          </div>
                       </div>
                    </div>

                    <div className="space-y-6">
                       <div className="bg-white border border-slate-200 rounded-admin shadow-sm p-6">
                          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4">Automation Insights</h3>
                          <div className="space-y-4">
                             <div className="flex items-center justify-between p-3 bg-slate-50 rounded-admin border-l-2 border-admin-primary">
                                <div className="text-xs font-bold text-slate-500">Upcoming Expiries</div>
                                <div className="text-sm font-black text-admin-primary">{projects.filter(p => isExpiringSoon(p.domain_expiry_date, 7) || isExpiringSoon(p.server_expiry_date, 7)).length}</div>
                             </div>
                             <div className="flex items-center justify-between p-3 bg-red-50 rounded-admin border-l-2 border-red-500">
                                <div className="text-xs font-bold text-red-500">Critical (≤ 5 Days)</div>
                                <div className="text-sm font-black text-red-600">{projects.filter(p => getDaysRemaining(p.domain_expiry_date) <= 5 || getDaysRemaining(p.server_expiry_date) <= 5).length}</div>
                             </div>
                          </div>
                          <div className="mt-6 pt-6 border-t border-slate-100 text-[10px] text-slate-400 font-medium leading-relaxed italic">
                             Automation Note: Alerts are calculated based on server time. Ensure all client phone numbers are in international format for WhatsApp delivery.
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
            )}

            {activeTab === 'clients & projects' && (
              <div className="bg-white border border-slate-100 rounded-admin shadow-[0_2px_10px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col mb-6">
                <div className="p-4 md:p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <h3 className="text-base font-semibold text-slate-800">Client & Project Directory</h3>
                  <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    <div className="flex items-center gap-2 mr-auto sm:mr-0">
                      <button onClick={handleExportCSV} className="p-2 rounded-admin text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all border border-slate-100" title="Export CSV">
                         <Download size={18} />
                      </button>
                      <button onClick={handleExportPDF} className="p-2 rounded-admin text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all border border-slate-100" title="Export PDF">
                         <FileText size={18} />
                      </button>
                    </div>
                    <button onClick={() => { setSelectedProject(null); setIsInvoiceModalOpen(true); }} className="flex-1 sm:flex-initial bg-white border border-slate-200 px-4 py-2 rounded-admin text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.05)] active:scale-[0.98]">Gen Invoice</button>
                    <button onClick={() => { setEditingProject(null); setActiveTab("create project"); }} className="flex-1 sm:flex-initial inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-white bg-gradient-to-b from-[var(--admin-primary)] to-[var(--admin-hover)] border border-[var(--admin-hover)] rounded-admin shadow-sm hover:opacity-90 active:scale-[0.98] transition-all">Create Project</button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead className="bg-slate-50/50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-4">Client</th>
                        <th className="px-6 py-4">Project Details</th>
                        <th className="px-6 py-4">Domain</th>
                        <th className="px-6 py-4">Amount</th>
                        <th className="px-6 py-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {projects.length === 0 ? (
                        <tr><td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-500 font-medium">No Projects Found - Add manually via "Create Project"</td></tr>
                      ) : (
                        projects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((p, i) => (
                          <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="text-sm font-semibold text-slate-800 mb-0.5">{p.client_name}</div>
                              <div className="text-xs text-slate-500 mb-0.5">{p.client_email}</div>
                              <div className="text-xs text-slate-400">{p.client_phone}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-slate-700 mb-1.5">{p.project_name}</div>
                              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${p.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-admin-primary-light text-admin-primary'}`}>{p.status}</span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-blue-600 mb-1">{p.domain_url || 'N/A'}</div>
                              {p.domain_expiry_date && <div className="text-xs text-admin-primary font-medium">Expires: {p.domain_expiry_date}</div>}
                            </td>
                            <td className="px-6 py-4 text-sm font-semibold text-slate-800">₹{p.total_amount}</td>
                             <td className="px-6 py-4 text-center">
                               <div className="flex items-center justify-center gap-2">
                                  <button 
                                    onClick={() => { setSelectedProject(p); setIsInvoiceModalOpen(true); }} 
                                    className="px-3 py-1.5 rounded-admin text-[10px] font-black uppercase shadow-sm active:scale-95 btn-theme-primary"
                                  >
                                    Invoice
                                  </button>
                                  <button 
                                    onClick={() => { setEditingProject(p); setActiveTab("create project"); }} 
                                    className="px-3 py-1.5 rounded-admin text-[10px] font-black uppercase active:scale-95 btn-theme-secondary"
                                  >
                                    Edit
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteProject(p.projectkey)} 
                                    className="px-3 py-1.5 rounded-admin text-[10px] font-black uppercase text-red-600 bg-red-50 border border-red-100 hover:bg-red-600 hover:text-white transition-all active:scale-95"
                                  >
                                    Delete
                                  </button>
                               </div>
                             </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                   </table>
                 </div>

                 {/* Creative Pagination UI */}
                 <div className="p-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                       Showing <span className="text-slate-800 dark:text-white">{Math.min((currentPage - 1) * itemsPerPage + 1, projects.length)}</span> to <span className="text-slate-800 dark:text-white">{Math.min(currentPage * itemsPerPage, projects.length)}</span> of <span className="text-slate-800 dark:text-white">{projects.length}</span> Projects
                    </div>
                    
                    <div className="flex items-center gap-1.5">
                       <button 
                         onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                         disabled={currentPage === 1}
                         className={`p-2 rounded-admin border transition-all ${currentPage === 1 ? 'opacity-30 cursor-not-allowed border-slate-100 text-slate-300' : 'border-slate-200 text-slate-600 hover:border-admin-primary hover:text-admin-primary bg-white'}`}
                       >
                          <ChevronLeft size={16} />
                       </button>
                       
                       {Array.from({ length: Math.ceil(projects.length / itemsPerPage) }).map((_, i) => (
                         <button
                           key={i}
                           onClick={() => setCurrentPage(i + 1)}
                           className={`min-w-[32px] h-8 rounded-admin text-[10px] font-black transition-all border ${
                             currentPage === i + 1 
                               ? 'bg-admin-primary border-admin-primary text-white shadow-lg shadow-admin-primary/20 scale-110' 
                               : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'
                           }`}
                         >
                            {i + 1}
                         </button>
                       ))}

                       <button 
                         onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(projects.length / itemsPerPage)))}
                         disabled={currentPage === Math.ceil(projects.length / itemsPerPage)}
                         className={`p-2 rounded-admin border transition-all ${currentPage === Math.ceil(projects.length / itemsPerPage) ? 'opacity-30 cursor-not-allowed border-slate-100 text-slate-300' : 'border-slate-200 text-slate-600 hover:border-admin-primary hover:text-admin-primary bg-white'}`}
                       >
                          <ChevronRight size={16} />
                       </button>
                    </div>
                 </div>
              </div>
            )}

            {activeTab === 'create project' && (
               <CreateProjectForm 
                 initialData={editingProject}
                 onSuccess={() => {
                   fetchProjects();
                   setEditingProject(null);
                   setActiveTab("clients & projects");
                 }}
                 onCancel={() => {
                   setEditingProject(null);
                   setActiveTab("clients & projects");
                 }}
               />
             )}

            {activeTab === 'leads' && (
              <div className="bg-white border border-slate-100 rounded-admin shadow-[0_2px_10px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-base font-semibold text-slate-800">Project Leads Directory</h3>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{leads.filter(l => l.project !== 'Contact Form').length} High Intent Inquiries</div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[900px]">
                    <thead className="bg-slate-50/50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-4">Lead Info</th>
                        <th className="px-6 py-4">Project Requested</th>
                        <th className="px-6 py-4">Message / Intent</th>
                        <th className="px-6 py-4">Received</th>
                        <th className="px-6 py-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {leads.filter(l => l.project !== 'Contact Form').length === 0 ? (
                        <tr><td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-500 font-medium tracking-wide">No high-intent leads found</td></tr>
                      ) : (
                        leads.filter(l => l.project !== 'Contact Form').map((l) => (
                          <tr key={l.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-admin-primary/10 flex items-center justify-center text-admin-primary font-bold text-xs shrink-0 relative">
                                  {l.name.charAt(0).toUpperCase()}
                                  {!l.is_read && <span className="absolute -top-1 -right-1 w-3 h-3 bg-admin-primary border-2 border-white rounded-full animate-pulse" />}
                                </div>
                                <div>
                                  <div className="text-sm font-semibold text-slate-800 mb-0.5">{l.name}</div>
                                  <div className="text-xs text-slate-500 flex items-center gap-1">{l.email}</div>
                                  {l.phone && <div className="text-[10px] text-slate-400 font-medium mt-0.5">{l.phone}</div>}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-slate-700">{l.project}</div>
                              <div className={`inline-flex mt-1 items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${l.project === 'Contact Form' ? 'bg-slate-100 text-slate-500' : 'bg-blue-50 text-blue-600'}`}>
                                {l.project === 'Contact Form' ? 'General' : 'Incoming'}
                              </div>
                            </td>
                            <td className="px-6 py-4 max-w-xs">
                              <p className="text-sm text-slate-600 line-clamp-2 italic">"{l.intent || 'No message provided'}"</p>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-slate-700 font-medium">{new Date(l.created_at).toLocaleDateString()}</div>
                              <div className="text-[10px] text-slate-400">{new Date(l.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                {!l.is_read && (
                                  <button 
                                    onClick={() => handleMarkRead(l.id)}
                                    className="text-[10px] font-bold text-slate-600 hover:text-white border border-slate-200 hover:border-slate-800 bg-slate-50 hover:bg-slate-800 px-3 py-1.5 rounded-admin transition-all"
                                  >
                                    Mark Handled
                                  </button>
                                )}
                                <a 
                                  href={`mailto:${l.email}?subject=Regarding your ${l.project} inquiry`}
                                  className="text-[10px] font-bold text-blue-600 hover:text-white border border-blue-600/30 hover:border-blue-600 bg-blue-50 hover:bg-blue-600 px-3 py-1.5 rounded-admin transition-all shadow-sm"
                                >
                                  Email
                                </a>
                                <button 
                                  onClick={() => handleDeleteLead(l.id)} 
                                  className="text-[10px] font-bold text-red-600 hover:text-white border border-red-600/30 hover:border-red-600 bg-red-50 hover:bg-red-600 px-3 py-1.5 rounded-admin transition-all shadow-sm"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'messages' && (
              <div className="bg-white border border-slate-200 rounded-admin shadow-[0_4px_20px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col md:flex-row h-[calc(100vh-200px)] min-h-[500px]">
                 <div className="w-full md:w-80 border-r border-slate-100 flex flex-col bg-slate-50/30">
                  <div className="p-4 border-b border-slate-100 bg-white">
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Inbox</h3>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    {leads.filter(l => l.project === 'Contact Form').length === 0 ? (
                      <div className="p-8 text-center text-sm text-slate-400 italic">No messages yet</div>
                    ) : (
                      leads.filter(l => l.project === 'Contact Form').map((msg) => (
                        <div 
                          key={msg.id} 
                          onClick={() => { setSelectedLeadId(msg.id); if(!msg.is_read) handleMarkRead(msg.id); }}
                          className={`p-4 border-b border-slate-100 cursor-pointer transition-all hover:bg-white relative ${selectedLeadId === msg.id ? 'bg-white border-l-4 border-l-admin-primary shadow-sm' : 'opacity-80'}`}
                        >
                          {!msg.is_read && <div className="absolute top-4 left-0 w-1 h-8 bg-admin-primary rounded-r-md" />}
                          <div className="flex justify-between items-start mb-1">
                            <span className={`text-sm tracking-tight truncate pr-2 ${!msg.is_read ? 'font-black text-slate-900' : 'font-bold text-slate-800'}`}>{msg.name}</span>
                            <span className="text-[10px] text-slate-400 whitespace-nowrap">{new Date(msg.created_at).toLocaleDateString([], {month:'short', day:'numeric'})}</span>
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed italic">"{msg.intent}"</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Message Detail View */}
                <div className="flex-1 flex flex-col bg-white">
                  {selectedLeadId && leads.find(l => l.id === selectedLeadId) ? (
                    (() => {
                      const msg = leads.find(l => l.id === selectedLeadId);
                      return (
                        <>
                          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-admin-primary text-white flex items-center justify-center font-black text-lg">
                                {msg.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <h2 className="text-lg font-black text-slate-800 tracking-tight">{msg.name}</h2>
                                <p className="text-xs text-slate-500 font-medium">{msg.email}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                               <button onClick={() => handleDeleteLead(msg.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-admin transition-all"><X size={18} /></button>
                            </div>
                          </div>
                          <div className="flex-1 p-8 overflow-y-auto">
                            <div className="bg-slate-50 p-6 rounded-admin border border-slate-100 relative mb-6">
                              <div className="absolute top-0 left-6 -translate-y-1/2 bg-white px-3 py-1 border border-slate-100 text-[10px] font-black text-admin-primary uppercase tracking-widest rounded-full">Inquiry Details</div>
                              <p className="text-slate-700 leading-relaxed font-medium italic whitespace-pre-wrap">
                                {msg.intent}
                              </p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                               <div className="bg-white p-4 border border-slate-100 rounded-admin">
                                  <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Phone Number</div>
                                  <div className="text-sm font-bold text-slate-800">{msg.phone || 'Not provided'}</div>
                               </div>
                               <div className="bg-white p-4 border border-slate-100 rounded-admin">
                                  <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Time Received</div>
                                  <div className="text-sm font-bold text-slate-800">{new Date(msg.created_at).toLocaleString()}</div>
                               </div>
                            </div>
                          </div>
                          <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-between gap-4">
                            <div className="flex gap-3">
                              <a 
                                href={`mailto:${msg.email}`}
                                className="inline-flex items-center justify-center px-6 py-2.5 text-xs font-black text-white bg-slate-800 rounded-admin hover:bg-slate-900 transition-all active:scale-[0.98]"
                              >
                                Reply via Email
                              </a>
                              {msg.phone && (
                                <a 
                                  href={`https://wa.me/${msg.phone.replace(/[^0-9]/g, '')}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center justify-center px-6 py-2.5 text-xs font-black text-white bg-green-600 rounded-admin hover:bg-green-700 transition-all active:scale-[0.98]"
                                >
                                  WhatsApp
                                </a>
                              )}
                            </div>
                            <button 
                              onClick={() => handlePromoteLead(msg.id)}
                              className="inline-flex items-center justify-center px-6 py-2.5 text-xs font-black uppercase shadow-sm transition-all active:scale-95 btn-theme-primary rounded-admin"
                            >
                              Move to Projects
                            </button>
                          </div>
                        </>
                      );
                    })()
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-4">
                      <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                        <MessageSquare size={32} />
                      </div>
                      <div>
                        <h3 className="text-slate-800 font-bold">No Message Selected</h3>
                        <p className="text-sm text-slate-400 max-w-xs">Select an inquiry from the inbox on the left to view project details and contact options.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'seo manager' && (
              <div className="space-y-6">
                 <div className="bg-white border border-slate-100 rounded-admin p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                       <div>
                          <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2"><Globe className="text-admin-primary" /> SEO & Metadata Manager</h2>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Manage global search engine presence</p>
                       </div>
                       <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black rounded-full border border-green-100 animate-pulse">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div> Indexing Active
                       </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                       {[
                         { id: 1, page: 'Home Page', title: 'Ltrixon | Creative Agency', desc: 'Modern web design and development services.', key: 'web design, ltrixon, development' },
                         { id: 2, page: 'About Us', title: 'About Ltrixon', desc: 'Learn more about our creative journey.', key: 'about, agency, mission' }
                       ].map((item) => (
                         <div key={item.id} className="p-6 rounded-admin border border-slate-100 bg-slate-50/30 hover:border-admin-primary/30 transition-all group">
                            <div className="flex items-center justify-between mb-6">
                               <span className="text-[10px] font-black uppercase text-admin-primary tracking-widest bg-admin-primary-light px-2 py-1 rounded-md">{item.page}</span>
                               <button className="text-[10px] font-black uppercase text-slate-400 hover:text-admin-primary transition-colors">Reset Defaults</button>
                            </div>
                            <div className="space-y-4">
                               <div>
                                  <label className="text-[10px] font-black text-slate-400 uppercase mb-1.5 block">Browser Title</label>
                                  <input defaultValue={item.title} className="w-full bg-white border border-slate-200 rounded-admin p-2.5 text-sm font-bold text-slate-700 focus:border-admin-primary outline-none transition-all" />
                               </div>
                               <div>
                                  <label className="text-[10px] font-black text-slate-400 uppercase mb-1.5 block">Meta Description</label>
                                  <textarea defaultValue={item.desc} rows={3} className="w-full bg-white border border-slate-200 rounded-admin p-2.5 text-sm font-medium text-slate-600 focus:border-admin-primary outline-none transition-all resize-none" />
                               </div>
                               <div>
                                  <label className="text-[10px] font-black text-slate-400 uppercase mb-1.5 block">Focus Keywords</label>
                                  <input defaultValue={item.key} className="w-full bg-white border border-slate-200 rounded-admin p-2.5 text-sm font-bold text-slate-500 focus:border-admin-primary outline-none transition-all" />
                               </div>
                            </div>
                            <button className="w-full mt-6 py-2.5 rounded-admin text-[10px] font-black uppercase transition-all shadow-sm active:scale-95 btn-theme-primary">Update Metadata</button>
                         </div>
                       ))}
                    </div>

                    <div className="mt-12 p-4 bg-slate-800 rounded-admin flex flex-col sm:flex-row items-center justify-between gap-4">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white"><Shield size={16} /></div>
                          <div>
                             <div className="text-xs font-black text-white uppercase tracking-tight">Sitemap Auto-Sync</div>
                             <div className="text-[9px] text-white/50 font-bold uppercase">Last pinged: {new Date().toLocaleTimeString()}</div>
                          </div>
                       </div>
                       <button className="w-full sm:w-auto px-6 py-2.5 bg-white text-slate-900 text-[10px] font-black uppercase rounded-admin hover:bg-slate-100 transition-all active:scale-95">Ping Search Engines</button>
                    </div>
                 </div>
              </div>
            )}
            <div className={`grid grid-cols-1 lg:grid-cols-5 gap-6 ${activeTab !== 'dashboard' && 'hidden'}`}>
              
              {/* Tasks Card (Left Side) - 2 Columns */}
              <div className="lg:col-span-2 flex flex-col bg-white border border-slate-100 rounded-admin shadow-[0_2px_10px_rgba(0,0,0,0.06)] overflow-hidden h-fit">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-base font-semibold text-slate-800">Priority Tasks</h3>
                  <button className="text-sm font-medium text-admin-primary hover:opacity-80">View All</button>
                </div>
                
                <div className="p-6 space-y-8 flex-1">
                  {/* Today Group */}
                  <div className="space-y-4">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Dynamic Priorities</div>
                    <div className="space-y-4">
                      {dynamicTasks.length === 0 ? (
                        <div className="py-8 text-center bg-slate-50/50 rounded-admin border border-dashed border-slate-200">
                          <CheckCircle className="mx-auto text-slate-300 mb-2" size={24} />
                          <p className="text-sm text-slate-500 font-medium">All caught up! No urgent tasks.</p>
                        </div>
                      ) : (
                        dynamicTasks.map((task, i) => (
                          <div key={i} className={`flex items-center gap-4 p-3 rounded-admin border transition-all hover:shadow-sm ${
                            task.type === 'critical' ? 'bg-red-50 border-red-100' : 
                            task.type === 'warning' ? 'bg-orange-50 border-orange-100' : 
                            task.type === 'user' ? 'bg-slate-50 border-slate-200' : 'bg-blue-50 border-blue-100'
                          }`}>
                            <div className={`w-5 h-5 rounded border bg-white flex items-center justify-center shrink-0 ${
                              task.type === 'critical' ? 'border-red-300' : 'border-slate-300'
                            }`} />
                            <div className="flex-1 min-w-0">
                              <div className={`text-sm font-semibold truncate ${
                                task.type === 'critical' ? 'text-red-700' : 
                                task.type === 'warning' ? 'text-orange-700' : 
                                task.type === 'user' ? 'text-slate-700' : 'text-blue-700'
                              }`}>{task.text}</div>
                              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">{task.sub}</div>
                            </div>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded tracking-tighter shrink-0 ${
                              task.type === 'critical' ? 'bg-red-100 text-red-600' : 
                              task.type === 'warning' ? 'bg-orange-100 text-orange-600' : 
                              task.type === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-blue-100 text-blue-600'
                            }`}>{task.date}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-slate-100 flex gap-3">
                  <input 
                    type="text" 
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                    placeholder="Type your task..." 
                    className="flex-1 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-admin-primary-light focus:border-admin-primary transition-all text-sm px-4 py-2.5 rounded-admin text-slate-700"
                  />
                  <button onClick={handleAddTask} className="relative inline-flex items-center justify-center px-5 py-2 text-xs font-bold text-white bg-gradient-to-b from-[var(--admin-primary)] to-[var(--admin-hover)] border border-[var(--admin-hover)] rounded-admin shadow-sm hover:opacity-90 active:scale-[0.98] transition-all">Add</button>
                </div>
              </div>

              {/* Lead Details Card (Right Side) - 3 Columns */}
              <div className="lg:col-span-3 bg-white border border-slate-100 rounded-admin shadow-[0_2px_10px_rgba(0,0,0,0.06)] flex flex-col">
                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h3 className="text-base font-semibold text-slate-800">Lead Activity Feed</h3>
                  <div className="flex bg-slate-50 p-1 rounded-admin gap-1 self-start sm:self-auto border border-slate-100">
                    <button onClick={() => setFeedTab("recent")} className={`px-4 py-1.5 rounded-admin text-sm transition-all ${feedTab === 'recent' ? 'bg-white shadow-sm font-semibold text-admin-primary' : 'text-slate-500 hover:text-slate-700'}`}>Recent Leads</button>
                    <button onClick={() => setFeedTab("performance")} className={`px-4 py-1.5 rounded-admin text-sm transition-all ${feedTab === 'performance' ? 'bg-white shadow-sm font-semibold text-admin-primary' : 'text-slate-500 hover:text-slate-700'}`}>Performance</button>
                  </div>
                </div>

                <div className="flex-1 overflow-x-auto min-h-[400px]">
                  {feedTab === 'recent' ? (
                    <table className="w-full text-left border-collapse min-w-[500px]">
                      <tbody className="divide-y divide-slate-100">
                        {loading ? (
                          <tr>
                            <td className="px-6 py-12 text-center text-sm text-slate-400 font-medium">Loading activity...</td>
                          </tr>
                        ) : leads.length === 0 ? (
                          <tr>
                            <td className="px-6 py-12 text-center text-sm text-slate-400 font-medium">No records found</td>
                          </tr>
                        ) : (
                          leads.map((lead) => (
                            <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors group">
                              <td className="w-16 pl-6 py-4 text-center">
                                <div className="w-5 h-5 rounded border border-slate-300 group-hover:border-admin-primary transition-colors inline-block" />
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-center">
                                <div className="text-sm font-semibold text-slate-800">{new Date(lead.created_at).getHours()}</div>
                                <div className="text-xs text-slate-400 uppercase tracking-widest font-medium">Hour</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                 <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-admin-primary-light flex items-center justify-center text-admin-primary font-bold text-sm">
                                      {lead.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="text-sm font-semibold text-slate-800">{lead.name}</div>
                                 </div>
                              </td>
                              <td className="px-6 py-4 truncate">
                                 <div className="text-sm font-medium text-slate-700 mb-0.5">[{lead.id}] {lead.project}</div>
                                 <div className="text-xs text-slate-500 line-clamp-1">"{lead.intent}"</div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  ) : (
                    <div className="p-12 text-center space-y-4">
                      <div className="text-4xl font-black text-admin-primary">{leads.length}</div>
                      <div className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Total Conversion Points</div>
                      <div className="max-w-xs mx-auto h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[var(--admin-primary)] to-[var(--admin-hover)]" style={{ width: `${Math.min(leads.length * 5, 100)}%` }}></div>
                      </div>
                      <p className="text-xs text-slate-400">Activity performance based on lead volume across all active channels.</p>
                    </div>
                  )}
                </div>

                <div className="p-4 border-t border-slate-100 flex justify-center">
                   <button className="text-sm font-medium text-slate-500 hover:text-admin-primary transition-colors py-2">View Comprehensive Reports</button>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </main>
      <InvoiceModal 
        isOpen={isInvoiceModalOpen} 
        onClose={() => setIsInvoiceModalOpen(false)} 
        project={selectedProject} 
      />
    </div>
  );
};

export default AdminPage;
