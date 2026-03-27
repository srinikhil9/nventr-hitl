import { useStore } from '@/app/store';
import { RobotCard } from './RobotCard';
import { OperatorList } from './OperatorList';

export function FleetPanel() {
  const robots = useStore((s) => s.robots);

  return (
    <div
      style={{
        background: 'var(--bg-panel)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '10px 14px 8px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--text-secondary)',
          }}
        >
          Fleet
        </div>
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            fontSize: '9px',
            padding: '1px 6px',
            color: 'var(--text-secondary)',
            borderRadius: '10px',
          }}
        >
          {robots.length} robots
        </div>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '6px',
        }}
      >
        {robots.map((robot) => (
          <RobotCard key={robot.id} robot={robot} />
        ))}
      </div>

      <OperatorList />
    </div>
  );
}
