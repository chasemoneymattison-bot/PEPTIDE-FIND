"use client";

import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { X, CheckCircle, AlertTriangle, Info } from "lucide-react";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
  duration?: number;
}

interface ToastContextType {
  addToast: (toast: Omit<Toast, "id">) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    // Return a no-op when outside provider
    return {
      addToast: (toast: Omit<Toast, "id">) => {
        console.log("Toast:", toast.message);
      },
    };
  }
  return context;
}

// Standalone toast function for use outside React
export function toast(message: string, type: "success" | "error" | "info" = "info") {
  window.dispatchEvent(
    new CustomEvent("peptidefind-toast", { detail: { message, type } })
  );
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { ...toast, id }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, toast.duration || 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Listen for custom events
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      addToast({ message: detail.message, type: detail.type || "info" });
    };
    window.addEventListener("peptidefind-toast", handler);
    return () => window.removeEventListener("peptidefind-toast", handler);
  }, [addToast]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg animate-in slide-in-from-right ${
            t.type === "success"
              ? "border-green-200 bg-green-50 text-green-800"
              : t.type === "error"
                ? "border-red-200 bg-red-50 text-red-800"
                : "border-blue-200 bg-blue-50 text-blue-800"
          }`}
        >
          {t.type === "success" && <CheckCircle className="h-4 w-4 shrink-0" />}
          {t.type === "error" && <AlertTriangle className="h-4 w-4 shrink-0" />}
          {t.type === "info" && <Info className="h-4 w-4 shrink-0" />}
          <span className="text-sm font-medium">{t.message}</span>
          <button
            onClick={() => removeToast(t.id)}
            className="ml-2 shrink-0 rounded-full p-0.5 hover:bg-black/5"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
    </div>
  );
}
