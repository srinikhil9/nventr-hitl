import type { RiskLevel } from '@/types/risk';

interface RiskScoreDisplayProps {
  score: number;
  level: RiskLevel;
}

const LEVEL_COLORS: Record<RiskLevel, string> = {
  LOW: 'var(--green)',
  MEDIUM: 'var(--amber)',
  HIGH: 'var(--red)',
};

export function RiskScoreDisplay({ score, level }: RiskScoreDisplayProps) {
  const color = LEVEL_COLORS[level];
  const textShadow = level === 'HIGH' ? '0 0 20px var(--red)' : 'none';

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', marginBottom: '8px' }}>
      <div
        style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: '36px',
          fontWeight: 800,
          lineHeight: 1,
          color,
          textShadow,
        }}
      >
        {score.toFixed(2)}
      </div>
      <div style={{ fontSize: '10px', color: 'var(--text-secondary)', paddingBottom: '4px' }}>
        {level}
      </div>
    </div>
  );
}
