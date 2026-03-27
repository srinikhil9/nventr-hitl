interface RttSparklineProps {
  data: number[];
}

export function RttSparkline({ data }: RttSparklineProps) {
  if (data.length < 2) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * 200;
      const y = 34 - ((v - min) / range) * 32;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div style={{ position: 'relative', height: '36px', marginTop: '8px' }}>
      <svg viewBox="0 0 200 36" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
        <polyline fill="none" stroke="var(--cyan)" strokeWidth="1.5" opacity="0.6" points={points} />
      </svg>
    </div>
  );
}
