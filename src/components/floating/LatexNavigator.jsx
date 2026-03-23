import { useFloating, offset } from '@floating-ui/react';
import { motion } from 'framer-motion';
import { List } from 'lucide-react';

const SECTIONS = [
  { id: 'preamble', label: 'Preamble' },
  { id: 'title', label: 'Title Block' },
  { id: 'abstract', label: 'Abstract' },
  { id: 'intro', label: 'Introduction' },
  { id: 'methodology', label: 'Methodology' },
  { id: 'results', label: 'Results' },
  { id: 'conclusion', label: 'Conclusion' },
  { id: 'references', label: 'References' }
];

export const LatexNavigator = ({ activeSection, onNavigate }) => {
  const { refs, floatingStyles } = useFloating({
    placement: 'left-start',
    middleware: [offset(24)]
  });

  return (
    <div 
      className="hidden md:block fixed top-32 left-8 z-40"
      ref={refs.setReference}
    >
      <div 
        ref={refs.setFloating}
        style={floatingStyles}
        className="glass-panel w-48 rounded-xl p-4 shadow-[0_20px_40px_rgba(83,35,230,0.05)] border border-white/50 bg-white/80 backdrop-blur-xl"
      >
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
          <List className="w-3.5 h-3.5" /> Navigate
        </h3>
        <nav className="flex flex-col gap-1.5 relative border-l-2 border-slate-100 ml-2">
          {SECTIONS.map((sec) => (
            <button
              key={sec.id}
              onClick={() => onNavigate(sec.id)}
              className={`text-left text-xs px-4 py-1.5 transition-all relative rounded-r-md ${activeSection === sec.id ? 'text-primary font-bold bg-[#f6f1ff]' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
            >
              {activeSection === sec.id && (
                <motion.div 
                  layoutId="active-indicator"
                  className="absolute left-[base-indicator] -ml-4 inset-y-0 w-0.5 bg-primary" 
                  style={{ left: '-2px' }}
                />
              )}
              {sec.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};
