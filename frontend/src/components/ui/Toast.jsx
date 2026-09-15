import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaTimes } from 'react-icons/fa';

const Toast = ({ message, show, onClose, duration = 2500 }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      // Small delay to trigger CSS transition
      requestAnimationFrame(() => setVisible(true));
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 300); // Wait for exit animation
      }, duration);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [show, duration, onClose]);

  if (!show) return null;

  return (
    <div className="fixed top-6 right-6 z-[9999] pointer-events-auto">
      <div
        className={`flex items-center gap-3 bg-white border border-green-200 shadow-xl rounded-xl px-5 py-3.5 transition-all duration-300 ease-out ${
          visible
            ? 'translate-x-0 opacity-100'
            : 'translate-x-8 opacity-0'
        }`}
      >
        <FaCheckCircle className="text-green-500 text-xl flex-shrink-0" />
        <span className="text-sm font-semibold text-gray-800">{message}</span>
        <button
          onClick={() => {
            setVisible(false);
            setTimeout(onClose, 300);
          }}
          className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FaTimes size={14} />
        </button>
      </div>
    </div>
  );
};

export default Toast;

