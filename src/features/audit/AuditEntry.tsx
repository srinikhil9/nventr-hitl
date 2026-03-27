import type { AuditEntry, AuditEntryType } from '@/types/audit';

interface AuditEntryItemProps {
  entry: AuditEntry;
}

const BORDER_COLORS: Record<AuditEntryType, string> = {
  command: 'var(--cyan)',
  hitl: 'var(--cyan)',
  repair: 'var(--amber)',
  fidelity: 'var(--amber)',
  estop: 'var(--red)',
  camera: 'var(--text-secondary)',
  session: 'var(--text-secondary)',
};

const TYPE_COLORS: Record<AuditEntryType, string> = {
  command: 'var(--cyan)',
  hitl: 'var(--cyan)',
  repair: 'var(--amber)',
  fidelity: 'var(--amber)',
  estop: 'var(--red)',
  camera: 'var(--text-secondary)',
  session: 'var(--text-secondary)',
};

const TYPE_LABELS: Record<AuditEntryType, string> = {
  command: 'Teleop Command',
  hitl: 'HITL Event',
  repair: 'Robot Report',
  fidelity: 'Fidelity',
  estop: 'E-Stop',
  camera: 'Camera Event',
  session: 'Session',
};

export function AuditEntryItem({ entry }: AuditEntryItemProps) {
  const ts = new Date(entry.ts).toTimeString().slice(0, 8);

  return (
    <div
      style={{
        border: '1px solid var(--border)',
        borderRadius: '2px',
        padding: '8px 10px',
        marginBottom: '5px',
        position: 'relative',
        overflow: 'hidden',
        animation: 'audit-entry-in 0.2s ease',
      }}
    >
      {/* Left border */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '2px',
          background: BORDER_COLORS[entry.type],
        }}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
        <div
          style={{
            fontSize: '9px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.07em',
            color: TYPE_COLORS[entry.type],
          }}
        >
          {TYPE_LABELS[entry.type]}
        </div>
        <div style={{ fontSize: '9px', color: 'var(--text-secondary)' }}>{ts}</div>
      </div>
      <div style={{ fontSize: '9px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
        {entry.body}
      </div>
    </div>
  );
}
