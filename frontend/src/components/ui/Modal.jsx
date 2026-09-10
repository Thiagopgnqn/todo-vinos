import React, { useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Dialog */}
      <div className={`relative bg-white rounded-2xl w-full ${maxWidth} max-h-[92vh] flex flex-col p-4 sm:p-6 shadow-2xl z-10 my-auto`}>
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-3 mb-2 border-b border-gray-100 flex-shrink-0">
          {title && <h3 className="text-lg sm:text-xl font-playfair font-bold text-gray-900">{title}</h3>}
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Cerrar modal"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Modal Body with internal scroll */}
        <div className="overflow-y-auto flex-1 pr-1">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
