import { useStore } from '@/app/store';

export function EStopButton() {
  const estopActive = useStore((s) => s.estopActive);

  const handleClick = () => {
    window.dispatchEvent(new CustomEvent('open-estop-modal'));
  };

  return (
    <button
      onClick={handleClick}
      style={{
        background: estopActive ? '#991b1b' : 'var(--red)',
        border: '1px solid var(--red)',
        color: 'white',
        fontWeight: 600,
        fontSize: '12px',
        letterSpacing: '0.04em',
        padding: '8px 14px',
        cursor: 'pointer',
        transition: 'all 0.1s',
        borderRadius: '10px',
        animation: estopActive ? 'pulse-red 0.8s ease-in-out infinite' : 'none',
      }}
    >
      {estopActive ? 'Stopped' : 'E-Stop'}
    </button>
  );
}
