import { useStore } from '@/app/store';

export function useTickets() {
  const robots = useStore((s) => s.robots);
  const addToast = useStore((s) => s.addToast);
  const appendAudit = useStore((s) => s.appendAudit);
  return { robots, addToast, appendAudit };
}
