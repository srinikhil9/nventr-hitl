import { useStore } from '@/app/store';
import type { RightPanelTab } from '@/app/store';
import { TelemetryTab } from '@/features/telemetry/TelemetryTab';
import { RiskTab } from '@/features/risk/RiskTab';
import { AuditTab } from '@/features/audit/AuditTab';
import { FidelityTab } from '@/features/fidelity/FidelityTab';
import { TicketTab } from '@/features/tickets/TicketTab';

const TABS: { id: RightPanelTab; label: string }[] = [
  { id: 'telemetry', label: 'Telem' },
  { id: 'risk', label: 'Risk' },
  { id: 'audit', label: 'Audit' },
  { id: 'fidelity', label: 'Fidel' },
  { id: 'ticket', label: 'Ticket' },
];

export function RightPanel() {
  const activeTab = useStore((s) => s.activeTab);
  const setActiveTab = useStore((s) => s.setActiveTab);

  return (
    <div
      style={{
        background: 'var(--bg-panel)',
        borderLeft: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Tab bar */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: '9px 6px',
              fontSize: '9px',
              textAlign: 'center',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: activeTab === tab.id ? 'var(--amber)' : 'var(--text-secondary)',
              cursor: 'pointer',
              borderBottom: `2px solid ${activeTab === tab.id ? 'var(--amber)' : 'transparent'}`,
              background: activeTab === tab.id ? 'var(--amber-glow)' : 'transparent',
              border: 'none',
              borderBottomWidth: '2px',
              borderBottomStyle: 'solid',
              borderBottomColor: activeTab === tab.id ? 'var(--amber)' : 'transparent',
              fontFamily: "'JetBrains Mono', monospace",
              transition: 'all 0.15s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {activeTab === 'telemetry' && <TelemetryTab />}
        {activeTab === 'risk' && <RiskTab />}
        {activeTab === 'audit' && <AuditTab />}
        {activeTab === 'fidelity' && <FidelityTab />}
        {activeTab === 'ticket' && <TicketTab />}
      </div>
    </div>
  );
}
