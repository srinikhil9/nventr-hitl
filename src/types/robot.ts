export type RobotStatus = 'active' | 'idle' | 'stopped' | 'fault';

export interface Robot {
  id: string;
  type: string;
  zone: string;
  status: RobotStatus;
  assignedOperatorId: string | null;
  battery: number;
  risk: number;
  warehouseId: string;
}
