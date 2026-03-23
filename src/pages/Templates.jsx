import { useState, useEffect } from 'react';
import api from '../api/axios';
import { LatexNavigator } from '../components/floating/LatexNavigator';
import { Download, ExternalLink, Code,Sparkles,CheckCircle2, Trash2} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Templates({ addToast }) {
  const [templates, setTemplates] = useState([]);
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [activeSection, setActiveSection] = useState('preamble');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tempRes, paperRes] = await Promise.all([
          api.get('/templates/'),
          api.get('/papers/')
        ]);
        setTemplates(tempRes.data);
        setPapers(paperRes.data);
        if (tempRes.data.length > 0) setActiveTemplate(tempRes.data[0]);
      } catch (err) {
        addToast('Failed to load templates', 'error');
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
    const formatType = fd.get('format_type');
    const journalName = fd.get('journal_name');
    
    if (!paperId || !formatType || !journalName) return addToast('All fields required', 'error');
    
    setLoading(true);
    addToast('Generating LaTeX template...', 'info');
    try {
      const res = await api.post(`/ai/generate-template?paper_id=${paperId}&format_type=${formatType}&journal_name=${journalName}`);
      
      const newTempRes = await api.get('/templates/');
      setTemplates(newTempRes.data);
      setActiveTemplate(newTempRes.data[0]);
      addToast('Template generated successfully!');
    } catch (err) {
      addToast('Failed to generate template', 'error');
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = async (id) => {
    try {
      addToast('Preparing download...', 'info');
      const response = await api.get(`/templates/${id}/download`, {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `template_${id}.tex`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      addToast('Download started');
    } catch (err) {
      addToast('Download failed. Please try again.', 'error');
    }
  };

  const handleCopy = () => {
    if (activeTemplate) {
      navigator.clipboard.writeText(activeTemplate.latex_code);
      addToast('LaTeX code copied to clipboard!');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this LaTeX artifact?')) return;
    try {
      addToast('Deleting template...', 'info');
      await api.delete(`/templates/${id}`);
      const updated = templates.filter(t => t.id !== id);
      setTemplates(updated);
      setActiveTemplate(updated.length > 0 ? updated[0] : null);
      addToast('Template deleted');
    } catch (err) {
      addToast('Failed to delete template', 'error');
    }
  };

  return (
    <div className="container mx-auto px-6 py-12 flex flex-col xl:flex-row gap-12 max-w-7xl">
      {/* Sidebar Navigator - Only shown when a template is active */}
      {activeTemplate && <LatexNavigator activeSection={activeSection} onNavigate={setActiveSection} />}

      <div className={`flex-1 transition-all duration-500`}>
        <div className="mb-14">
           <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 text-primary flex items-center justify-center shadow-lg">
                 <Code className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Manuscript Formatting Core</span>
           </motion.div>
           <h1 className="text-4xl md:text-5xl font-heading font-black text-slate-800 tracking-tight leading-tight">LaTeX Lab <br /><span className="text-slate-400">& Production</span></h1>
        </div>

        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1,y:0}} className="luxury-card p-8 md:p-12 mb-16 relative overflow-hidden bg-white/90 backdrop-blur-3xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary" />
          <h3 className="font-heading font-black text-xs uppercase tracking-[0.2em] text-slate-400 mb-8 flex items-center gap-2">
            <Sparkles className="text-primary w-4 h-4 animate-pulse"/> Configure New Build
          </h3>
          <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end relative z-10">
            <div className="md:col-span-3 space-y-2.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Research Source</label>
              <select name="paper_id" className="ghost-input w-full font-bold text-sm cursor-pointer" required>
                <option value="">Select Paper...</option>
                {papers.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
            </div>
            <div className="md:col-span-3 space-y-2.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Publisher Style</label>
              <select name="format_type" className="ghost-input w-full font-bold text-sm cursor-pointer" required>
                <option value="IEEE">IEEE Transactions</option>
                <option value="Elsevier">Elsevier (elsarticle)</option>
                <option value="Springer">Springer (llncs)</option>
                <option value="APA">APA 7th Edition</option>
              </select>
            </div>
            <div className="md:col-span-3 space-y-2.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Target Journal</label>
              <input type="text" name="journal_name" placeholder="e.g. IEEE Access" className="ghost-input w-full font-bold text-sm" required />
            </div>
            <div className="md:col-span-3">
              <button type="submit" disabled={loading} className="w-full btn-primary !rounded-2xl !py-4 text-[10px] font-black uppercase tracking-[0.2em]">
                {loading ? 'Synthesizing...' : 'Generate Format'}
              </button>
            </div>
          </form>
        </motion.div>

        {templates.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-4 space-y-4">
              <h4 className="font-heading font-black text-[10px] text-slate-600 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                 Stored Artifacts <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-400">{templates.length}</span>
              </h4>
              {templates.map((t, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={t.id} 
                  onClick={() => setActiveTemplate(t)}
                  className={`p-6 rounded-[1.5rem] cursor-pointer transition-all duration-500 border group ${activeTemplate?.id === t.id ? 'bg-primary/5 border-primary/20 shadow-xl' : 'bg-white border-slate-100 hover:border-primary/20 shadow-sm'}`}
                >
                  <p className={`font-bold text-base mb-1.5 line-clamp-1 ${activeTemplate?.id === t.id ? 'text-primary' : 'text-slate-800'}`}>{t.journal_name}</p>
                  <div className="flex items-center gap-3">
                     <span className={`text-[9px] font-black uppercase tracking-widest ${activeTemplate?.id === t.id ? 'text-primary' : 'text-primary'}`}>{t.format_type}</span>
                     <div className={`w-1 h-1 rounded-full ${activeTemplate?.id === t.id ? 'bg-primary/30' : 'bg-slate-200'}`} />
                     <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{new Date(t.created_at).toLocaleDateString()}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="lg:col-span-8">
              {activeTemplate ? (
                <motion.div 
                   key={activeTemplate.id}
                   initial={{opacity: 0, scale: 0.98}} animate={{opacity: 1, scale: 1}}
                   className="glass-floating bg-white/95 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden flex flex-col h-[750px] shadow-2xl border-white"
                >
                  <div className="px-8 py-6 flex flex-col sm:flex-row gap-6 sm:justify-between sm:items-center bg-white/50 border-b border-slate-100">
                     <div>
                       <h3 className="font-heading font-black text-lg text-slate-900">{activeTemplate.journal_name}</h3>
                       <p className="text-[10px] text-emerald-500 font-black uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3" /> Compiled & Ready
                       </p>
                     </div>
                     <div className="flex gap-4">
                       <button onClick={() => downloadFile(activeTemplate.id)} className="p-3 bg-white hover:bg-slate-50 rounded-xl text-slate-400 hover:text-primary transition-all border border-slate-100 shadow-sm" title="Export .tex">
                         <Download className="w-5 h-5" />
                       </button>
                       <button onClick={handleCopy} className="flex items-center gap-3 bg-slate-800 hover:bg-slate-900 px-6 py-3 rounded-xl text-white font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-slate-800/20">
                         <Code className="w-4 h-4" /> Copy Code
                       </button>
                       <button onClick={() => handleDelete(activeTemplate.id)} className="p-3 bg-white hover:bg-red-50 rounded-xl text-slate-400 hover:text-red-500 transition-all border border-slate-100 shadow-sm" title="Delete Artifact">
                         <Trash2 className="w-5 h-5" />
                       </button>
                     </div>
                  </div>
                  <div className="flex-1 bg-slate-50 p-8 overflow-auto font-mono text-xs leading-[1.8] relative scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent flex flex-col">
                     <div className="bg-blue-50/80 border border-blue-100 p-5 rounded-2xl mb-6 shadow-sm flex items-start gap-4">
                        <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                           <h4 className="font-bold text-blue-900 text-sm mb-2">How to compile in Overleaf</h4>
                           <ol className="text-xs text-blue-800 space-y-1.5 list-decimal ml-4 font-medium">
                              <li>Click <strong>Copy Code</strong> or download the <code className="bg-blue-100 px-1.5 py-0.5 rounded">.tex</code> file.</li>
                              <li>Go to <a href="https://www.overleaf.com" target="_blank" rel="noreferrer" className="underline text-blue-600 hover:text-blue-900 font-bold">Overleaf</a> and create a <strong>New Blank Project</strong>.</li>
                              <li>Paste this code completely replacing any existing code in <code className="bg-blue-100 px-1.5 py-0.5 font-mono rounded">main.tex</code>.</li>
                              <li>Click <strong>Recompile</strong> to view your fully formatted manuscript layout!</li>
                           </ol>
                        </div>
                     </div>
                     <pre className="relative z-10 flex-1">
                        <code className="text-slate-600 block">
                          {activeTemplate.latex_code}
                        </code>
                     </pre>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full min-h-[500px] flex flex-col items-center justify-center p-12 text-slate-600 luxury-card bg-slate-50/50 border-dashed border-2">
                  <div className="w-16 h-16 rounded-3xl bg-white shadow-sm flex items-center justify-center mb-6">
                     <Code className="text-slate-100 w-8 h-8" />
                  </div>
                  <p className="font-black text-[10px] uppercase tracking-[0.3em]">Select Artifact for Preview</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
