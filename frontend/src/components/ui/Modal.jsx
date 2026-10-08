import React, { useEffect } from 'react';
import { FiX } from 'react-icons/fi';

const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-xl' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop con opacidad sutil */}
      <div 
        className="fixed inset-0 bg-black/40 transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Dialog */}
      <div className={`relative bg-white rounded-lg w-full ${maxWidth} max-h-[90vh] flex flex-col p-6 shadow-overlay border border-zinc-200 z-10 my-auto`}>
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-4 mb-4 border-b border-zinc-100 flex-shrink-0">
          {title && <h3 className="text-lg font-semibold text-zinc-900">{title}</h3>}
          <button 
            onClick={onClose} 
            className="text-zinc-400 hover:text-zinc-700 p-1.5 rounded-md hover:bg-zinc-100 transition-smooth"
            aria-label="Cerrar modal"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto flex-1 pr-1">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
