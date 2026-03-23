import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { AbstractGauge } from '../components/floating/AbstractGauge';
import { FileText, ArrowLeft, Download, CheckCircle2, ChevronRight, PenTool, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PaperDetail({ addToast }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paper, setPaper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    const fetchPaper = async () => {
      try {
        const res = await api.get(`/papers/${id}`);
        setPaper(res.data);
      } catch (err) {
        addToast('Failed to load paper details', 'error');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPaper();
  }, [id, addToast]);

  const handleImprove = async () => {
    try {
      addToast('Improving abstract with Claude 3...', 'info');
      const res = await api.post(`/ai/improve-abstract?paper_id=${id}`);
      setPaper(prev => ({...prev, abstract: res.data.improved_abstract}));
      await api.put(`/papers/${id}`, { abstract: res.data.improved_abstract });
      addToast('Abstract improved and saved!');
    } catch (err) {
      addToast('Failed to improve abstract', 'error');
    }
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const res = await api.post(`/ai/analyze-paper?paper_id=${id}`);
      setPaper(prev => ({
        ...prev, 
        abstract_quality_score: res.data.abstract_quality_score,
        abstract_feedback: res.data.abstract_feedback,
        ai_keywords: res.data.extracted_keywords
      }));
      addToast('Analysis complete!');
    } catch (err) {
      addToast('AI analysis failed', 'error');
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) return <div className="p-20 text-center"><div className="w-10 h-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin mx-auto mb-4"></div><p className="text-slate-400 font-medium">Fetching manuscript details...</p></div>;
  if (!paper) return <div className="p-20 text-center text-slate-500 font-bold">Paper not found.</div>;

  const createdAt = paper.created_at ? new Date(paper.created_at).toLocaleDateString() : 'Unknown';

  return (
    <div className="container mx-auto px-6 py-12 max-w-7xl">
      <Link to="/papers" className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-primary mb-12 transition-all group">
        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> Research Library
      </Link>

      <div className="flex flex-col xl:flex-row gap-12 items-start">
        <div className="flex-1 w-full space-y-8">
          <motion.div initial={{opacity:0, y:20}} animate={{opacity:1,y:0}} className="luxury-card p-10 md:p-14 relative overflow-hidden bg-white/80 backdrop-blur-3xl">
            <div className="flex flex-wrap items-center gap-3 mb-12">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10">{paper.domain || 'General Research'}</span>
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5 border border-slate-200 px-3 py-1.5 rounded-lg">
                <FileText className="w-3 h-3" /> {createdAt}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-heading font-black text-slate-900 mb-12 leading-[1.2] tracking-tight">{paper.title}</h1>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-50">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Abstract Synthesis</h3>
                 <button onClick={handleImprove} className="text-[9px] font-black uppercase tracking-wider flex items-center gap-2 text-primary hover:bg-[#0f0e17] hover:text-white px-5 py-2.5 rounded-xl transition-all border border-primary/10 bg-primary/5">
                   <PenTool className="w-3.5 h-3.5" /> Optimize Version
                 </button>
              </div>
              <p className="text-slate-600 leading-[1.8] font-body text-base whitespace-pre-wrap">{paper.abstract || 'Document abstract pending submission.'}</p>
            </div>

            <div className="mt-16 pt-12 border-t border-slate-50">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mb-6">Taxonomy Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {paper.keywords?.map(kw => (
                  <span key={kw} className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border border-slate-100">
                    {kw}
                  </span>
                ))}
                
                {paper.ai_keywords?.length > 0 && (
                  <>
                    <div className="w-px h-6 bg-slate-100 mx-1 self-center"></div>
                    {paper.ai_keywords.map(kw => (
                      <span key={kw} className="bg-primary/5 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-sm">
                        {kw} ✨
                      </span>
                    ))}
                  </>
                )}
              </div>
            </div>

            {paper.file_url && (
              <div className="mt-12 p-6 bg-slate-50/80 backdrop-blur-xl rounded-3xl border border-slate-200 flex items-center justify-between group hover:shadow-2xl transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white border border-slate-100 text-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/5">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm mb-0.5">{paper.file_name || 'source_document.pdf'}</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Full Manuscript Source</p>
                  </div>
                </div>
                <button className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-primary transition-colors px-6 py-2 bg-white border border-slate-100 rounded-xl shadow-sm">
                  <Download className="w-4 h-4" /> Download
                </button>
              </div>
            )}
          </motion.div>
        </div>

        <div className="w-full xl:w-96 shrink-0 flex flex-col gap-8">
          {paper.abstract_quality_score ? (
            <motion.div initial={{opacity:0, x:20}} animate={{opacity:1,x:0}} className="luxury-card p-10 bg-white relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary animate-pulse"></div>
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mb-10 text-center">Neural Integrity Assessment</h3>
               
               <div className="flex flex-col items-center mb-10 scale-110">
                  <AbstractGauge analysis={paper} />
               </div>
               
               <div className="text-left pt-10 border-t border-slate-50">
                  <div className="flex items-center gap-2 mb-4">
                     <Sparkles className="w-3.5 h-3.5 text-primary" />
                     <h4 className="font-black text-[9px] text-slate-400 uppercase tracking-[0.2em]">Expert Feedback</h4>
                  </div>
                  <p className="text-[13px] text-slate-600 font-medium italic leading-relaxed bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    "{paper.abstract_feedback || "The manuscript demonstrates high technical clarity and logical progression."}"
                  </p>
               </div>
            </motion.div>
          ) : (
            <div className="luxury-card p-10 bg-slate-50/80 backdrop-blur-xl border-slate-200 text-center shadow-2xl">
               <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-primary/20">
                 <Sparkles className="text-primary w-8 h-8 animate-pulse"/>
               </div>
               <h3 className="font-heading font-black text-slate-900 text-lg mb-2">Metrics Pending</h3>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8 leading-relaxed">Execute neural scan to unlock quality scores and journal fitments.</p>
               <button 
                 onClick={() => navigate(`/papers/${paper.id}/analyse`)}
                 className="w-full py-4 bg-primary hover:bg-accent text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl transition-all"
               >
                 Analyse Paper — Check 10 Publication Criteria
               </button>
               <p className="text-[9px] text-slate-500 mt-6 font-bold uppercase tracking-[0.2em]">Powered by LangChain Hub</p>
            </div>
          )}

          <div className="bg-white rounded-[2rem] p-10 border border-slate-100 shadow-sm">
             <h3 className="font-heading font-black text-slate-900 border-b border-slate-50 pb-6 mb-8 text-base">Quick Actions</h3>
             <div className="space-y-4">
                <Link to="/templates" className="flex items-center justify-between p-5 bg-slate-50 hover:bg-white hover:shadow-xl rounded-2xl border border-slate-100 transition-all group">
                   <div>
                      <p className="text-slate-900 font-black text-[10px] uppercase tracking-widest">Latex Export</p>
                      <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest mt-1">Ready to publish</p>
                   </div>
                   <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
                </Link>
                <Link to="/journals" className="flex items-center justify-between p-5 bg-slate-50 hover:bg-white hover:shadow-xl rounded-2xl border border-slate-100 transition-all group">
                   <div>
                      <p className="text-slate-900 font-black text-[10px] uppercase tracking-widest">Journal Finder</p>
                      <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest mt-1">Match metrics</p>
                   </div>
                   <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
                </Link>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
