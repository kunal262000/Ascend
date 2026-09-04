"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { Check, X, ShoppingBag, Heart, AlertCircle } from "lucide-react";

type ToastType = "success" | "error" | "info" | "cart" | "wishlist";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  productName?: string;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (type: ToastType, message: string, productName?: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((type: ToastType, message: string, productName?: string) => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, type, message, productName }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

function ToastContainer({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: string) => void }) {
  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-[100] flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="animate-slide-up bg-card border rounded-xl shadow-lg p-4 flex items-start gap-3 min-w-[300px]"
        >
          <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
            toast.type === "success" ? "bg-green-100 text-green-600" :
            toast.type === "error" ? "bg-red-100 text-red-600" :
            toast.type === "cart" ? "bg-primary/10 text-primary" :
            toast.type === "wishlist" ? "bg-pink-100 text-pink-600" :
            "bg-blue-100 text-blue-600"
          }`}>
            {toast.type === "success" && <Check className="w-5 h-5" />}
            {toast.type === "error" && <AlertCircle className="w-5 h-5" />}
            {toast.type === "cart" && <ShoppingBag className="w-5 h-5" />}
            {toast.type === "wishlist" && <Heart className="w-5 h-5" />}
            {toast.type === "info" && <AlertCircle className="w-5 h-5" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm">{toast.message}</p>
            {toast.productName && (
              <p className="text-sm text-muted-foreground truncate">{toast.productName}</p>
            )}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
