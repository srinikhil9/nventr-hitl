export type FidelityLevel = 'LOW' | 'MEDIUM' | 'MAX';
export type FidelityStatus = 'pending' | 'approved' | 'rejected' | 'expired';

export interface FidelityRequest {
  requestId: string;
  robotId: string;
  requesterId: string;
  requesterRole: string;
  level: FidelityLevel;
  reason: string;
  durationSeconds: number;
  status: FidelityStatus;
  startTs?: string;
  endTs?: string;
  approvedBy?: string;
}
