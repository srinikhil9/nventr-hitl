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
  const riskColor = riskClass === 'high' ? 'var(--red)' : riskClass === 'med' ? 'var(--amber)' : 'var(--green)';
  const borderLeftColor =
    robot.status === 'active' ? 'var(--amber)' :
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
        border: `1px solid ${isSelected ? 'var(--amber-dim)' : robot.status === 'stopped' ? '#2d1515' : 'var(--border)'}`,
        borderRadius: '3px',
        marginBottom: '6px',
        padding: '9px 10px',
        cursor: 'pointer',
        transition: 'all 0.15s',
        position: 'relative',
        overflow: 'hidden',
        background: isSelected ? 'var(--bg-card)' : 'transparent',
      }}
    >
      {/* Left border indicator */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '2px',
          background: borderLeftColor,
          boxShadow: isSelected ? `0 0 8px ${borderLeftColor}` : 'none',
        }}
      />

      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '0.04em' }}>
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
        <div style={{ fontSize: '9px', color: 'var(--text-secondary)', marginBottom: '3px', display: 'flex', justifyContent: 'space-between' }}>
          <span>Risk</span>
          <span>{robot.risk.toFixed(2)}</span>
        </div>
        <div style={{ height: '3px', background: 'var(--bg-void)', borderRadius: '2px', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${robot.risk * 100}%`,
              borderRadius: '2px',
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
    <div style={{ fontSize: '9px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '3px' }}>
      {label}: <span style={{ color: 'var(--text-primary)' }}>{value}</span>
    </div>
  );
}

function getPillStyle(robot: Robot): CSSProperties {
  const base: CSSProperties = {
    fontSize: '9px',
    padding: '1px 6px',
    borderRadius: '1px',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    fontWeight: 600,
  };

  if (robot.status === 'active' && robot.assignedOperatorId) {
    return { ...base, background: 'var(--amber-glow)', color: 'var(--amber)', border: '1px solid var(--amber-dim)' };
  }
  if (robot.status === 'active') {
    return { ...base, background: 'var(--green-glow)', color: 'var(--green)', border: '1px solid var(--green)' };
  }
  if (robot.status === 'stopped') {
    return { ...base, background: 'var(--red-glow)', color: 'var(--red)', border: '1px solid var(--red)' };
  }
  return { ...base, background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border)' };
}
