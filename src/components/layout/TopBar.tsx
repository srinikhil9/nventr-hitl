import { useStore } from '@/app/store';
import { useClock } from '@/hooks/useClock';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { EStopButton } from '@/features/estop/EStopButton';

export function TopBar() {
  const session = useStore((s) => s.session);
  const selectedRobotId = useStore((s) => s.selectedRobotId);
  const clock = useClock();

  return (
    <div
      style={{
        background: 'var(--bg-base)',
        borderBottom: '1px solid var(--border)',
        height: '44px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        gap: '20px',
        flexShrink: 0,
        position: 'relative',
      }}
    >
      {/* Logo */}
      <div
        style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800,
          fontSize: '15px',
          letterSpacing: '0.08em',
          color: 'var(--amber)',
          textTransform: 'uppercase',
        }}
      >
        nventr{' '}
        <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>/ hitl</span>
      </div>

      {/* Session info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: '8px' }}>
        <SessionBadge label="SESSION" value={session?.sessionId ?? '—'} />
        <SessionBadge label="SITE" value={session?.warehouseId ?? '—'} />
        <SessionBadge label="ROBOT" value={selectedRobotId} />
      </div>

      {/* Right side */}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Operator tag */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: 'var(--text-secondary)' }}>
          <div
            style={{
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--amber-dim), var(--amber))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '9px',
              fontWeight: 700,
              color: '#000',
            }}
          >
            {session?.operatorName ? getInitials(session.operatorName) : 'OP'}
          </div>
          <div>
            <div style={{ fontSize: '10px', color: 'var(--text-primary)' }}>{session?.operatorName ?? 'Operator'}</div>
            <div style={{ fontSize: '9px', color: 'var(--text-secondary)' }}>{session?.operatorId ?? '—'}</div>
          </div>
          <div
            style={{
              background: 'var(--amber-glow)',
              border: '1px solid var(--amber-dim)',
              color: 'var(--amber)',
              fontSize: '9px',
              padding: '2px 7px',
              borderRadius: '2px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            HITL Op
          </div>
        </div>

        {/* Clock */}
        <div
          style={{
            fontSize: '11px',
            color: 'var(--cyan)',
            letterSpacing: '0.05em',
            opacity: 0.8,
          }}
        >
          {clock}
        </div>

        <ThemeToggle />
        <EStopButton />
      </div>
    </div>
  );
}

function SessionBadge({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        padding: '3px 10px',
        borderRadius: '2px',
        fontSize: '10px',
        color: 'var(--text-secondary)',
        letterSpacing: '0.05em',
      }}
    >
      {label}{' '}
      <strong style={{ color: 'var(--cyan)', fontWeight: 600 }}>{value}</strong>
    </div>
  );
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
