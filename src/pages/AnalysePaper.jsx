import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { jsPDF } from 'jspdf';
import { motion, AnimatePresence } from 'framer-motion';
import { useFloating, useHover, useInteractions, offset, shift, arrow, FloatingPortal } from '@floating-ui/react';
import { 
  ArrowLeft, Download, Search, FileText, Sparkles, BookOpen, 
  FlaskConical, BarChart2, MessageSquare, Layout, Shield, Link as LinkIcon, 
  Target, CheckCircle, AlertTriangle, ChevronDown, ChevronUp, Lightbulb, RefreshCw
} from 'lucide-react';

const constraintIcons = {
  novelty: Sparkles,
  abstract_quality: FileText,
  literature_review: BookOpen,
  methodology: FlaskConical,
  results_analysis: BarChart2,
  language_clarity: MessageSquare,
  structure_formatting: Layout,
  ethical_compliance: Shield,
  references_quality: LinkIcon,
  conclusion_impact: Target
};

const verdictColors = {
  'Strong': 'bg-green-100 text-green-800 border-green-200',
  'Acceptable': 'bg-blue-100 text-blue-800 border-blue-200',
  'Weak': 'bg-amber-100 text-amber-800 border-amber-200',
  'Critical Issue': 'bg-red-100 text-red-800 border-red-200'
};

const barColors = {
  'Strong': 'bg-green-500',
  'Acceptable': 'bg-blue-500',
  'Weak': 'bg-amber-500',
  'Critical Issue': 'bg-red-500'
};

function ScoreTooltip({ children, score }) {
  const [isOpen, setIsOpen] = useState(false);
  const arrowRef = useRef(null);
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'top',
    middleware: [offset(10), shift({ padding: 8 }), arrow({ element: arrowRef })]
  });

  const hover = useHover(context, { delay: 100 });
  const { getReferenceProps, getFloatingProps } = useInteractions([hover]);

  let hoverText = "Standard score segment.";
  if (score >= 9) hoverText = "Excellent. Ready for Q1/Q2.";
  else if (score >= 7) hoverText = "Good. Needs minor polish.";
  else if (score >= 5) hoverText = "Weak. High risk of major revision.";
  else hoverText = "Critical flaw. Likely desk rejection.";

  return (
    <>
      <div ref={refs.setReference} {...getReferenceProps()} className="cursor-help">
        {children}
      </div>
      <AnimatePresence>
        {isOpen && (
          <FloatingPortal>
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              ref={refs.setFloating}
              style={{...floatingStyles, zIndex: 60}}
              {...getFloatingProps()}
              className="bg-slate-900 text-white text-xs px-3 py-2 rounded-lg shadow-xl"
            >
              {hoverText}
              <div ref={arrowRef} className="absolute w-2 h-2 bg-slate-900 transform rotate-45 -bottom-1" style={{ left: context.middlewareData.arrow?.x ?? 0 }} />
            </motion.div>
          </FloatingPortal>
        )}
      </AnimatePresence>
    </>
  );
}

function ConstraintCard({ check }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = constraintIcons[check.id] || Sparkles;

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
            <Icon className="w-5 h-5 text-slate-600" />
          </div>
          <h3 className="font-bold text-slate-900 leading-tight">{check.title}</h3>
        </div>
        <ScoreTooltip score={check.score}>
          <div className="flex flex-col items-end">
            <span className="font-black text-xl text-slate-900">{check.score}<span className="text-sm text-slate-400">/10</span></span>
          </div>
        </ScoreTooltip>
      </div>

      <div className="w-full h-1.5 bg-slate-100 rounded-full mb-4 overflow-hidden">
        <div className={`h-full ${barColors[check.verdict] || 'bg-slate-500'} transition-all`} style={{ width: `${(check.score / 10) * 100}%` }}></div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border ${verdictColors[check.verdict] || 'bg-slate-100 text-slate-600'}`}>
          {check.verdict}
        </span>
      </div>

      <p className="text-sm text-slate-600 font-medium leading-relaxed mb-6">{check.summary}</p>

      <div className="mt-auto">
        <button 
          onClick={() => setExpanded(!expanded)} 
          className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest hover:text-accent transition-colors w-full justify-between"
        >
          {expanded ? 'Hide Details' : 'See Detailed Feedback'}
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} 
              animate={{ height: 'auto', opacity: 1 }} 
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mt-4"
            >
              <div className="pt-4 border-t border-slate-100">
                <p className="text-sm text-slate-600 mb-4 leading-relaxed whitespace-pre-wrap">{check.feedback}</p>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-black uppercase tracking-widest text-amber-800">How to Fix</span>
                  </div>
                  <p className="text-sm text-amber-900 font-medium leading-relaxed">{check.how_to_fix}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function AnalysePaper({ addToast }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [paper, setPaper] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    fetchPaperAndAnalysis();
  }, [id]);

  const fetchPaperAndAnalysis = async () => {
    try {
      const pRes = await api.get(`/papers/${id}`);
      setPaper(pRes.data);
      try {
        const aRes = await api.get(`/analysis/${id}`);
        if (aRes.data && aRes.data.analysis) {
          setAnalysis(aRes.data.analysis);
        }
      } catch (err) {
        // 404 means no analysis exists yet
      }
    } catch (err) {
      addToast('Failed to load paper details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyse = async () => {
    setAnalyzing(true);
    try {
      const res = await api.post(`/analysis/analyse`, { paper_id: id });
      setAnalysis(res.data.analysis);
      addToast('Analysis generated successfully!');
    } catch (err) {
      addToast(err.response?.data?.detail || 'Failed to analyze paper', 'error');
    } finally {
      setAnalyzing(false);
    }
  };

  const generatePDF = () => {
    if (!analysis) return;
    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Paper Analysis Report", 20, y);
    y += 15;

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Overall Score: ${analysis.overall_score}/100`, 20, y);
    y += 8;
    doc.text(`Readiness: ${analysis.publication_readiness}`, 20, y);
    y += 15;

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`One-Line Summary`, 20, y);
    y += 8;
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    const summaryLines = doc.splitTextToSize(analysis.one_line_summary, 170);
    doc.text(summaryLines, 20, y);
    y += (summaryLines.length * 6) + 10;

    analysis.checks.forEach(check => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`${check.title} (Score: ${check.score}/10 - ${check.verdict})`, 20, y);
      y += 8;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const fbLines = doc.splitTextToSize(check.feedback, 170);
      doc.text(fbLines, 20, y);
      y += (fbLines.length * 5) + 5;

      doc.setFont("helvetica", "bold");
      doc.text("How to fix:", 20, y);
      y += 5;
      doc.setFont("helvetica", "normal");
      const fixLines = doc.splitTextToSize(check.how_to_fix, 170);
      doc.text(fixLines, 20, y);
      y += (fixLines.length * 5) + 10;
    });

    doc.save(`Paper_Analysis_${id.substring(0,6)}.pdf`);
    addToast('Report downloaded');
  };

  if (loading) return <div className="p-20 text-center"><div className="w-10 h-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin mx-auto mb-4"></div><p className="text-slate-400 font-medium">Checking records...</p></div>;
  if (!paper) return <div className="p-20 text-center text-slate-500 font-bold">Paper not found.</div>;

  if (!analysis) {
    return (
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <Link to={`/papers/${id}`} className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-primary mb-12 transition-all">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Paper
        </Link>
        <div className="luxury-card p-12 bg-white text-center">
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-primary/20">
            <Sparkles className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-heading font-black text-slate-900 mb-6">Publication Readiness Scan</h1>
          <p className="text-slate-500 font-medium mb-10 max-w-2xl mx-auto leading-relaxed">
            We will analyze your manuscript against 10 strict publication criteria used by Q1 journal editors. This includes checking novelty, methodology reproducibility, literature depth, and structural integrity.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12 text-left">
             {Object.keys(constraintIcons).map(key => {
               const Icon = constraintIcons[key];
               return (
                 <div key={key} className="p-3 bg-slate-50 rounded-xl flex flex-col items-center justify-center text-center border border-slate-100">
                   <Icon className="w-6 h-6 text-slate-400 mb-2" />
                   <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{key.replace('_', ' ')}</span>
                 </div>
               )
             })}
          </div>

          <button 
            onClick={handleAnalyse}
            disabled={analyzing}
            className="btn-primary !px-12 !py-6 w-full md:w-auto shadow-2xl disabled:opacity-50 inline-flex items-center justify-center gap-3"
          >
            {analyzing ? (
              <><RefreshCw className="w-5 h-5 animate-spin" /> Scanning Manuscript...</>
            ) : (
              <><Sparkles className="w-5 h-5" /> Analyse Now</>
            )}
          </button>
        </div>
      </div>
    );
  }

  const ringColor = analysis.overall_score >= 75 ? 'text-green-500' : analysis.overall_score >= 50 ? 'text-amber-500' : 'text-red-500';

  return (
    <div className="container mx-auto px-6 py-12 max-w-7xl">
      <Link to={`/papers/${id}`} className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-primary mb-8 transition-all">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Paper
      </Link>

      {/* Top Summary Card */}
      <div className="luxury-card p-8 md:p-12 mb-12 bg-white flex flex-col md:flex-row gap-12 items-center md:items-start border-2 border-primary/10">
        <div className="relative w-40 h-40 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" className="stroke-slate-100" strokeWidth="8" />
            <circle 
              cx="50" 
              cy="50" 
              r="45" 
              fill="none" 
              className={`stroke-current ${ringColor} transition-all duration-1000`} 
              strokeWidth="8" 
              strokeDasharray={`${(analysis.overall_score / 100) * 283} 283`} 
              strokeLinecap="round" 
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-4xl font-black font-heading ${ringColor}`}>{analysis.overall_score}</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">/ 100</span>
          </div>
        </div>

        <div className="flex-1 w-full text-center md:text-left space-y-6">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border ${
              analysis.publication_readiness.includes('Ready') ? 'bg-green-100 text-green-800 border-green-200' : 
              analysis.publication_readiness.includes('Minor') ? 'bg-blue-100 text-blue-800 border-blue-200' : 
              'bg-red-100 text-red-800 border-red-200'
            }`}>
              {analysis.publication_readiness}
            </span>
            <span className="px-4 py-2 bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5" /> Rejection Risk: {analysis.estimated_desk_rejection_risk}
            </span>
            <span className="px-4 py-2 bg-purple-100 border border-purple-200 text-purple-800 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2">
              <Target className="w-3.5 h-3.5" /> Target: {analysis.suggested_target_quartile}
            </span>
          </div>

          <div>
            <h2 className="text-2xl font-heading font-black text-slate-900 mb-2">Editor's Verdict</h2>
            <p className="text-lg text-slate-600 italic leading-relaxed">"{analysis.one_line_summary}"</p>
          </div>
        </div>
      </div>

      {/* Strengths & Critical Fixes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="bg-green-50/50 border border-green-100 rounded-[2rem] p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-green-900 text-lg">Top 3 Strengths</h3>
          </div>
          <ul className="space-y-4">
            {analysis.top_3_strengths.map((str, i) => (
              <li key={i} className="flex gap-3 text-sm text-green-800 font-medium bg-white p-4 rounded-xl border border-green-100 shadow-sm leading-relaxed">
                <span className="font-black text-green-400">{i+1}.</span> {str}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-red-50/50 border border-red-100 rounded-[2rem] p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-red-900 text-lg">Top 3 Critical Fixes</h3>
          </div>
          <ul className="space-y-4">
            {analysis.top_3_critical_fixes.map((fix, i) => (
              <li key={i} className="flex gap-3 text-sm text-red-800 font-medium bg-white p-4 rounded-xl border border-red-100 shadow-sm leading-relaxed">
                <span className="font-black text-red-400">{i+1}.</span> {fix}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-2xl font-heading font-black text-slate-900 mb-8">10-Point Inspection</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {analysis.checks.map(check => (
            <ConstraintCard key={check.id} check={check} />
          ))}
        </div>
      </div>

      {/* Action Bar */}
      <div className="sticky bottom-8 bg-slate-900/95 backdrop-blur-xl border border-slate-700 p-4 rounded-2xl flex flex-wrap items-center justify-center gap-4 shadow-[0_20px_40px_rgba(0,0,0,0.3)] z-40">
        <button onClick={generatePDF} className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all">
          <Download className="w-4 h-4" /> Download Report
        </button>
        <button onClick={() => navigate(`/journals?search=${paper.domain || ''}`)} className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all">
          <Search className="w-4 h-4" /> Find Matching Journals
        </button>
        <button onClick={() => navigate(`/cover-letter?paperId=${id}`)} className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all">
          <FileText className="w-4 h-4" /> Generate Cover Letter
        </button>
        <button onClick={handleAnalyse} disabled={analyzing} className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-accent text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50">
          <RefreshCw className={`w-4 h-4 ${analyzing ? 'animate-spin' : ''}`} /> Re-analyse Paper
        </button>
      </div>

    </div>
  );
}
