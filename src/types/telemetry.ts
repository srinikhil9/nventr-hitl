export interface TelemetrySnapshot {
  robotId: string;
  ts: string;
  speedMs: number;
  headingDeg: number;
  xPos: number;
  yPos: number;
  batteryPct: number;
  cpuPct: number;
  memMb: number;
  netUpMbs: number;
  netDownMbs: number;
  rttMs: number;
  packetLossPct: number;
  healthFlags: string[];
}
