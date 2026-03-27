import { useStore } from '@/app/store';

export function useTelemetry() {
  const selectedRobotId = useStore((s) => s.selectedRobotId);
  const telemetry = useStore((s) => s.telemetry[selectedRobotId]);
  const rttHistory = useStore((s) => s.rttHistory[selectedRobotId] ?? []);

  return { telemetry, rttHistory, selectedRobotId };
}
