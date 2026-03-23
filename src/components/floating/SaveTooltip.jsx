import { useState, useRef } from 'react';
import { useFloating, useHover, useFocus, useInteractions, offset, shift, arrow, FloatingPortal } from '@floating-ui/react';
import { AnimatePresence, motion } from 'framer-motion';

export const SaveTooltip = ({ children, isSaved, onClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const arrowRef = useRef(null);
  
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'top',
    middleware: [offset(10), shift({ padding: 8 }), arrow({ element: arrowRef })]
  });

  const hover = useHover(context, { delay: 150 });
  const focus = useFocus(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus]);

  return (
    <>
      <div ref={refs.setReference} {...getReferenceProps()} onClick={onClick} className="cursor-pointer">
        {children}
      </div>
      <AnimatePresence>
        {isOpen && (
          <FloatingPortal>
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.15 }}
              ref={refs.setFloating}
              style={floatingStyles}
              {...getFloatingProps()}
              className="z-50 bg-darknav text-white text-xs px-3 py-1.5 rounded-md shadow-lg font-body"
            >
              {isSaved ? "Saved ✓" : "Save to your list"}
              <div ref={arrowRef} className="absolute w-2 h-2 bg-darknav transform rotate-45 -bottom-1" style={{ left: context.middlewareData.arrow?.x ?? 0 }} />
            </motion.div>
          </FloatingPortal>
        )}
      </AnimatePresence>
    </>
  );
};
