import { useState } from 'react';
import {
  useFloating,
  useHover,
  useFocus,
  useDismiss,
  useInteractions,
  FloatingPortal,
  offset,
  flip,
  shift,
  autoUpdate,
  useClientPoint
} from '@floating-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ExternalLink, Clock, Target, ShieldCheck } from 'lucide-react';

export const JournalPopover = ({ journal, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'right-start',
    strategy: 'fixed',
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(14),
      flip({
        fallbackPlacements: ['left-start', 'bottom', 'top', 'right-end'],
        padding: 12,
      }),
      shift({ padding: 20, crossAxis: true }),
    ],
  });

  const hover = useHover(context, { delay: { open: 400, close: 100 }, move: false });
  const clientPoint = useClientPoint(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([hover, clientPoint]);

  console.log("JournalPopover Render Check:");
  console.log("FloatingPortal:", typeof FloatingPortal, FloatingPortal);
  console.log("AnimatePresence:", typeof AnimatePresence, AnimatePresence);
  console.log("motion.div:", typeof motion?.div, motion?.div);
  console.log("ExternalLink:", typeof ExternalLink, ExternalLink);
  console.log("Clock:", typeof Clock, Clock);
  console.log("Target:", typeof Target, Target);
  console.log("ShieldCheck:", typeof ShieldCheck, ShieldCheck);


  return (
    <>
      <div ref={refs.setReference} {...getReferenceProps()} className="w-full min-h-0 cursor-pointer">
        {children}
      </div>
      <AnimatePresence>
        {isOpen && (
          <FloatingPortal>
            <div
              ref={refs.setFloating}
              style={{ ...floatingStyles, zIndex: 80 }}
              {...getFloatingProps()}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 4 }}
                transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                className="w-[min(340px,calc(100vw-2rem))] max-h-[min(85vh,560px)] overflow-y-auto glass-panel rounded-[1.5rem] p-6 shadow-[0_32px_64px_-16px_rgba(28,26,36,0.15)] border border-slate-200/80"
              >
              <div className="mb-4">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                   {journal.source !== 'exa' && (
                     <span className="bg-primary/5 text-primary text-[10px] font-black px-2.5 py-1 rounded-lg border border-primary/10 tracking-[0.05em] uppercase">{journal.quartile}</span>
                   )}
                   <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{journal.domain}</span>
                </div>
                <h3 className="font-heading font-bold text-xl text-slate-900 leading-tight group-hover:text-primary transition-colors">{journal.name}</h3>
                <p className="text-sm font-medium text-slate-600 mt-1">{journal.publisher}</p>
                {journal.snippet && (
                  <p className="text-xs text-slate-600 leading-relaxed mt-3 line-clamp-5 border-t border-slate-100 pt-3">{journal.snippet}</p>
                )}
              </div>
              
              {journal.source !== 'exa' && (
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-[#fcf8ff] p-4 rounded-2xl flex flex-col items-center justify-center border border-primary/5 shadow-inner">
                    <Target className="w-6 h-6 text-accent mb-2" />
                    <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wider mb-1">Impact Factor</span>
                    <span className="font-black text-lg text-slate-900">{journal.impact_factor || 'N/A'}</span>
                  </div>
                  <div className="bg-[#fcf8ff] p-4 rounded-2xl flex flex-col items-center justify-center border border-primary/5 shadow-inner">
                    <Clock className="w-6 h-6 text-blue-500 mb-2" />
                    <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wider mb-1">Avg. Review</span>
                    <span className="font-black text-lg text-slate-900">
                      {journal.avg_weeks} wks
                    </span>
                  </div>
                </div>
              )}

              <div className="mb-6 flex flex-wrap gap-2">
                {journal.index_types?.map(idx => (
                  <span key={idx} className="flex items-center text-[10px] bg-white text-green-700 px-3 py-1.5 rounded-xl border border-green-100 font-bold shadow-sm">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-green-600" /> {idx}
                  </span>
                ))}
              </div>

              <a 
                href={journal.submission_url || '#'} 
                target="_blank" 
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="sticky bottom-0 mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0f0e17] px-6 py-4 font-bold text-white shadow-xl transition-all hover:-translate-y-0.5 hover:bg-slate-800"
              >
                {journal.source === 'exa' ? 'View on Scopus' : 'Submit Manuscript'} <ExternalLink className="w-4 h-4 shrink-0" />
              </a>
              </motion.div>
            </div>
          </FloatingPortal>
        )}
      </AnimatePresence>
    </>
  );
};
