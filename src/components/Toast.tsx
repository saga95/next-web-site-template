import React, { createContext, useCallback, useContext, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert, { type AlertColor } from '@mui/material/Alert';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Toast {
  id: number;
  message: string;
  severity: AlertColor;
  duration?: number;
}

interface ToastContextValue {
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────

let nextId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (message: string, severity: AlertColor, duration = 5000) => {
      const id = ++nextId;
      setToasts(prev => [...prev, { id, message, severity, duration }]);
    },
    []
  );

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const value: ToastContextValue = {
    success: useCallback((msg: string) => addToast(msg, 'success'), [addToast]),
    error: useCallback(
      (msg: string) => addToast(msg, 'error', 8000),
      [addToast]
    ),
    warning: useCallback((msg: string) => addToast(msg, 'warning'), [addToast]),
    info: useCallback((msg: string) => addToast(msg, 'info'), [addToast]),
  };

  // Only show the most recent toast (stacked toasts can be distracting)
  const current = toasts[0];

  return (
    <ToastContext.Provider value={value}>
      {children}
      {current ? (
        <Snackbar
          key={current.id}
          open
          autoHideDuration={current.duration ?? null}
          onClose={() => removeToast(current.id)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => removeToast(current.id)}
            severity={current.severity}
            variant='filled'
            sx={{ width: '100%' }}
          >
            {current.message}
          </Alert>
        </Snackbar>
      ) : null}
    </ToastContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
