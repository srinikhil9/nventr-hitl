import { useStore } from '@/app/store';

export function useEStop() {
  const estopActive = useStore((s) => s.estopActive);
  const triggerEStop = useStore((s) => s.triggerEStop);
  const clearEStop = useStore((s) => s.clearEStop);
  return { estopActive, triggerEStop, clearEStop };
}
