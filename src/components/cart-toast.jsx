import React, { useEffect, useState } from "react";

const CartToast = ({ message, show, onHide, duration = 3600 }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (show) {
      setMounted(true);
    }
  }, [show]);

  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(() => {
      onHide?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [show, duration, onHide]);

  useEffect(() => {
    if (show || !mounted) return;
    const timer = setTimeout(() => {
      setMounted(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [show, mounted]);

  if (!mounted || !message) return null;

  return (
    <div
      className={`pointer-events-none fixed left-1/2 top-5 z-[9999] -translate-x-1/2 transform transition-all duration-500 ease-out ${
        show ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
      }`}
    >
      <div className="rounded-xl border border-[#b9d6b0] bg-[#edf8e8] px-5 py-3 text-sm font-medium text-[#285923] shadow-[0px_10px_20px_rgba(40,89,35,0.18)]">
        {message}
      </div>
    </div>
  );
};

export default CartToast;
