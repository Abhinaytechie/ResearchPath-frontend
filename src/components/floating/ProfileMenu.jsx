import { useState } from 'react';
import { useFloating, useClick, useDismiss, useInteractions, offset, flip, FloatingPortal } from '@floating-ui/react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const ProfileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(8), flip()],
    placement: 'bottom-end'
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss]);

  if (!currentUser) return null;

  return (
    <>
      <button 
        ref={refs.setReference} 
        {...getReferenceProps()}
        className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent border-2 border-white shadow-md overflow-hidden"
      >
        {currentUser.photoURL ? (
          <img src={currentUser.photoURL} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <span className="text-white font-bold">{currentUser.email?.charAt(0).toUpperCase()}</span>
        )}
      </button>

      {isOpen && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className="z-50 glass-panel p-2 rounded-xl shadow-xl min-w-[200px]"
          >
            <div className="px-4 py-2 border-b border-gray-100 mb-2">
              <p className="font-heading font-semibold text-sm truncate">{currentUser.displayName || 'User'}</p>
              <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
            </div>
            <button onClick={() => { setIsOpen(false); navigate('/dashboard'); }} className="w-full text-left px-4 py-2 text-sm hover:bg-[#f6f1ff] hover:text-primary rounded-md transition-colors">Dashboard</button>
            <button onClick={() => { setIsOpen(false); navigate('/papers'); }} className="w-full text-left px-4 py-2 text-sm hover:bg-[#f6f1ff] hover:text-primary rounded-md transition-colors">My Papers</button>
            <button onClick={() => { setIsOpen(false); navigate('/journals/saved'); }} className="w-full text-left px-4 py-2 text-sm hover:bg-[#f6f1ff] hover:text-primary rounded-md transition-colors">Saved Journals</button>
            <button 
              onClick={() => { setIsOpen(false); logout(); navigate('/'); }} 
              className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-md transition-colors mt-2 border-t border-gray-100 pt-2"
            >
              Sign Out
            </button>
          </div>
        </FloatingPortal>
      )}
    </>
  );
};
