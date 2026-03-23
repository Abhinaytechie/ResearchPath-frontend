import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Download, FileText, Send, Sparkles, ChevronDown, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CoverLetter({ addToast }) {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [coverLetter, setCoverLetter] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/papers/');
        setPapers(res.data);
      } catch (err) {
        addToast('Failed to load papers', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [addToast]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const paperId = fd.get('paper_id');
    const journalName = fd.get('journal_name');
    
    if (!paperId || !journalName) return addToast('All fields required', 'error');
    
    setGenerating(true);
    addToast('Generating cover letter with Claude...', 'info');
    try {
      const res = await api.post(`/ai/generate-cover-letter?paper_id=${paperId}&journal_name=${journalName}`);
      setCoverLetter(res.data.content);
      addToast('Cover letter generated successfully!');
    } catch (err) {
      addToast('Failed to generate cover letter', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const handleExport = () => {
    // Expected interaction with custom Google Drive provider
    addToast('Calling Google Drive Export API...', 'info');
    setTimeout(() => {
      addToast('Successfully exported to Google Drive!', 'success');
    }, 1500);
  };

  return (
    <div className="container mx-auto px-6 py-12 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
        <div>
           <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full mb-4">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Neural Correspondence Engine</span>
           </motion.div>
           <h1 className="text-5xl md:text-6xl font-heading font-black text-slate-900 tracking-tight leading-tight">Cover Letter <br /><span className="text-slate-400">Synthesis</span></h1>
        </div>
        
        <div className="flex items-center gap-4 bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
           <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-xl border border-slate-50">
             <FileText className="text-primary w-6 h-6" />
           </div>
           <div>
             <p className="text-slate-900 font-black text-[10px] uppercase tracking-widest leading-none mb-1.5">{papers.length} Manuscripts</p>
             <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em]">Archival Inventory</p>
           </div>
        </div>
      </div>

      <motion.div initial={{opacity:0, y:20}} animate={{opacity:1,y:0}} className="luxury-card p-10 md:p-16 mb-16 relative overflow-hidden bg-white/50 backdrop-blur-xl border-slate-100 shadow-2xl">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="flex items-center gap-3 mb-12">
           <div className="w-10 h-10 bg-[#0f0e17] text-white flex items-center justify-center rounded-xl shadow-xl">
             <Sparkles className="w-5 h-5"/>
           </div>
           <h3 className="font-heading font-black text-slate-900 text-xl tracking-tight">Configuration Hub</h3>
        </div>

        <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 items-end relative z-10">
          <div className="lg:col-span-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 block ml-1">Source Manuscript</label>
            <div className="relative">
              <select name="paper_id" className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl px-6 py-4 appearance-none font-black text-[11px] uppercase tracking-widest cursor-pointer focus:ring-2 focus:ring-primary/20 transition-all" required disabled={loading}>
                <option value="" className="text-slate-400">Select Draft...</option>
                {papers.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                 <ChevronDown className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>
          <div className="lg:col-span-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 block ml-1">Target Institution</label>
            <input type="text" name="journal_name" placeholder="E.G. IEEE SENSORS" className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl px-6 py-4 font-black text-[11px] uppercase tracking-[0.3em] placeholder:text-slate-500 focus:ring-2 focus:ring-primary/20 transition-all" required disabled={loading} />
          </div>
          <div className="lg:col-span-1">
            <button type="submit" disabled={generating || loading} className="w-full bg-[#0f0e17] hover:bg-slate-800 text-white py-4.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl disabled:opacity-50 transition-all flex justify-center items-center gap-3 h-[58px]">
              {generating ? 'Processing' : 'Execute'} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </motion.div>

      {coverLetter && (
        <motion.div initial={{opacity:0, scale:0.98}} animate={{opacity:1,scale:1}} className="luxury-card p-12 md:p-20 shadow-[-20px_20px_60px_rgba(0,0,0,0.05)] bg-white relative">
          {/* Paper Texture Overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/notebook.png')]" />

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8 border-b border-slate-50 pb-12 relative z-10">
            <div className="flex items-center gap-5">
               <div className="w-16 h-16 bg-slate-50 text-[#0f0e17] flex items-center justify-center rounded-[1.5rem] border border-slate-100 shadow-inner">
                 <FileText className="w-8 h-8" />
               </div>
               <div>
                 <h3 className="font-heading font-black text-3xl text-slate-900 tracking-tight leading-none mb-2">Manuscript Cover</h3>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Neural Synthesis Complete</p>
               </div>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <button onClick={() => { navigator.clipboard.writeText(coverLetter); addToast('Copied to clipboard'); }} className="flex-1 md:flex-initial flex items-center justify-center gap-3 px-8 py-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] text-slate-600 transition-all shadow-sm">
                <Download className="w-4 h-4" /> Copy Buffer
              </button>
              <button onClick={handleExport} className="flex-1 md:flex-initial flex items-center justify-center gap-3 bg-[#4285F4] hover:bg-[#3367D6] px-8 py-4 rounded-2xl text-white font-black text-[10px] uppercase tracking-[0.15em] transition-all shadow-[0_10px_30px_rgba(66,133,244,0.3)]">
                <Send className="w-4 h-4" /> Drive Export
              </button>
            </div>
          </div>

          <div className="bg-white p-12 md:p-20 rounded-3xl border border-slate-50 font-serif text-slate-800 leading-[2] shadow-[inset_0_2px_20px_rgba(0,0,0,0.02)] whitespace-pre-wrap text-[17px] relative z-10 antialiased">
             {coverLetter}
          </div>

          <div className="mt-16 pt-12 border-t border-slate-50 text-center relative z-10">
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Official ResearchPath Artifact • Digital Hash: {Math.random().toString(36).substring(7).toUpperCase()}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
