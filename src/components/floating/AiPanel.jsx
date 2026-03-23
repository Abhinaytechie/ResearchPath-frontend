import { FloatingPortal } from '@floating-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CheckCircle2, Hash } from 'lucide-react';
import { AbstractGauge } from './AbstractGauge';

export const AiPanel = ({ isOpen, analysis, onClose }) => {
  if (!isOpen || !analysis) return null;

  return (
    <FloatingPortal>
      <AnimatePresence>
        <div className="fixed inset-0 bg-darknav/20 backdrop-blur-sm z-[90] lg:hidden" onClick={onClose} />
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed top-24 right-4 w-full md:w-96 h-[calc(100vh-120px)] z-[100] bg-white/95 backdrop-blur-xl border border-slate-200/50 shadow-2xl p-6 overflow-y-auto rounded-2xl"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-heading font-bold text-xl flex items-center gap-2 text-slate-800">
              <Sparkles className="w-5 h-5 text-primary" /> AI Analysis
            </h3>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-red-500 transition-colors text-2xl">&times;</button>
          </div>

          <div className="bg-gradient-to-br from-[#fcf8ff] to-white p-5 rounded-2xl border border-primary/10 mb-6 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-sm font-semibold text-slate-700 uppercase tracking-widest mb-1">Quality Score</p>
              <p className="text-xs text-slate-500">Hover for breakdown</p>
            </div>
            <AbstractGauge analysis={analysis} />
          </div>

          <div className="mb-6">
            <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-4 h-4 text-success" /> Feedback
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-inner">
              {analysis.abstract_feedback}
            </p>
          </div>

          <div className="mb-6">
            <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2 mb-3">
              <Hash className="w-4 h-4 text-accent" /> Extracted Keywords
            </h4>
            <div className="flex flex-wrap gap-2">
              {analysis.extracted_keywords?.map(kw => (
                <span key={kw} className="bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1.5 rounded-md border border-primary/20">
                  {kw}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-primary" /> Recommended Journals
            </h4>
            <div className="space-y-3">
              {analysis.journal_recommendations?.map(j => (
                <div key={j.journal_name} className="p-3 bg-white border border-slate-200 rounded-xl hover:border-primary/50 transition-colors shadow-sm cursor-pointer group hover:-translate-y-0.5 transform duration-200">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-sm text-slate-800 group-hover:text-primary transition-colors pr-2 leading-tight">{j.journal_name}</span>
                    <span className="text-xs font-bold text-success bg-success/10 px-1.5 py-0.5 rounded shrink-0">{j.match_score}/10</span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">{j.reason}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </FloatingPortal>
  );
};
