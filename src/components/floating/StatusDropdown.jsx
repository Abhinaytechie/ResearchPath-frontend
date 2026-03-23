import { useState } from 'react';
import { useFloating, useClick, useDismiss, useInteractions, offset, flip, FloatingPortal } from '@floating-ui/react';
import { Send, Clock, Edit3, CheckCircle, XCircle } from 'lucide-react';
import api from '../../api/axios';

const STATUS_OPTIONS = [
  { value: 'submitted', label: 'Submitted', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Send },
  { value: 'under_review', label: 'Under Review', color: 'bg-orange-100 text-orange-700 border-orange-200', icon: Clock },
  { value: 'revision', label: 'Revision', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: Edit3 },
  { value: 'accepted', label: 'Accepted', color: 'bg-[#0fad6e]/20 text-[#0fad6e] border-[#0fad6e]/30', icon: CheckCircle },
  { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle }
];

export const StatusDropdown = ({ submissionId, currentStatus, onStatusChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState(currentStatus);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'bottom-start',
    middleware: [offset(4), flip()]
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss]);

  const activeOption = STATUS_OPTIONS.find(s => s.value === status) || STATUS_OPTIONS[0];
  const ActiveIcon = activeOption.icon;

  const handleSelect = async (opt) => {
    setStatus(opt.value);
    setIsOpen(false);
    try {
      await api.patch(`/submissions/${submissionId}`, { current_status: opt.value });
      if (onStatusChange) onStatusChange(opt.value);
    } catch (error) {
      console.error("Failed to update status", error);
      setStatus(currentStatus);
    }
  };

  return (
    <>
      <button
        ref={refs.setReference}
        {...getReferenceProps()}
        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${activeOption.color} transition-all hover:opacity-80`}
      >
        <ActiveIcon className="w-3.5 h-3.5" />
        {activeOption.label}
      </button>

      {isOpen && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className="z-50 glass-panel p-1.5 rounded-lg shadow-xl min-w-[150px]"
          >
            {STATUS_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.value}
                  onClick={() => handleSelect(opt)}
                  className={`flex items-center gap-2 px-2.5 py-2 text-xs rounded-md w-full text-left transition-colors mb-0.5 hover:bg-slate-50 ${status === opt.value ? 'bg-slate-100 font-bold' : 'text-slate-600'}`}
                >
                  <Icon className={`w-3.5 h-3.5 ${status === opt.value ? opt.color.split(' ')[1] : ''}`} />
                  {opt.label}
                </button>
              );
            })}
          </div>
        </FloatingPortal>
      )}
    </>
  );
};
