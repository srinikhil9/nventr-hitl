import { useRef, useEffect } from 'react';
import { useStore } from '@/app/store';

export function CommandLog() {
  const commandLog = useStore((s) => s.commandLog);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [commandLog.length]);

  return (
    <div
      ref={scrollRef}
      style={{
        flex: 1,
        background: 'var(--bg-void)',
        border: '1px solid var(--border)',
        padding: '6px 8px',
        overflowY: 'auto',
        maxHeight: '64px',
        borderRadius: '2px',
      }}
    >
      {commandLog.length === 0 && (
        <div style={{ fontSize: '9px', color: 'var(--text-dim)' }}>No commands yet</div>
      )}
      {commandLog.map((cmd) => {
        const ts = new Date(cmd.timestamp).toTimeString().slice(0, 8);
        const isBlocked = cmd.status === 'blocked' || cmd.status === 'estop';
        const isWarn = cmd.riskAtSend > 0.4 && !isBlocked;
        const cls = isBlocked ? 'var(--red)' : isWarn ? 'var(--amber)' : 'var(--green)';
        const icon = isBlocked ? '✗' : isWarn ? '⚠' : '✓';
        const note = isBlocked ? (cmd.status === 'estop' ? 'E-STOP' : 'BLOCKED') : isWarn ? 'elevated' : 'safe';

        return (
          <div key={cmd.id} style={{ fontSize: '9px', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
            <span style={{ color: 'var(--cyan-dim)' }}>{ts}</span>{' '}
            <span style={{ color: cls }}>{icon}</span>{' '}
            {cmd.verb} · risk:{cmd.riskAtSend.toFixed(2)} · {note}
          </div>
        );
      })}
    </div>
  );
}
