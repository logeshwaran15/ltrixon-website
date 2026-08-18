import React, { useState, useEffect, useCallback } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { Project } from '../types';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project; // Pre-fill context
}

const InvoiceModal = ({ isOpen, onClose, project }: InvoiceModalProps) => {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [projectName, setProjectName] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [invoiceNo] = useState(`INV-${Math.floor(1000 + Math.random() * 9000)}`);
  
  useEffect(() => {
    if (project) {
      setClientName(project.client_name || '');
      setClientEmail(project.client_email || '');
      setProjectName(project.project_name || '');
      setTotalAmount(project.total_amount ? project.total_amount.toString() : '');
    } else {
      setClientName('');
      setClientEmail('');
      setProjectName('');
      setTotalAmount('');
    }
  }, [project, isOpen]);

  const buildPdfDoc = useCallback(async (): Promise<jsPDF | null> => {
    return new Promise((resolve) => {
      const doc = new jsPDF();
      const primaryColor: [number, number, number] = [249, 115, 22]; // #F97316 (Orange)
      const blackColor: [number, number, number] = [30, 30, 30];
      const grayColor: [number, number, number] = [120, 120, 120];

      const drawContent = () => {
        // Draw the LTRIXON Logo natively matching the top nav bar (O is orange)
        doc.setFontSize(26);
        doc.setFont("helvetica", "bold");
        
        doc.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
        doc.text("LTRIX", 14, 21);
        
        const ltrixWidth = doc.getTextWidth("LTRIX");
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text("O", 14 + ltrixWidth, 21);
        
        const oWidth = doc.getTextWidth("O");
        doc.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
        doc.text("N", 14 + ltrixWidth + oWidth, 21);

        // Subheader contact info
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
        doc.text("ltrixon2026@gmail.com  |  +91 6369641717", 14, 27);

        // Top Right Header
        doc.setFontSize(20);
        doc.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
        doc.setFont("helvetica", "bold");
        doc.text("INVOICE", 150, 21);
        
        doc.setFontSize(10);
        doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
        doc.setFont("helvetica", "normal");
        doc.text(`Invoice No: ${invoiceNo}`, 150, 27);
        doc.text(`Date: ${new Date(invoiceDate).toLocaleDateString()}`, 150, 32);

        // Dashed Separator
        doc.setLineWidth(0.5);
        doc.setDrawColor(200, 200, 200);
        doc.setLineDashPattern([2, 2], 0);
        doc.line(14, 40, 196, 40);
        doc.setLineDashPattern([], 0); // Reset

        // Billed To
        doc.setFontSize(11);
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.setFont("helvetica", "bold");
        doc.text("BILLED TO:", 14, 52);
        
        doc.setFontSize(11);
        doc.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
        doc.text((clientName || 'CLIENT NAME DRAFT').toUpperCase(), 14, 59);
        
        doc.setFontSize(10);
        doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
        doc.setFont("helvetica", "normal");
        if (clientEmail) doc.text(clientEmail, 14, 65);

        // Item Header Dashed Line
        doc.setLineDashPattern([2, 2], 0);
        doc.line(14, 80, 196, 80);
        doc.setLineDashPattern([], 0);

        // Item Headers
        doc.setFontSize(9);
        doc.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
        doc.setFont("helvetica", "bold");
        doc.text("DESCRIPTION", 14, 86);
        doc.text("QTY", 125, 86);
        doc.text("PRICE", 145, 86);
        doc.text("TOTAL", 175, 86);

        // Item Bottom Dashed Line
        doc.setLineDashPattern([2, 2], 0);
        doc.line(14, 90, 196, 90);
        doc.setLineDashPattern([], 0);

        // Item Details
        doc.setFont("helvetica", "normal");
        doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
        
        const splitProjectName = doc.splitTextToSize(projectName || 'Software Services', 100);
        doc.text(splitProjectName, 14, 98);
        
        doc.text("1", 125, 98);
        doc.text(`INR ${totalAmount || '0'}`, 145, 98);
        doc.text(`INR ${totalAmount || '0'}`, 175, 98);

        const projectYOffset = 98 + (splitProjectName.length * 5);

        // Footer Dashed Line
        const bottomLineY = projectYOffset + 8;
        doc.setLineDashPattern([2, 2], 0);
        doc.line(14, bottomLineY, 196, bottomLineY);
        doc.setLineDashPattern([], 0);

        // Total Section
        doc.setFontSize(11);
        doc.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
        doc.setFont("helvetica", "bold");
        doc.text("TOTAL DUE:", 145, bottomLineY + 10);
        
        doc.setFontSize(12);
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text(`INR ${totalAmount || '0'}`, 175, bottomLineY + 10);

        // Double Dash bottom line
        doc.setLineDashPattern([2, 2], 0);
        doc.line(145, bottomLineY + 14, 196, bottomLineY + 14);
        doc.line(145, bottomLineY + 16, 196, bottomLineY + 16);
        doc.setLineDashPattern([], 0);

        // Signature Block
        doc.setFontSize(16);
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.setFont("times", "italic");
        doc.text("Logeshwaran", 160, 252);

        doc.setLineWidth(0.5);
        doc.setDrawColor(120, 120, 120);
        doc.line(145, 255, 196, 255);
        
        doc.setFontSize(9);
        doc.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
        doc.setFont("helvetica", "bold");
        doc.text("Authorized Signatory", 153, 260);

        // Footer Note
        doc.setFontSize(9);
        doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
        doc.setFont("helvetica", "italic");
        doc.text("Thank you for your business! This is a digitally generated invoice.", 14, 275);
        doc.text("Ltrixon | +91 6369641717 | ltrixon2026@gmail.com", 14, 281);

        resolve(doc);
      };

      drawContent(); // Synchronous generation
    });
  }, [clientEmail, clientName, invoiceDate, invoiceNo, projectName, totalAmount]);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (isOpen) {
        const doc = await buildPdfDoc();
        if (doc) {
          setPdfUrl(doc.output('bloburl').toString());
        }
      }
    }, 400); // Live preview debounce
    return () => clearTimeout(timeoutId);
  }, [clientName, projectName, totalAmount, invoiceDate, clientEmail, isOpen, buildPdfDoc]);

  const downloadPdf = async () => {
    if (!clientName || !projectName || !totalAmount) {
      toast.error("Please fill in basic details first");
      return;
    }
    const doc = await buildPdfDoc();
    if (doc) {
      doc.save(`Ltrixon_Invoice_${clientName.replace(/\s+/g, '_')}_${invoiceNo}.pdf`);
      toast.success("Invoice PDF Downloaded!");
      onClose();
    }
  };

  const shareViaWhatsApp = () => {
    if (!clientName || !projectName || !totalAmount) {
      toast.error("Please fill in basic details first");
      return;
    }
    const message = `*INVOICE DETAILS*%0A%0A*To:* ${clientName}%0A*Project:* ${projectName}%0A*Amount:* INR ${totalAmount}%0A*Date:* ${new Date(invoiceDate).toLocaleDateString()}%0A%0AThank you for your business!`;
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <React.Fragment>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-5xl max-h-[95vh] flex flex-col md:flex-row overflow-hidden bg-white rounded-sm shadow-2xl z-50 border border-slate-100"
          >
            {/* Left Box: Form */}
            <div className="w-full md:w-[380px] shrink-0 border-r border-slate-100 bg-white flex flex-col z-10 overflow-y-auto">
              <div className="flex items-center justify-between p-5 bg-slate-50/50 border-b border-slate-100 sticky top-0 z-20">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 uppercase tracking-wide">
                  <FileText size={18} className="text-[#F97316]" /> Generate Invoice
                </h3>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 p-1.5 rounded-sm transition-colors">
                  <X size={16} />
                </button>
              </div>
              
              <div className="p-6 space-y-4 flex-1">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Client Name</label>
                    <input type="text" value={clientName} onChange={e => setClientName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-[#F97316] transition-all" placeholder="e.g. John Doe" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Client Email</label>
                    <input type="email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-[#F97316] transition-all" placeholder="john@example.com" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Project Description</label>
                  <input type="text" value={projectName} onChange={e => setProjectName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-[#F97316] transition-all" placeholder="e.g. Website Development" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Amount (₹)</label>
                    <input type="number" value={totalAmount} onChange={e => setTotalAmount(e.target.value)} className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-[#F97316] transition-all" placeholder="50000" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Invoice Date</label>
                    <input type="date" value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-[#F97316] transition-all" />
                  </div>
                </div>

                <div className="pt-4 flex flex-col gap-3 border-t border-slate-100 mt-6 md:mt-8">
                  <button 
                    onClick={downloadPdf}
                    className="w-full flex justify-center items-center gap-2 bg-gradient-to-b from-[#F97316] to-[#EA580C] text-white py-2.5 rounded-sm font-bold text-xs hover:from-[#ea580c] hover:to-[#db4a0b] transition-all shadow-[0_2px_8px_rgba(249,115,22,0.3)] active:scale-[0.98]"
                  >
                    <Download size={16} /> Download Signed PDF
                  </button>
                  <button 
                    onClick={shareViaWhatsApp}
                    className="w-full flex justify-center items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white py-2.5 rounded-sm font-bold text-xs transition-colors shadow-[0_2px_8px_rgba(37,211,102,0.25)] active:scale-[0.98]"
                  >
                    Share WhatsApp
                  </button>
                </div>
              </div>
            </div>

            {/* Right Box: Live PDF Preview */}
            <div className="flex-1 bg-slate-100 overflow-hidden flex flex-col min-h-[400px] md:min-h-[550px] relative">
              <div className="absolute top-4 left-4 z-10 bg-black/60 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md">Live Preview</div>
              {pdfUrl ? (
                <iframe src={`${pdfUrl}#toolbar=0&navpanes=0`} className="w-full h-full border-none" title="Live Invoice Preview" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 animate-pulse">
                  <FileText size={48} className="mb-4 opacity-20" />
                  <p className="text-sm font-semibold">Generating Preview Engine...</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
};

export default InvoiceModal;
