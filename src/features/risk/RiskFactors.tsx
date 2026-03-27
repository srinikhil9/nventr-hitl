interface RiskFactorsProps {
  factors: {
    proximity: number;
    cmdVelocity: number;
    operatorHistory: number;
    pathDeviation: number;
    cameraQuality: number;
  };
  score: number;
}

const FACTOR_NAMES: { key: keyof RiskFactorsProps['factors']; label: string }[] = [
  { key: 'proximity', label: 'Proximity' },
  { key: 'cmdVelocity', label: 'Cmd velocity' },
  { key: 'operatorHistory', label: 'Operator hist.' },
  { key: 'pathDeviation', label: 'Path deviation' },
  { key: 'cameraQuality', label: 'Camera quality' },
];

function getBarColor(value: number, isProximity: boolean, score: number): string {
  if (isProximity) {
    return score > 0.7 ? 'var(--red)' : score > 0.4 ? 'var(--amber)' : 'var(--cyan)';
  }
  if (value > 0.6) return 'var(--amber)';
  if (value > 0.3) return 'var(--cyan)';
  return 'var(--green)';
}

export function RiskFactors({ factors, score }: RiskFactorsProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      {FACTOR_NAMES.map(({ key, label }) => {
        const value = factors[key];
        const color = getBarColor(value, key === 'proximity', score);
        return (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px' }}>
            <div style={{ color: 'var(--text-secondary)', width: '90px', flexShrink: 0 }}>{label}</div>
            <div style={{ flex: 1, height: '4px', background: 'var(--bg-void)', borderRadius: '2px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${value * 100}%`,
                  borderRadius: '2px',
                  background: color,
                  transition: 'width 0.5s ease',
                }}
              />
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-primary)', width: '28px', textAlign: 'right', flexShrink: 0 }}>
              {value.toFixed(2)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
