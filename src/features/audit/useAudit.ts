import { useStore } from '@/app/store';

export function useAudit() {
  const auditLog = useStore((s) => s.auditLog);
  return { auditLog };
}
