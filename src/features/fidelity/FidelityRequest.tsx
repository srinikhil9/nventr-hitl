import { useStore } from '@/app/store';
import type { FidelityRequest } from '@/types/fidelity';
import { approveFidelityRequest } from '@/services/api';
import { v4 as uuid } from 'uuid';

interface FidelityRequestCardProps {
  request: FidelityRequest;
}

export function FidelityRequestCard({ request }: FidelityRequestCardProps) {
  const updateFidelityRequest = useStore((s) => s.updateFidelityRequest);
  const addToast = useStore((s) => s.addToast);
  const appendAudit = useStore((s) => s.appendAudit);

  const handleApprove = async () => {
    const prevStatus = request.status;
    updateFidelityRequest(request.requestId, { status: 'approved' });

    try {
      await approveFidelityRequest(request.requestId);
      addToast(`Fidelity ${request.requestId} approved`, 'success');
      appendAudit({
        id: uuid(),
        type: 'fidelity',
        ts: new Date().toISOString(),
        robotId: request.robotId,
        body: `Fidelity ${request.requestId} approved · ${request.robotId} → ${request.level}`,
      });
    } catch {
      updateFidelityRequest(request.requestId, { status: prevStatus });
      addToast('Failed to approve fidelity request', 'error');
    }
  };

  const isPending = request.status === 'pending';
  const statusStyle = isPending
    ? { background: 'var(--amber-glow)', color: 'var(--amber)', border: '1px solid var(--amber-dim)' }
    : { background: 'var(--green-glow)', color: 'var(--green)', border: '1px solid var(--green)' };

  return (
    <div
      style={{
        border: '1px solid var(--border)',
        borderRadius: '2px',
        padding: '10px',
        marginBottom: '6px',
        cursor: 'pointer',
        transition: 'border-color 0.15s',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
        <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--cyan)' }}>{request.requestId}</div>
        <span
          style={{
            fontSize: '9px',
            padding: '1px 6px',
            borderRadius: '1px',
            ...statusStyle,
          }}
        >
          {request.status.toUpperCase()}
        </span>
      </div>
      <div style={{ fontSize: '9px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
        Robot: <strong style={{ color: 'var(--text-primary)' }}>{request.robotId}</strong><br />
        Requester: <span style={{ color: 'var(--text-primary)' }}>{request.requesterId} / {request.requesterRole}</span><br />
        Level: <span style={{ color: 'var(--amber)', fontWeight: 600 }}>{request.level}{request.level === 'MAX' ? ' (full hi-fi)' : ''}</span><br />
        Reason: {request.reason}<br />
        Duration: <span style={{ color: 'var(--text-primary)' }}>{request.durationSeconds}s</span>
      </div>
      {isPending && (
        <button
          onClick={handleApprove}
          style={{
            marginTop: '8px',
            background: 'var(--amber-glow)',
            border: '1px solid var(--amber-dim)',
            color: 'var(--amber)',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '9px',
            fontWeight: 600,
            padding: '5px 10px',
            cursor: 'pointer',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            transition: 'all 0.15s',
            width: '100%',
          }}
        >
          Approve →
        </button>
      )}
    </div>
  );
}
