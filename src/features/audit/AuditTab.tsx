import { useStore } from '@/app/store';
import { AuditEntryItem } from './AuditEntry';

export function AuditTab() {
  const auditLog = useStore((s) => s.auditLog);

  return (
    <div style={{ padding: '8px' }}>
      {auditLog.length === 0 && (
        <div style={{ fontSize: '10px', color: 'var(--text-dim)', textAlign: 'center', padding: '20px' }}>
          No audit entries yet
        </div>
      )}
      {auditLog.map((entry) => (
        <AuditEntryItem key={entry.id} entry={entry} />
      ))}
    </div>
  );
}
