import { useEffect } from 'react';
import { useStore } from '@/app/store';

interface ToastProps {
  id: string;
  message: string;
  type: 'info' | 'warn' | 'error' | 'success';
}

const icons: Record<string, string> = {
  info: 'ℹ',
  warn: '⚠',
  error: '✗',
  success: '✓',
};

const colors: Record<string, string> = {
  info: 'var(--cyan)',
  warn: 'var(--amber)',
  error: 'var(--red)',
  success: 'var(--green)',
};

const borderColors: Record<string, string> = {
  info: 'var(--border)',
  warn: 'var(--amber)',
  error: 'var(--red)',
  success: 'var(--green)',
};

export function Toast({ id, message, type }: ToastProps) {
  const removeToast = useStore((s) => s.removeToast);

  useEffect(() => {
    const timer = setTimeout(() => removeToast(id), 3500);
    return () => clearTimeout(timer);
  }, [id, removeToast]);

  return (
    <div
      style={{
        background: 'var(--bg-panel)',
        border: `1px solid ${borderColors[type]}`,
        padding: '10px 14px',
        borderRadius: '2px',
        fontSize: '10px',
        color: 'var(--text-primary)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        animation: 'toast-in 0.2s ease',
        maxWidth: '260px',
      }}
    >
      <span style={{ color: colors[type] }}>{icons[type]}</span>
      {message}
    </div>
  );
}
