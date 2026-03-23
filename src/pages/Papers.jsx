import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, ChevronRight, Plus, Sparkles, BookOpen, Trash2 } from 'lucide-react';
import { AbstractGauge } from '../components/floating/AbstractGauge';
import { motion } from 'framer-motion';

export default function Papers({ addToast }) {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const res = await api.get('/papers/');
        setPapers(res.data);
      } catch (err) {
        addToast('Failed to load papers', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchPapers();
  }, [addToast]);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!confirm('Are you absolutely sure you want to delete this manuscript? This will wipe all associated AI analysis and generated artifacts.')) return;
    try {
      addToast('Deleting manuscript...', 'info');
      await api.delete(`/papers/${id}`);
      setPapers(papers.filter(p => p.id !== id));
      addToast('Manuscript deleted successfully');
    } catch (err) {
      addToast('Failed to delete manuscript', 'error');
    }
  };

  return (
    <div className="container mx-auto px-6 py-12 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
        <div>
           <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full mb-4">
              <BookOpen className="w-3.5 h-3.5 text-primary" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Academic Archive v2.0</span>
           </motion.div>
           <h1 className="text-5xl md:text-6xl font-heading font-black text-slate-900 tracking-tight leading-tight text-center md:text-left">Research <br /><span className="text-slate-400">Portfolio</span></h1>
        </div>
        
        <Link to="/upload" className="btn-primary !px-10 !py-5 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-4 group shadow-xl shadow-primary/20">
          <Plus className="w-5 h-5" /> Initialize New Manuscript
        </Link>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 space-y-6">
           <div className="w-16 h-16 border-4 border-slate-100 border-t-primary rounded-full animate-spin" />
           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">Retrieving Secure Archives</p>
        </div>
      ) : papers.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="luxury-card p-20 text-center bg-slate-50/50 border-dashed border-2">
          <div className="w-24 h-24 bg-white rounded-[2rem] shadow-xl flex items-center justify-center mx-auto mb-10 border border-slate-100">
            <FileText className="w-12 h-12 text-slate-100" />
          </div>
          <h3 className="text-2xl font-heading font-black text-slate-900 mb-4">Archive Empty</h3>
          <p className="text-slate-500 mb-12 max-w-md mx-auto text-sm font-medium leading-relaxed">Begin your neural research journey by depositing your first manuscript draft.</p>
          <Link to="/upload" className="btn-primary inline-flex items-center gap-4 px-12 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl">
            <Plus className="w-5 h-5" /> Commencing Upload
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {papers.map((paper, i) => (
            <motion.div 
               initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: i * 0.05}}
               key={paper.id} 
               className="luxury-card p-8 flex flex-col sm:flex-row items-center gap-8 group cursor-pointer hover:border-primary/20 bg-white/50 backdrop-blur-xl"
               onClick={() => navigate(`/papers/${paper.id}`)}
            >
              <div className="w-24 h-24 rounded-2xl bg-[#0f0e17] border border-white/5 flex items-center justify-center shrink-0 shadow-2xl overflow-hidden relative group-hover:scale-105 transition-transform">
                 <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 opacity-50" />
                 {paper.abstract_quality_score ? (
                   <div className="scale-[0.85] pointer-events-none relative z-10"><AbstractGauge analysis={paper} /></div>
                 ) : (
                   <FileText className="w-10 h-10 text-white/20 relative z-10" />
                 )}
              </div>
              
              <div className="flex-1 text-center sm:text-left sm:pr-4">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-4">
                   <span className="text-[8px] font-black uppercase tracking-[0.2em] text-primary bg-primary/5 px-3 py-1.5 rounded-lg">{paper.domain}</span>
                   <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">ID: {paper.id.slice(0, 8)}</span>
                </div>
                <h3 className="text-xl font-heading font-black text-slate-900 mb-4 group-hover:text-primary transition-colors leading-tight">{paper.title}</h3>
                <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
                  {paper.ai_keywords?.slice(0, 3).map(kw => (
                    <span key={kw} className="bg-slate-50 border border-slate-100 text-slate-400 text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-row sm:flex-col items-center justify-end gap-4 shrink-0 h-full border-l border-slate-50 pl-8 hidden sm:flex pointer-events-auto">
                {!paper.abstract_quality_score && (
                   <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                )}
                <div onClick={(e) => handleDelete(e, paper.id)} className="p-3 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-red-100 shadow-sm" title="Delete Manuscript">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div className="p-4 bg-slate-50 text-slate-500 rounded-2xl group-hover:bg-[#0f0e17] group-hover:text-white group-hover:shadow-xl transition-all">
                  <ChevronRight className="w-6 h-6" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
