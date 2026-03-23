import { FloatingPortal } from '@floating-ui/react';
import { AnimatePresence, motion } from 'framer-motion';

export const ToastStack = ({ toasts }) => {
  return (
    <FloatingPortal>
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              layout
              className={`p-4 rounded-md shadow-lg pointer-events-auto backdrop-blur-md border border-white/20 text-white min-w-[300px] ${
                toast.type === 'success' ? 'bg-[#0fad6e]/95' :
                toast.type === 'error' ? 'bg-red-500/95' :
                toast.type === 'info' ? 'bg-[#6c47ff]/95' :
                'bg-[#ff6b35]/95' // warning
              }`}
            >
              {toast.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </FloatingPortal>
  );
};
