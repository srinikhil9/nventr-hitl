import { useStore } from '@/app/store';
import { useClock } from '@/hooks/useClock';
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
        height: '52px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        gap: '14px',
        flexShrink: 0,
        position: 'relative',
      }}
    >
      <div
        style={{
          fontSize: '18px',
          fontWeight: 700,
          color: 'var(--brand)',
        }}
      >
        Operations
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: '8px' }}>
        <SessionBadge label="SESSION" value={session?.sessionId ?? '—'} />
        <SessionBadge label="SITE" value={session?.warehouseId ?? '—'} />
        <SessionBadge label="ROBOT" value={selectedRobotId} />
      </div>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: 'var(--text-secondary)' }}>
          <div
            style={{
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              background: 'var(--brand)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '9px',
              fontWeight: 700,
              color: '#fff',
            }}
          >
            {session?.operatorName ? getInitials(session.operatorName) : 'OP'}
          </div>
          <div>
            <div style={{ fontSize: '10px', color: 'var(--text-primary)' }}>{session?.operatorName ?? 'Teleops Operator'}</div>
            <div style={{ fontSize: '9px', color: 'var(--text-secondary)' }}>{session?.operatorId ?? '—'}</div>
          </div>
          <div
            style={{
              background: 'var(--amber-glow)',
              border: '1px solid var(--brand-border)',
              color: 'var(--brand)',
              fontSize: '9px',
              padding: '2px 7px',
              borderRadius: '999px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Teleops
          </div>
        </div>

        <div
          style={{
            fontSize: '11px',
            color: 'var(--brand)',
            letterSpacing: '0.05em',
            opacity: 0.8,
          }}
        >
          {clock}
        </div>

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
        padding: '4px 10px',
        borderRadius: '999px',
        fontSize: '10px',
        color: 'var(--text-secondary)',
        letterSpacing: '0.05em',
      }}
    >
      {label}{' '}
      <strong style={{ color: 'var(--brand)', fontWeight: 600 }}>{value}</strong>
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
