import { useStore } from '@/app/store';
import { Toast } from './Toast';

export function ToastContainer() {
  const toasts = useStore((s) => s.toasts);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '16px',
        right: '16px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
      }}
    >
      {toasts.map((t) => (
        <Toast key={t.id} id={t.id} message={t.message} type={t.type} />
      ))}
    </div>
  );
}
