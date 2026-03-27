import { useEffect } from 'react';
import { useStore } from '@/app/store';

export function useFleet() {
  const robots = useStore((s) => s.robots);
  const selectedRobotId = useStore((s) => s.selectedRobotId);
  const setSelectedRobot = useStore((s) => s.setSelectedRobot);

  useEffect(() => {
    if (robots.length > 0 && !robots.find((r) => r.id === selectedRobotId)) {
      setSelectedRobot(robots[0].id);
    }
  }, [robots, selectedRobotId, setSelectedRobot]);

  return { robots, selectedRobotId, setSelectedRobot };
}
