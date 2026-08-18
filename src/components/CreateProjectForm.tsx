import React, { useState } from 'react';
import { Save, Building, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Project } from '../types';
import { API_BASE_URL } from '@/lib/api';

interface CreateProjectFormProps {
  initialData?: Project;
  onSuccess: () => void;
  onCancel: () => void;
}

const CreateProjectForm = ({ initialData, onSuccess, onCancel }: CreateProjectFormProps) => {
  const [formData, setFormData] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    client_address: '',
    project_name: '',
    project_description: '',
    domain_url: '',
    domain_expiry_date: '',
    ssl_expiry_date: '',
    server_expiry_date: '',
    username: '',
    password: '',
    total_amount: ''
  });
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (initialData) {
      setFormData({
        client_name: initialData.client_name || '',
        client_email: initialData.client_email || '',
        client_phone: initialData.client_phone || '',
        client_address: initialData.client_address || '',
        project_name: initialData.project_name || '',
        project_description: initialData.project_description || '',
        domain_url: initialData.domain_url || '',
        domain_expiry_date: initialData.domain_expiry_date || '',
        ssl_expiry_date: initialData.ssl_expiry_date || '',
        server_expiry_date: initialData.server_expiry_date || '',
        username: initialData.username || '',
        password: initialData.password || '',
        total_amount: initialData.total_amount ? initialData.total_amount.toString() : ''
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.client_name || !formData.project_name) {
      toast.error('Client and Project Name are required.');
      return;
    }
    setLoading(true);
    try {
      const isEditing = !!initialData?.projectkey;
      const url = `${API_BASE_URL}/api_projects.php`;
      
      const payload = { 
        ...formData, 
        userkey: localStorage.getItem("adminUserkey") || "admin",
        ...(isEditing ? { projectkey: initialData.projectkey } : {})
      };

      const res = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        toast.success(isEditing ? "Project updated successfully!" : "Project created successfully!");
        onSuccess();
        if (!isEditing) {
            setFormData({ client_name: '', client_email: '', client_phone: '', client_address: '', project_name: '', project_description: '', domain_url: '', domain_expiry_date: '', ssl_expiry_date: '', server_expiry_date: '', username: '', password: '', total_amount: '' });
        }
      } else {
        toast.error(data.message || "Failed to process project");
      }
    } catch (e) {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white border border-slate-100 rounded-sm shadow-[0_2px_10px_rgba(0,0,0,0.06)] overflow-hidden">
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3">
            <button onClick={onCancel} className="p-2 text-slate-400 hover:text-slate-600 bg-white shadow-sm border border-slate-100 rounded-sm transition-colors">
                <ArrowLeft size={16} />
            </button>
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <Building size={20} className="text-[#F97316]" /> {initialData ? "Edit Project Details" : "Project Details"}
            </h3>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
        {/* Client Block */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">Client Name *</label>
            <input required type="text" value={formData.client_name} onChange={e => setFormData({...formData, client_name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-sm text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#F97316]/20 focus:border-[#F97316] transition-all" placeholder="e.g. Acme Corp" />
          </div>
          <div className="space-y-2">
             <label className="text-sm font-medium text-slate-600">Client Email</label>
             <input type="email" value={formData.client_email} onChange={e => setFormData({...formData, client_email: e.target.value})} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-sm text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#F97316]/20 focus:border-[#F97316] transition-all" placeholder="contact@acme.com" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">Client Phone</label>
            <input type="tel" value={formData.client_phone} onChange={e => setFormData({...formData, client_phone: e.target.value})} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-sm text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#F97316]/20 focus:border-[#F97316] transition-all" placeholder="+91 00000 00000" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">Client Address</label>
            <input type="text" value={formData.client_address} onChange={e => setFormData({...formData, client_address: e.target.value})} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-sm text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#F97316]/20 focus:border-[#F97316] transition-all" placeholder="City, Country" />
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Project Block */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">Project Name *</label>
            <input required type="text" value={formData.project_name} onChange={e => setFormData({...formData, project_name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-sm text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#F97316]/20 focus:border-[#F97316] transition-all" placeholder="Website Redesign" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">Total Amount (₹)</label>
            <input type="number" value={formData.total_amount} onChange={e => setFormData({...formData, total_amount: e.target.value})} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-sm text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#F97316]/20 focus:border-[#F97316] transition-all" placeholder="50000" />
          </div>
          <div className="md:col-span-2 space-y-2">
             <label className="text-sm font-medium text-slate-600">Project Description</label>
             <textarea value={formData.project_description} onChange={e => setFormData({...formData, project_description: e.target.value})} rows={2} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-sm text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#F97316]/20 focus:border-[#F97316] transition-all" placeholder="Brief module overview..." />
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Credentials & Technical Block */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">Admin Username</label>
            <input type="text" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-sm text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#F97316]/20 focus:border-[#F97316] transition-all" placeholder="admin" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">Admin Password</label>
            <input type="text" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-sm text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#F97316]/20 focus:border-[#F97316] transition-all" placeholder="Enter password (stored plain text)" />
          </div>
          
          <div className="space-y-2 mt-2 md:col-span-2">
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2">Domains & Server Expirations</h4>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">Domain URL</label>
            <input type="text" value={formData.domain_url} onChange={e => setFormData({...formData, domain_url: e.target.value})} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-sm text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#F97316]/20 focus:border-[#F97316] transition-all" placeholder="https://example.com" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">Domain Expiry Date</label>
            <input type="date" value={formData.domain_expiry_date} onChange={e => setFormData({...formData, domain_expiry_date: e.target.value})} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-sm text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#F97316]/20 focus:border-[#F97316] transition-all" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">Server Expiry Date</label>
            <input type="date" value={formData.server_expiry_date} onChange={e => setFormData({...formData, server_expiry_date: e.target.value})} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-sm text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#F97316]/20 focus:border-[#F97316] transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">SSL Expiry Date</label>
            <input type="date" value={formData.ssl_expiry_date} onChange={e => setFormData({...formData, ssl_expiry_date: e.target.value})} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-sm text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#F97316]/20 focus:border-[#F97316] transition-all" />
          </div>
        </div>

        <div className="pt-6 mt-6 flex justify-end gap-3 border-t border-slate-100">
          <button type="button" onClick={onCancel} className="px-5 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all rounded-sm shadow-[0_1px_2px_rgba(0,0,0,0.05)] active:scale-[0.98]">Cancel</button>
          <button type="submit" disabled={loading} className="relative inline-flex items-center gap-1.5 px-6 py-2 text-xs font-bold text-white bg-gradient-to-b from-[#F97316] to-[#EA580C] border border-[#ea580c] rounded-sm shadow-[0_1px_3px_rgba(249,115,22,0.3)] hover:shadow-[0_4px_10px_rgba(249,115,22,0.25)] hover:from-[#ea580c] hover:to-[#db4a0b] active:scale-[0.98] transition-all disabled:opacity-50">
            <Save size={14} /> {loading ? "Saving..." : "Save Project"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProjectForm;
