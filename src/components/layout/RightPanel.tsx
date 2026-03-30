import { useStore } from '@/app/store';
import type { RightPanelTab } from '@/app/store';
import { TelemetryTab } from '@/features/telemetry/TelemetryTab';
import { RiskTab } from '@/features/risk/RiskTab';
import { AuditTab } from '@/features/audit/AuditTab';
import { FidelityTab } from '@/features/fidelity/FidelityTab';
import { TicketTab } from '@/features/tickets/TicketTab';

const TABS: { id: RightPanelTab; label: string }[] = [
  { id: 'telemetry', label: 'Telemetry' },
  { id: 'risk', label: 'Risk' },
  { id: 'audit', label: 'Audit' },
  { id: 'fidelity', label: 'Fidelity' },
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
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', flexShrink: 0, padding: '6px 6px 0' }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: '9px 8px',
              fontSize: '11px',
              textAlign: 'center',
              color: activeTab === tab.id ? 'var(--brand)' : 'var(--text-secondary)',
              cursor: 'pointer',
              border: `1px solid ${activeTab === tab.id ? 'var(--brand-border)' : 'transparent'}`,
              background: activeTab === tab.id ? 'var(--brand-soft)' : 'transparent',
              borderRadius: '10px 10px 0 0',
              fontWeight: activeTab === tab.id ? 600 : 500,
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
