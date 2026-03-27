export type CommandVerb = 'forward' | 'backward' | 'left' | 'right' | 'stop';
export type CommandStatus = 'sent' | 'ack' | 'blocked' | 'estop';

export interface Command {
  id: string;
  timestamp: string;
  verb: CommandVerb;
  robotId: string;
  operatorId: string;
  riskAtSend: number;
  speedMs: number;
  status: CommandStatus;
  geofenceValid: boolean;
}
