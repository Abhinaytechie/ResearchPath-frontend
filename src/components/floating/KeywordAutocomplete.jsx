import { useState, useRef } from 'react';
import { useFloating, useInteractions, useListNavigation, useRole, useDismiss, offset, size, FloatingPortal } from '@floating-ui/react';

const SUGGESTIONS = [
  "Artificial Intelligence", "Machine Learning", "Deep Learning", "Neural Networks", 
  "Data Mining", "Internet of Things", "Blockchain", "Cybersecurity", 
  "Computer Vision", "Natural Language Processing", "Embedded Systems",
  "Software Engineering", "Cloud Computing"
];

export const KeywordAutocomplete = ({ keywords, setKeywords }) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [activeIndex, setActiveIndex] = useState(null);
  
  const listRef = useRef([]);

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: 'bottom-start',
    middleware: [
      offset(4),
      size({
        apply({ rects, elements }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
          });
        },
      }),
    ],
  });

  const filtered = SUGGESTIONS.filter(item => 
    item.toLowerCase().includes(inputValue.toLowerCase()) && 
    !keywords.includes(item)
  );

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    useDismiss(context),
    useRole(context, { role: 'listbox' }),
    useListNavigation(context, {
      listRef,
      activeIndex,
      onNavigate: setActiveIndex,
      virtual: true,
      loop: true
    })
  ]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex !== null && filtered[activeIndex]) {
        addKeyword(filtered[activeIndex]);
      } else if (inputValue.trim()) {
        addKeyword(inputValue.trim());
      }
    } else if (e.key === 'Backspace' && !inputValue && keywords.length > 0) {
      setKeywords(keywords.slice(0, -1));
    }
  };

  const addKeyword = (kw) => {
    if (kw && !keywords.includes(kw)) {
      setKeywords([...keywords, kw]);
    }
    setInputValue('');
    setOpen(false);
  };

  const removeKeyword = (kw) => {
    setKeywords(keywords.filter(k => k !== kw));
  };

  return (
    <div className="w-full">
      <div 
        ref={refs.setReference}
        {...getReferenceProps()}
        className="flex flex-wrap gap-2 p-2.5 min-h-[46px] border border-slate-200 rounded-lg bg-[#fcf8ff] focus-within:border-primary focus-within:ring-1 focus-within:ring-primary shadow-inner transition-all"
      >
        {keywords.map(kw => (
          <span key={kw} className="bg-primary/10 border border-primary/20 text-primary text-xs px-2.5 py-1 rounded-md flex items-center gap-1.5 font-semibold">
            {kw}
            <button type="button" onClick={() => removeKeyword(kw)} className="hover:text-red-500 cursor-pointer w-4 h-4 flex items-center justify-center rounded-full bg-white/50 leading-none">&times;</button>
          </span>
        ))}
        <input
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setOpen(true);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setOpen(true)}
          placeholder={keywords.length === 0 ? "Type keywords (e.g., AI)" : ""}
          className="flex-1 min-w-[150px] bg-transparent outline-none text-sm text-slate-700 font-body placeholder-slate-400"
        />
      </div>

      {open && filtered.length > 0 && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className="z-50 bg-white border border-slate-200 shadow-2xl rounded-lg overflow-y-auto max-h-60 py-1"
          >
            {filtered.map((item, index) => (
              <div
                key={item}
                ref={(node) => { listRef.current[index] = node; }}
                {...getItemProps({
                  onClick: () => addKeyword(item),
                })}
                className={`px-4 py-2.5 cursor-pointer text-sm font-medium transition-colors border-b last:border-0 border-slate-50 ${activeIndex === index ? 'bg-[#f6f1ff] text-primary' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                {item}
              </div>
            ))}
          </div>
        </FloatingPortal>
      )}
    </div>
  );
};
