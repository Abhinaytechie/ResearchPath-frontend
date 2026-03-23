import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { KeywordAutocomplete } from '../components/floating/KeywordAutocomplete';
import { AiPanel } from '../components/floating/AiPanel';
import { UploadCloud, Sparkles, ArrowRight, CheckCircle2, Target } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Upload({ addToast }) {
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [domain, setDomain] = useState('Computer Science');
  const [keywords, setKeywords] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [paperId, setPaperId] = useState(null);
  
  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title || !abstract) return addToast('Title and abstract required', 'error');
    
    setLoading(true);
    try {
      const res = await api.post('/papers/', { title, abstract, domain, keywords });
      const pid = res.data.id;
      setPaperId(pid);
      
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        await api.post(`/papers/${pid}/upload-pdf`, formData);
      }
      
      addToast('Paper draft created successfully!');
    } catch (err) {
      addToast('Failed to create paper', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!paperId) return addToast('Please save the paper first', 'error');
    setAnalyzing(true);
    try {
      const res = await api.post(`/ai/analyze-paper?paper_id=${paperId}`);
      setAnalysis(res.data);
      if (res.data.extracted_keywords) {
         setKeywords([...new Set([...keywords, ...res.data.extracted_keywords])]);
      }
      setAiPanelOpen(true);
      addToast('Analysis complete!');
    } catch (err) {
      addToast('AI analysis failed', 'error');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12 flex flex-col items-center justify-center max-w-5xl">
      <div className="mb-16 text-center">
         <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 px-6 py-2 bg-primary/10 border border-primary/20 rounded-full shadow-lg mb-8">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Neural Submission Engine v2.0</span>
         </motion.div>
         <h1 className="text-5xl md:text-6xl font-heading font-black text-slate-900 tracking-tight leading-tight">Manuscript <br /><span className="text-slate-400">Processing Core</span></h1>
      </div>

      <motion.div 
        initial={{opacity:0, y:30}} 
        animate={{opacity:1, y:0}} 
        className="luxury-card p-10 md:p-16 w-full relative overflow-hidden bg-white/80 backdrop-blur-3xl"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary" />
        
        <form onSubmit={handleCreate} className="space-y-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
             <div className="md:col-span-12 space-y-4">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Research Title</label>
                <input 
                  type="text" 
                  className="ghost-input w-full !text-2xl font-heading font-black"
                  value={title} onChange={e => setTitle(e.target.value)} required 
                  placeholder="The impact of..."
                />
             </div>

             <div className="md:col-span-8 space-y-4">
                <div className="flex justify-between items-end ml-1">
                   <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Abstract Synthesis</label>
                   <span className="text-[10px] font-black text-primary bg-primary/5 px-3 py-1 rounded-lg uppercase tracking-widest">{abstract.split(' ').filter(x => x).length} Words Detected</span>
                </div>
                <textarea 
                  className="ghost-input w-full h-[320px] font-body leading-[1.8] text-base resize-none"
                  value={abstract} onChange={e => setAbstract(e.target.value)} required
                  placeholder="Enter your research summary for deep neural analysis..."
                />
             </div>

             <div className="md:col-span-4 space-y-8">
                <div className="space-y-4">
                   <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Academic Domain</label>
                   <select 
                     className="ghost-input w-full font-black text-xs uppercase tracking-widest cursor-pointer py-4"
                     value={domain} onChange={e => setDomain(e.target.value)}
                   >
                     <option>Computer Science</option>
                     <option>Mechanical Engineering</option>
                     <option>Electrical Engineering</option>
                     <option>Civil Engineering</option>
                     <option>Medical Sciences</option>
                     <option>Physics</option>
                     <option>Others</option>
                   </select>
                </div>

                <div className="space-y-4">
                   <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Topic Classification</label>
                   <KeywordAutocomplete keywords={keywords} setKeywords={setKeywords} />
                </div>

                <div className="space-y-4">
                   <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Manuscript Source</label>
                   <div className="relative group">
                      <input type="file" accept=".pdf,.doc,.docx" className="hidden" id="fileUpload" onChange={e => setFile(e.target.files[0])} />
                      <label htmlFor="fileUpload" className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-100/40 hover:bg-white hover:border-primary/40 transition-all cursor-pointer group-hover:shadow-2xl">
                         <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-primary mb-3 transition-colors" />
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-800 transition-colors">{file ? file.name : 'Choose File'}</span>
                      </label>
                   </div>
                </div>
             </div>
          </div>

          <div className="pt-10 flex flex-col md:flex-row items-center gap-8 justify-between border-t border-slate-100">
             {!paperId ? (
                <button type="submit" disabled={loading} className="w-full md:w-auto btn-primary !px-12 !py-6 text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 group">
                  {loading ? 'Initializing Interface...' : 'Commit to Database'} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
             ) : (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col md:flex-row gap-6 w-full items-center bg-slate-50/80 backdrop-blur-xl p-8 rounded-[2rem] border border-slate-200 shadow-2xl">
                   <div className="flex items-center gap-4 px-4 border-r border-slate-200 pr-10">
                      <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                         <CheckCircle2 className="w-6 h-6"/>
                      </div>
                      <div>
                         <p className="text-slate-900 font-black text-[10px] uppercase tracking-widest">Integrity Check Complete</p>
                         <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest">Draft Saved Successfully</p>
                      </div>
                   </div>
                   
                   <div className="flex flex-wrap gap-4 w-full justify-end mt-6 md:mt-0">
                     <button type="button" onClick={handleAnalyze} disabled={analyzing} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-500 hover:text-primary px-6 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all border border-slate-200 group shadow-sm">
                       <Sparkles className="w-4 h-4 text-primary group-hover:scale-125 transition-transform" /> {analyzing ? 'Processing...' : 'Abstract Analysis'}
                     </button>
                     <button type="button" onClick={() => navigate(`/papers/${paperId}/analyse`)} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 px-6 py-4 rounded-xl text-white font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-md group border border-slate-700">
                       <Target className="w-4 h-4 text-accent group-hover:scale-125 transition-transform" /> Full Paper Analysis
                     </button>
                     <button type="button" onClick={() => navigate('/dashboard')} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-primary hover:bg-accent px-8 py-4 rounded-xl text-white font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg shadow-primary/20 group">
                       Dashboard <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                     </button>
                   </div>
                </motion.div>
             )}
          </div>
        </form>
      </motion.div>

      <AiPanel isOpen={aiPanelOpen} analysis={analysis} onClose={() => setAiPanelOpen(false)} />
    </div>
  );
}
