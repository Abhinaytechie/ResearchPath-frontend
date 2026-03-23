import { useState, useEffect } from 'react';
import api from '../api/axios';
import { StatusDropdown } from '../components/floating/StatusDropdown';
import { Clock, Send, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Submissions({ addToast }) {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/submissions/');
        setSubs(res.data);
      } catch (err) {
        addToast('Failed to load submissions', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [addToast]);

  return (
    <div className="container mx-auto px-6 py-12 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
        <div>
           <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full mb-4">
              <Target className="w-3.5 h-3.5 text-primary" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Strategic Outreach Core</span>
           </motion.div>
           <h1 className="text-5xl md:text-6xl font-heading font-black text-slate-900 tracking-tight leading-tight">Submission <br /><span className="text-slate-400">Tracker</span></h1>
        </div>
        
        <Link to="/journals" className="btn-primary !px-10 !py-5 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-4 group shadow-xl shadow-primary/20">
          <Send className="w-5 h-5" /> Initialize New Submission
        </Link>
      </div>

      <motion.div initial={{opacity:0, y:20}} animate={{opacity:1,y:0}} transition={{duration: 0.6}} className="luxury-card overflow-hidden bg-white/50 backdrop-blur-xl border-slate-100 shadow-2xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 space-y-6">
             <div className="w-16 h-16 border-4 border-slate-100 border-t-primary rounded-full animate-spin" />
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">Synchronizing Global Status</p>
          </div>
        ) : subs.length === 0 ? (
          <div className="p-20 text-center">
            <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-10 border border-slate-100 shadow-inner">
              <Clock className="w-12 h-12 text-slate-300" />
            </div>
            <h3 className="text-2xl font-heading font-black text-slate-900 mb-4">No Active Records</h3>
            <p className="text-slate-500 mb-12 max-w-md mx-auto text-sm font-medium leading-relaxed">Your submission history is currently clear. Deploy the explorer to identify target publication venues.</p>
            <Link to="/journals" className="btn-primary inline-flex items-center gap-4 px-12 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl">
              <Target className="w-5 h-5"/> Commence Discovery
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] uppercase text-slate-400 font-black tracking-[0.2em]">
                  <th className="p-8 pb-6 pl-12">Journal Identifier</th>
                  <th className="p-8 pb-6">Engagement Phase</th>
                  <th className="p-8 pb-6">Status Protocol</th>
                  <th className="p-8 pb-6 pr-12 text-right">External Portal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {subs.map((sub, i) => (
                  <motion.tr 
                    initial={{opacity:0, x: -10}} animate={{opacity:1, x:0}} transition={{delay: i * 0.05}}
                    key={sub.id} 
                    className="hover:bg-slate-50/50 transition-all group cursor-default"
                  >
                    <td className="p-8 pl-12">
                      <p className="font-heading font-black text-slate-900 text-lg group-hover:text-primary transition-colors leading-tight mb-1">{sub.journal_name}</p>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">SUB-ID: {sub.id.slice(0, 8)}</p>
                    </td>
                    <td className="p-8">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Submitted</p>
                       <p className="text-sm font-bold text-slate-700">{new Date(sub.submitted_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    </td>
                    <td className="p-8">
                      <div className="relative z-10 scale-95 origin-left">
                        <StatusDropdown 
                          submissionId={sub.id} 
                          currentStatus={sub.current_status} 
                          onStatusChange={(newStatus) => addToast(`Status protocol updated: ${newStatus}`)}
                        />
                      </div>
                    </td>
                    <td className="p-8 pr-12 text-right">
                      {sub.journal_url ? (
                        <a href={sub.journal_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 group/btn text-[9px] font-black uppercase tracking-[0.2em] text-primary hover:text-[#0f0e17] transition-all px-6 py-3 bg-primary/5 hover:bg-primary/10 rounded-xl border border-primary/10">
                          Track Progress <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                        </a>
                      ) : (
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest border border-slate-200 px-4 py-2 rounded-xl bg-slate-50/50">Manual Track Only</span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
