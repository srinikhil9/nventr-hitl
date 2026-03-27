export type AuditEntryType = 'command' | 'estop' | 'repair' | 'camera' | 'fidelity' | 'session' | 'hitl';

export interface AuditEntry {
  id: string;
  type: AuditEntryType;
  ts: string;
  robotId?: string;
  operatorId?: string;
  body: string;
  checksum?: string;
}
