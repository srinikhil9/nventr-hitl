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
          padding: '12px 14px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: 'var(--text-secondary)',
          }}
        >
          Fleet
        </div>
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            fontSize: '11px',
            padding: '2px 8px',
            color: 'var(--text-secondary)',
            borderRadius: '999px',
          }}
        >
          {robots.length} robots
        </div>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '10px',
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
