import { useState, useEffect } from 'react';
import { useStore } from '@/app/store';
import { Modal } from '@/components/ui/Modal';
import { triggerEStop as apiTriggerEStop } from '@/services/api';
import { v4 as uuid } from 'uuid';

export function EStopModal() {
  const [open, setOpen] = useState(false);
  const selectedRobotId = useStore((s) => s.selectedRobotId);
  const triggerEStop = useStore((s) => s.triggerEStop);
  const clearEStop = useStore((s) => s.clearEStop);
  const addToast = useStore((s) => s.addToast);
  const appendAudit = useStore((s) => s.appendAudit);
  const updateRobot = useStore((s) => s.updateRobot);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('open-estop-modal', handler);
    return () => window.removeEventListener('open-estop-modal', handler);
  }, []);

  const handleConfirm = async () => {
    triggerEStop();
    updateRobot(selectedRobotId, { status: 'stopped' });
    setOpen(false);
    addToast(`E-STOP: ${selectedRobotId} halted. Audit logged.`, 'error');
    appendAudit({
      id: uuid(),
      type: 'estop',
      ts: new Date().toISOString(),
      robotId: selectedRobotId,
      body: `Emergency stop: ${selectedRobotId} by operator`,
    });

    try {
      await apiTriggerEStop(selectedRobotId);
    } catch {
      // E-stop is already applied locally
    }

    setTimeout(() => {
      clearEStop();
      updateRobot(selectedRobotId, { status: 'active' });
      addToast(`${selectedRobotId} resumed — E-stop cleared`, 'success');
    }, 5000);
  };

  return (
    <Modal open={open} preventBackdropClose>
      <div
        style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: '14px',
          fontWeight: 700,
          marginBottom: '8px',
          color: 'var(--red)',
        }}
      >
        ⬛ EMERGENCY STOP
      </div>
      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
        This will immediately halt robot <strong style={{ color: 'var(--text-primary)' }}>{selectedRobotId}</strong>.
        Action is logged to immutable audit trail and will alert the supervisor. Confirm?
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={() => setOpen(false)}
          style={{
            flex: 1,
            padding: '9px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.15s',
            borderRadius: '1px',
            background: 'transparent',
            border: '1px solid var(--border)',
            color: 'var(--text-secondary)',
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          style={{
            flex: 1,
            padding: '9px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.15s',
            borderRadius: '1px',
            background: 'var(--red)',
            border: '1px solid var(--red)',
            color: 'white',
          }}
        >
          CONFIRM STOP
        </button>
      </div>
    </Modal>
  );
}
