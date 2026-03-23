import { useState, useEffect } from 'react';
import { useFloating, FloatingPortal, FloatingOverlay, FloatingFocusManager } from '@floating-ui/react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

const options = [
  { id: 'dashboard', label: 'Go to Dashboard', route: '/dashboard' },
  { id: 'papers', label: 'My Research Papers', route: '/papers' },
  { id: 'journals', label: 'Search Journals', route: '/journals' },
  { id: 'upload', label: 'Upload New Paper', route: '/upload' },
  { id: 'cover-letter', label: 'Generate Cover Letter', route: '/cover-letter' },
  { id: 'templates', label: 'Latex Templates', route: '/templates' },
  { id: 'resources', label: 'Academic Resources', route: '/resources' },
];

export const CommandPalette = ({ isOpen, setIsOpen }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsOpen]);

  const filtered = options.filter(opt => opt.label.toLowerCase().includes(query.toLowerCase()));

  if (!isOpen) return null;

  return (
    <FloatingPortal>
      <FloatingOverlay className="bg-darknav/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <FloatingFocusManager context={context}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col" ref={context.refs.setFloating}>
            <div className="flex items-center px-4 border-b border-gray-100">
              <Search className="text-gray-400 w-5 h-5 mr-3" />
              <input
                autoFocus
                type="text"
                placeholder="Type a command or search..."
                className="w-full py-4 outline-none text-slate-700 bg-transparent font-body"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="max-h-[300px] overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <p className="text-gray-400 text-center py-4">No results found.</p>
              ) : (
                filtered.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setIsOpen(false);
                      navigate(opt.route);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-[#f6f1ff] hover:text-primary rounded-lg transition-colors flex items-center"
                  >
                    {opt.label}
                  </button>
                ))
              )}
            </div>
          </div>
        </FloatingFocusManager>
      </FloatingOverlay>
    </FloatingPortal>
  );
};
