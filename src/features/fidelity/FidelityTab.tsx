import { useStore } from '@/app/store';
import { FidelityRequestCard } from './FidelityRequest';

export function FidelityTab() {
  const fidelityRequests = useStore((s) => s.fidelityRequests);
  const session = useStore((s) => s.session);

  return (
    <div style={{ padding: '12px' }}>
      <div
        style={{
          fontSize: '10px',
          color: 'var(--text-secondary)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginBottom: '10px',
        }}
      >
        Fidelity Requests
      </div>

      {fidelityRequests.map((req) => (
        <FidelityRequestCard key={req.requestId} request={req} />
      ))}

      {/* Current Fidelity State */}
      <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
        <div
          style={{
            fontSize: '10px',
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: '10px',
          }}
        >
          Current Fidelity State
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '10px' }}>
          {session?.fidelityState && Object.entries(session.fidelityState).map(([robotId, level]) => {
            const color = level === 'MAX' ? 'var(--amber)' : level === 'MEDIUM' ? 'var(--cyan)' : 'var(--text-secondary)';
            const suffix = level === 'LOW' ? ' (idle)' : '';
            return (
              <div
                key={robotId}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '5px 0',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                <span style={{ color: 'var(--text-secondary)' }}>{robotId} stream</span>
                <span style={{ color }}>{level}{suffix}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
