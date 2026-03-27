import { useStore } from '@/app/store';
import type { AuditEntry } from '@/types/audit';

export function ingest(payload: unknown) {
  const entry = payload as AuditEntry;
  if (!entry.id) return;
  useStore.getState().appendAudit(entry);
}
