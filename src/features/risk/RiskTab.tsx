import { useStore } from '@/app/store';
import { RiskScoreDisplay } from './RiskScore';
import { RiskFactors } from './RiskFactors';
import { XaiSummary } from './XaiSummary';

export function RiskTab() {
  const selectedRobotId = useStore((s) => s.selectedRobotId);
  const risk = useStore((s) => s.riskScores[selectedRobotId]);

  if (!risk) {
    return (
      <div style={{ padding: '20px', fontSize: '10px', color: 'var(--text-dim)', textAlign: 'center' }}>
        Waiting for risk data...
      </div>
    );
  }

  return (
    <div>
      {/* Risk score */}
      <div style={{ padding: '12px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: '9px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
          Operational Risk Score
        </div>
        <RiskScoreDisplay score={risk.score} level={risk.level} />
        <RiskFactors factors={risk.factors} score={risk.score} />
      </div>

      {/* XAI Summary */}
      <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: '9px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
          XAI Summary
        </div>
        <XaiSummary summary={risk.xaiSummary} />
      </div>

      {/* Policy Enforcement */}
      <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: '9px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
          Policy Enforcement
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <PolicyRow label="Active path" value="ZONE-1/ROUTE-A" color="var(--cyan)" />
          <PolicyRow label="Policy path" value="ZONE-1/ROUTE-A ✓" color="var(--green)" />
          <PolicyRow label="Geofence" value="COMPLIANT" color="var(--green)" noBorder />
        </div>
      </div>
    </div>
  );
}

function PolicyRow({ label, value, color, noBorder }: { label: string; value: string; color: string; noBorder?: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '10px',
        padding: '5px 0',
        borderBottom: noBorder ? 'none' : '1px solid var(--border)',
      }}
    >
      <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
      <span style={{ color }}>{value}</span>
    </div>
  );
}
