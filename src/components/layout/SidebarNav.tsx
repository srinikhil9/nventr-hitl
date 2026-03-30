import { useStore } from '@/app/store';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

export type WorkspaceView = 'overview' | 'fleet' | 'telemetry' | 'risk';

const NAV_ITEMS: Array<{ id: WorkspaceView; label: string }> = [
  { id: 'overview', label: 'Overview' },
  { id: 'fleet', label: 'Fleet Ops' },
  { id: 'telemetry', label: 'Telemetry' },
  { id: 'risk', label: 'Risk & Safety' },
];

export function SidebarNav({
  activeView,
  onSelectView,
}: {
  activeView: WorkspaceView;
  onSelectView: (view: WorkspaceView) => void;
}) {
  const session = useStore((s) => s.session);
  const selectedRobotId = useStore((s) => s.selectedRobotId);
  const wsState = useStore((s) => s.wsState);

  return (
    <aside
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          padding: '18px 16px 14px',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--brand)' }}>Nventr</div>
        <div style={{ marginTop: '2px', fontSize: '12px', color: 'var(--text-secondary)' }}>Teleops Console</div>
      </div>

      <div style={{ padding: '12px', display: 'grid', gap: '6px' }}>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectView(item.id)}
            style={{
              border: '1px solid var(--border)',
              background: item.id === activeView ? 'var(--brand-soft)' : 'var(--bg-base)',
              color: item.id === activeView ? 'var(--brand)' : 'var(--text-primary)',
              borderRadius: '10px',
              padding: '10px 11px',
              textAlign: 'left',
              fontSize: '13px',
              fontWeight: item.id === activeView ? 600 : 500,
              cursor: 'pointer',
              transition: 'all 0.12s',
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', padding: '14px 12px' }}>
        <div
          style={{
            border: '1px solid var(--border)',
            borderRadius: '10px',
            background: 'var(--bg-base)',
            padding: '10px',
            marginBottom: '10px',
          }}
        >
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Session</div>
          <div style={{ marginTop: '2px', fontSize: '13px', color: 'var(--text-primary)', fontWeight: 600 }}>
            {session?.sessionId ?? '—'}
          </div>
          <div style={{ marginTop: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            Robot {selectedRobotId}
          </div>
          <div style={{ marginTop: '4px', fontSize: '12px', color: wsState === 'CONNECTED' ? 'var(--green)' : 'var(--red)' }}>
            {wsState}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Theme</span>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
