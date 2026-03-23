import { useState } from 'react';
import { useFloating, useHover, useInteractions, offset, flip, FloatingPortal } from '@floating-ui/react';
import { motion, AnimatePresence } from 'framer-motion';

export const AbstractGauge = ({ analysis }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'bottom',
    middleware: [offset(10), flip()]
  });

  const hover = useHover(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([hover]);

  if (!analysis || !analysis.abstract_quality_score) return null;

  const score = analysis.abstract_quality_score;
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 10) * circumference;

  return (
    <>
      <div 
        ref={refs.setReference} 
        {...getReferenceProps()} 
        className="relative flex items-center justify-center cursor-help group"
      >
        <svg width="60" height="60" className="transform -rotate-90">
          <circle cx="30" cy="30" r={radius} stroke="#f0ecf9" strokeWidth="6" fill="none" />
          <motion.circle 
            cx="30" cy="30" r={radius} 
            stroke={score > 7 ? "#0fad6e" : score > 4 ? "#ff6b35" : "#ba1a1a"} 
            strokeWidth="6" fill="none" 
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: 'easeOut' }}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute font-heading font-bold text-lg text-slate-700 group-hover:text-primary transition-colors">{score}</span>
      </div>

      <AnimatePresence>
        {isOpen && (
          <FloatingPortal>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              ref={refs.setFloating}
              style={floatingStyles}
              {...getFloatingProps()}
              className="z-[60] glass-panel w-64 p-4 rounded-xl shadow-xl"
            >
              <h4 className="font-heading font-bold text-sm mb-3 text-slate-800">Quality Breakdown</h4>
              <div className="space-y-2">
                {[
                  { label: "Clarity", val: analysis.clarity_score || 0 },
                  { label: "Novelty", val: analysis.novelty_score || 0 },
                  { label: "Structure", val: analysis.structure_score || 0 },
                  { label: "Completeness", val: analysis.completeness_score || 0 }
                ].map(item => (
                  <div key={item.label} className="flex flex-col">
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="text-slate-400 font-bold uppercase tracking-wider">{item.label}</span>
                      <span className="font-black text-slate-800">{item.val}/10</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(108,71,255,0.3)]" style={{ width: `${(item.val / 10) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </FloatingPortal>
        )}
      </AnimatePresence>
    </>
  );
};
