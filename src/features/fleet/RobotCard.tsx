import type { CSSProperties } from 'react';
import { useStore } from '@/app/store';
import type { Robot } from '@/types/robot';

interface RobotCardProps {
  robot: Robot;
}

export function RobotCard({ robot }: RobotCardProps) {
  const selectedRobotId = useStore((s) => s.selectedRobotId);
  const setSelectedRobot = useStore((s) => s.setSelectedRobot);
  const addToast = useStore((s) => s.addToast);
  const isSelected = selectedRobotId === robot.id;

  const riskClass = robot.risk > 0.7 ? 'high' : robot.risk > 0.4 ? 'med' : 'low';
  const riskColor = riskClass === 'high' ? 'var(--red)' : riskClass === 'med' ? 'var(--yellow)' : 'var(--green)';
  const borderLeftColor =
    robot.status === 'active' ? 'var(--brand)' :
    robot.status === 'stopped' ? 'var(--red)' :
    'var(--text-dim)';

  const pillLabel = robot.status === 'active' && robot.assignedOperatorId ? 'ASSIGNED' : robot.status.toUpperCase();
  const pillStyle = getPillStyle(robot);

  const handleClick = () => {
    setSelectedRobot(robot.id);
    addToast(`Switched to ${robot.id} · ${robot.type}`, 'info');
  };

  return (
    <div
      onClick={handleClick}
      style={{
        border: `1px solid ${isSelected ? 'var(--brand-border)' : 'var(--border)'}`,
        borderRadius: '12px',
        marginBottom: '8px',
        padding: '11px 12px',
        cursor: 'pointer',
        transition: 'all 0.15s',
        position: 'relative',
        overflow: 'hidden',
        background: isSelected ? 'var(--brand-soft)' : 'var(--bg-base)',
      }}
    >
      {/* Left border indicator */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '3px',
          background: borderLeftColor,
          boxShadow: isSelected ? `0 0 6px ${borderLeftColor}` : 'none',
        }}
      />

      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '0.02em' }}>
          {robot.id}
        </div>
        <span style={pillStyle}>{pillLabel}</span>
      </div>

      {/* Meta */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <MetaItem label="Type" value={robot.type} />
        <MetaItem label="Zone" value={robot.zone} />
        <MetaItem label="Op" value={robot.assignedOperatorId ?? '—'} />
        <MetaItem label="Bat" value={`${Math.round(robot.battery)}%`} />
      </div>

      {/* Risk bar */}
      <div style={{ marginTop: '7px' }}>
        <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
          <span>Risk</span>
          <span>{robot.risk.toFixed(2)}</span>
        </div>
        <div style={{ height: '5px', background: 'var(--bg-void)', borderRadius: '999px', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${robot.risk * 100}%`,
              borderRadius: '999px',
              background: riskColor,
              boxShadow: riskClass === 'high' ? '0 0 6px var(--red)' : 'none',
              transition: 'width 0.4s ease',
            }}
          />
        </div>
      </div>
    </div>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
      {label}: <span style={{ color: 'var(--text-primary)' }}>{value}</span>
    </div>
  );
}

function getPillStyle(robot: Robot): CSSProperties {
  const base: CSSProperties = {
    fontSize: '10px',
    padding: '2px 8px',
    borderRadius: '999px',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    fontWeight: 600,
  };

  if (robot.status === 'active' && robot.assignedOperatorId) {
    return { ...base, background: 'var(--brand-soft)', color: 'var(--brand)', border: '1px solid var(--brand-border)' };
  }
  if (robot.status === 'active') {
    return { ...base, background: 'var(--green-glow)', color: 'var(--green)', border: '1px solid var(--green)' };
  }
  if (robot.status === 'stopped') {
    return { ...base, background: 'var(--red-glow)', color: 'var(--red)', border: '1px solid var(--red)' };
  }
  return { ...base, background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border)' };
}
