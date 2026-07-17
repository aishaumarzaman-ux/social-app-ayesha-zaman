import { useEffect } from 'react';

export default function Modal({ isOpen, onClose, title, children }) {
  // Escape key closes the modal.
  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <h3 className="mb-4 font-display text-lg font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </h3>
        )}
        {children}
      </div>
    </div>
  );
}
