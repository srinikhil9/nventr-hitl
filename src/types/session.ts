import type { FidelityLevel } from './fidelity';

export interface HITLSession {
  sessionId: string;
  operatorId: string;
  operatorName: string;
  operatorRole: 'teleop' | 'supervisor' | 'auditor';
  warehouseId: string;
  activeRobotId: string;
  startedAt: string;
  fidelityState: Record<string, FidelityLevel>;
}
