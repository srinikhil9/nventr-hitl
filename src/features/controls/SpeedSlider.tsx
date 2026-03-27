import { useStore } from '@/app/store';

export function SpeedSlider() {
  const speed = useStore((s) => s.speed);
  const setSpeed = useStore((s) => s.setSpeed);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexShrink: 0 }}>
      <div
        style={{
          fontSize: '9px',
          color: 'var(--text-secondary)',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}
      >
        Speed
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={speed}
        onChange={(e) => setSpeed(Number(e.target.value))}
        style={{
          WebkitAppearance: 'none',
          width: '80px',
          height: '3px',
          background: 'var(--bg-void)',
          borderRadius: '2px',
          outline: 'none',
          cursor: 'pointer',
          accentColor: 'var(--amber)',
        }}
      />
      <div style={{ fontSize: '11px', color: 'var(--amber)', fontWeight: 600 }}>
        {(speed / 100).toFixed(1)} m/s
      </div>
    </div>
  );
}
