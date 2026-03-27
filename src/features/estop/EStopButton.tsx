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
        background: estopActive ? '#7f1d1d' : 'var(--red)',
        border: 'none',
        color: 'white',
        fontFamily: "'Syne', sans-serif",
        fontWeight: 700,
        fontSize: '11px',
        letterSpacing: '0.1em',
        padding: '6px 14px',
        cursor: 'pointer',
        textTransform: 'uppercase',
        transition: 'all 0.1s',
        clipPath: 'polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)',
        animation: estopActive ? 'pulse-red 0.8s ease-in-out infinite' : 'none',
      }}
    >
      ⬛ {estopActive ? 'STOPPED' : 'E-STOP'}
    </button>
  );
}
