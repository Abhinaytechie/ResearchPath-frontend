import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  FileText, 
  CheckCircle2, 
  ChevronRight, 
  Layout, 
  Activity, 
  Sparkles,
  ArrowUpRight,
  ArrowRight
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { StatusDropdown } from '../components/floating/StatusDropdown';

export default function Dashboard({ addToast }) {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({ papers: 0, submitted: 0, accepted: 0 });
  const [recentSubs, setRecentSubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [papersRes, subsRes] = await Promise.all([
          api.get('/papers/'),
          api.get('/submissions/')
        ]);
        
        const papers = papersRes.data;
        const subs = subsRes.data;
        
        setStats({
          papers: papers.length,
          submitted: subs.length,
          accepted: subs.filter(s => s.current_status === 'accepted').length
        });
        
        setRecentSubs(subs.slice(0, 3));
      } catch (err) {
        addToast('Failed to load dashboard data', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [addToast]);

  return (
    <div className="container mx-auto px-6 py-12 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <div>
           <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                 <Layout className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Research Control Center</span>
           </motion.div>
           <h1 className="text-4xl md:text-5xl font-heading font-black text-slate-900 tracking-tight">Welcome, <br /><span className="text-slate-400">{currentUser.displayName?.split(' ')[0] || 'Researcher'}</span></h1>
        </div>
        
        <Link to="/upload" className="btn-primary !px-10 !py-5 !rounded-2xl text-sm group">
           Submit New Manuscript <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
         {[
           { label: 'Total Manuscripts', value: stats.papers, color: 'bg-primary/10 text-primary', icon: <FileText /> },
           { label: 'Active Submissions', value: stats.submitted, color: 'bg-blue-500/10 text-blue-500', icon: <Activity /> },
           { label: 'Accepted Works', value: stats.accepted, color: 'bg-emerald-500/10 text-emerald-500', icon: <CheckCircle2 /> },
         ].map((s, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={s.label}
              className="luxury-card p-8 group cursor-default"
            >
               <div className="flex items-start justify-between mb-8">
                  <div className={`p-4 rounded-2xl ${s.color} group-hover:scale-110 transition-transform`}>
                     {s.icon}
                  </div>
                  <Sparkles className="w-5 h-5 text-slate-100 group-hover:text-primary/20 transition-colors" />
               </div>
               <p className="text-4xl font-heading font-black text-slate-900 mb-1">{s.value}</p>
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{s.label}</p>
            </motion.div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         <div className="lg:col-span-8 space-y-8">
            <div className="flex items-center justify-between">
               <h3 className="text-xl font-heading font-black text-slate-800 flex items-center gap-3">
                  <Activity className="text-primary w-5 h-5" /> Submission Tracker
               </h3>
               <Link to="/papers" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-primary transition-colors flex items-center gap-1.5 grayscale hover:grayscale-0">
                  Full Archive <ChevronRight className="w-3.5 h-3.5" />
               </Link>
            </div>

            <div className="space-y-4">
               {loading ? (
                  [1,2].map(i => <div key={i} className="h-28 bg-white/50 animate-pulse rounded-3xl" />)
               ) : recentSubs.length > 0 ? (
                  recentSubs.map((sub, i) => (
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      key={sub.id} 
                      className="luxury-card p-6 flex flex-col sm:flex-row items-center justify-between group hover:border-primary/30"
                    >
                       <div className="flex items-center gap-5">
                          <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-primary/5 group-hover:text-primary transition-all">
                             <Activity className="w-6 h-6" />
                          </div>
                          <div>
                             <h4 className="font-bold text-slate-800 text-lg group-hover:text-primary transition-colors line-clamp-1 max-w-md">{sub.journal_name}</h4>
                             <div className="flex items-center gap-3 mt-1">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{new Date(sub.submitted_at).toLocaleDateString()}</span>
                                <div className="w-1 h-1 rounded-full bg-slate-200" />
                                <StatusDropdown 
                                  submissionId={sub.id} 
                                  currentStatus={sub.current_status} 
                                  onStatusChange={(newStatus) => addToast(`Status updated to ${newStatus}`)}
                                />
                             </div>
                          </div>
                       </div>
                       {sub.journal_url && (
                         <a href={sub.journal_url} target="_blank" rel="noreferrer" className="p-3 rounded-xl bg-slate-50 text-slate-400 hover:bg-primary hover:text-white transition-all opacity-0 group-hover:opacity-100 hidden sm:block">
                            <ArrowUpRight className="w-5 h-5" />
                         </a>
                       )}
                    </motion.div>
                  ))
               ) : (
                  <div className="p-16 text-center luxury-card border-dashed bg-slate-50/50">
                     <p className="text-slate-400 font-medium mb-6">No active submissions found.</p>
                     <Link to="/journals" className="font-black text-[10px] uppercase tracking-[0.2em] text-primary hover:gap-4 transition-all flex items-center justify-center gap-2">
                        Discover target journals <ArrowRight className="w-4 h-4" />
                     </Link>
                  </div>
               )}
            </div>
         </div>

         <div className="lg:col-span-4">
            <div className="glass-floating p-10 bg-slate-50/60 backdrop-blur-xl border-white text-slate-900 overflow-hidden relative group rounded-[2.5rem] shadow-2xl">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] rounded-full group-hover:scale-150 transition-transform duration-700" />
               <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-8 border border-slate-200 shadow-sm">
                  <Sparkles className="text-primary w-6 h-6 animate-pulse" />
               </div>
               <h3 className="text-2xl font-heading font-black mb-4 relative z-10 text-slate-900">AI Integrity <br />Check</h3>
               <p className="text-slate-500 text-sm font-medium mb-10 leading-relaxed relative z-10">Our neural engine analyzes your manuscript against 40+ quality metrics to ensure publication readiness.</p>
               <Link to="/upload" className="w-full py-4 bg-white hover:bg-primary hover:text-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all relative z-10 flex items-center justify-center gap-2 text-primary shadow-sm hover:shadow-xl">
                  Launch Engine <ArrowUpRight className="w-4 h-4" />
               </Link>
            </div>
         </div>
      </div>
    </div>
  );
}
