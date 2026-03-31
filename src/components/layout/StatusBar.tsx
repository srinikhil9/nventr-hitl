import type { CSSProperties } from 'react';
import { useStore } from '@/app/store';
import { useSessionTimer } from '@/hooks/useSessionTimer';

export function StatusBar() {
  const session = useStore((s) => s.session);
  const selectedRobotId = useStore((s) => s.selectedRobotId);
  const telemetry = useStore((s) => s.telemetry[selectedRobotId]);
  const risk = useStore((s) => s.riskScores[selectedRobotId]);
  const wsState = useStore((s) => s.wsState);
  const sessionTimer = useSessionTimer(session?.startedAt ?? null);

  const rtt = telemetry?.rttMs ?? 0;
  const fps = telemetry ? 28 : 0;
  const riskLevel = risk?.level ?? 'LOW';
  const riskColor = riskLevel === 'HIGH' ? 'var(--red)' : riskLevel === 'MEDIUM' ? 'var(--amber)' : 'var(--green)';
  const riskDotClass = riskLevel === 'HIGH' ? 'red' : riskLevel === 'MEDIUM' ? 'amber' : 'green';
  const wsConnected = wsState === 'CONNECTED';

  return (
    <div
      style={{
        background: 'var(--bg-base)',
        borderBottom: '1px solid var(--border)',
        height: '34px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        gap: '24px',
        flexShrink: 0,
      }}
    >
      <StatItem dot={wsConnected ? 'green' : 'red'} label="WS" value={wsConnected ? 'LIVE' : 'DOWN'} />
      <Sep />
      <StatItem dot={wsConnected ? 'green' : 'red'} label="VIDEO" value="WebRTC" />
      <Sep />
      <StatItem label="RTT" value={`${rtt}ms`} />
      <Sep />
      <StatItem label="FPS" value={String(fps)} />
      <Sep />
      <StatItem dot={riskDotClass} label="RISK" value={riskLevel} valueColor={riskColor} />
      <Sep />
      <StatItem label="GEOFENCE" value="ZONE-1 ✓" valueColor="var(--green)" />
      <Sep />
      <StatItem label="SESSION" value={sessionTimer} />
      <div style={{ marginLeft: 'auto' }} />
      <StatItem dot="green" label="FMS" value="ONLINE" />
      <Sep />
      <StatItem dot="green" label="AUDIT SVC" value="APPEND-ONLY" />
    </div>
  );
}

function StatItem({
  dot,
  label,
  value,
  valueColor,
}: {
  dot?: 'green' | 'amber' | 'red';
  label: string;
  value: string;
  valueColor?: string;
}) {
  const dotStyles: Record<string, CSSProperties> = {
    green: { background: 'var(--green)', boxShadow: '0 0 6px var(--green)' },
    amber: { background: 'var(--amber)', boxShadow: '0 0 6px var(--amber)', animation: 'blink 1.2s ease-in-out infinite' },
    red: { background: 'var(--red)', boxShadow: '0 0 6px var(--red)' },
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: 'var(--text-secondary)' }}>
      {dot && (
        <div
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            ...dotStyles[dot],
          }}
        />
      )}
      {label}{' '}
      <span
        style={{
          color: valueColor ?? 'var(--text-primary)',
          fontWeight: 500,
          marginLeft: dot ? '2px' : '4px',
        }}
      >
        {value}
      </span>
    </div>
  );
}

function Sep() {
  return <div style={{ width: '1px', height: '16px', background: 'var(--border)' }} />;
}
