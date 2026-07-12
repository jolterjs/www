"use client";

import React from "react";

type ToastTone = "success" | "error";

type Toast = {
  id: number;
  message: string;
  tone: ToastTone;
};

type ToastDetail = {
  message: string;
  tone?: ToastTone;
};

const toastEventName = "jolter-toast";

export default function ToastViewport() {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  React.useEffect(() => {
    function onToast(event: Event) {
      const { message, tone = "success" } = (event as CustomEvent<ToastDetail>)
        .detail;
      const id = Date.now() + Math.random();

      setToasts((current) => [...current, { id, message, tone }]);

      window.setTimeout(() => {
        setToasts((current) => current.filter((toast) => toast.id !== id));
      }, 2600);
    }

    window.addEventListener(toastEventName, onToast);

    return () => {
      window.removeEventListener(toastEventName, onToast);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed right-4 bottom-4 left-4 z-[60] flex flex-col items-stretch gap-2 sm:left-auto sm:w-80"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`animate-[jolter-toast-in_180ms_ease-out] rounded-md border bg-black/92 px-4 py-3 text-sm shadow-2xl shadow-black/40 backdrop-blur ${
            toast.tone === "error"
              ? "border-red-400/30 text-red-100"
              : "border-white/[0.14] text-white"
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
