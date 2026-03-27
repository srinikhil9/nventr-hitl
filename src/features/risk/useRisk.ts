import { useStore } from '@/app/store';

export function useRisk() {
  const selectedRobotId = useStore((s) => s.selectedRobotId);
  const risk = useStore((s) => s.riskScores[selectedRobotId]);
  return { risk, selectedRobotId };
}
