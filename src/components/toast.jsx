"use client";

import { X } from "lucide-react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

export function Toast({ title, description, duration = 3000, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md bg-white border border-gray-200 rounded-lg shadow-lg p-4 animate-slide-up">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-gray-900">{title}</h3>
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="ml-4 text-gray-400 hover:text-gray-600"
          aria-label="Fermer"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}

Toast.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  duration: PropTypes.number,
  onClose: PropTypes.func.isRequired,
};

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const toast = ({ title, description, duration }) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description, duration }]);
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return {
    toast,
    Toasts: () => (
      <>
        {toasts.map((t) => (
          <Toast
            key={t.id}
            title={t.title}
            description={t.description}
            duration={t.duration}
            onClose={() => dismissToast(t.id)}
          />
        ))}
      </>
    ),
  };
}
