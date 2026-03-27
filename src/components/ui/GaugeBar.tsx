interface GaugeBarProps {
  value: number;
  max?: number;
  color: string;
}

export function GaugeBar({ value, max = 100, color }: GaugeBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div style={{ marginTop: '6px' }}>
      <div
        style={{
          height: '2px',
          background: 'var(--bg-void)',
          borderRadius: '1px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            borderRadius: '1px',
            background: color,
            transition: 'width 0.5s ease',
          }}
        />
      </div>
    </div>
  );
}
