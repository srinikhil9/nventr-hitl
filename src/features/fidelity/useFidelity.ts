import { useStore } from '@/app/store';

export function useFidelity() {
  const fidelityRequests = useStore((s) => s.fidelityRequests);
  const updateFidelityRequest = useStore((s) => s.updateFidelityRequest);
  return { fidelityRequests, updateFidelityRequest };
}
