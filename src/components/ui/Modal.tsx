import React from 'react';

interface ModalProps {
  open: boolean;
  onClose?: () => void;
  preventBackdropClose?: boolean;
  children: React.ReactNode;
}

export function Modal({ open, onClose, preventBackdropClose, children }: ModalProps) {
  if (!open) return null;

  const handleBackdropClick = () => {
    if (!preventBackdropClose && onClose) {
      onClose();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={handleBackdropClick}
    >
      <div
        style={{
          background: 'var(--bg-panel)',
          border: '1px solid var(--border-bright)',
          padding: '24px',
          width: '360px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
