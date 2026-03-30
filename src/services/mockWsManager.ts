import { useStore } from '@/app/store';
import type { TelemetrySnapshot } from '@/types/telemetry';
import type { RiskScore, RiskLevel } from '@/types/risk';
import type { AuditEntry, AuditEntryType } from '@/types/audit';
import type { Robot } from '@/types/robot';
import type { FidelityRequest } from '@/types/fidelity';
import { v4 as uuid } from 'uuid';

const INITIAL_ROBOTS: Robot[] = [
  { id: 'R-001', type: 'AMR Jack', zone: 'Z1', status: 'active', assignedOperatorId: 'ID-2101', battery: 74, risk: 0.38, warehouseId: 'WH-CARSON' },
  { id: 'R-002', type: 'AMR Jack', zone: 'Z2', status: 'active', assignedOperatorId: 'ID-2102', battery: 88, risk: 0.14, warehouseId: 'WH-CARSON' },
  { id: 'R-003', type: 'Forklift AMR', zone: 'Z3', status: 'stopped', assignedOperatorId: null, battery: 31, risk: 0.0, warehouseId: 'WH-CARSON' },
  { id: 'R-004', type: 'Arm AGV', zone: 'Z1', status: 'idle', assignedOperatorId: null, battery: 95, risk: 0.06, warehouseId: 'WH-CARSON' },
];

const INITIAL_FIDELITY: FidelityRequest[] = [
  {
    requestId: 'REQ-0091',
    robotId: 'R-001',
    requesterId: 'ID-2101',
    requesterRole: 'Teleop',
    level: 'MAX',
    reason: 'anomaly review',
    durationSeconds: 300,
    status: 'pending',
  },
  {
    requestId: 'REQ-0088',
    robotId: 'R-002',
    requesterId: 'ID-2102',
    requesterRole: 'Teleop',
    level: 'MEDIUM',
    reason: 'routine inspection',
    durationSeconds: 180,
    status: 'approved',
    approvedBy: 'SV-001',
  },
];

const INITIAL_AUDIT: AuditEntry[] = [
  { id: uuid(), type: 'command', ts: '2026-03-26T14:22:07Z', robotId: 'R-001', operatorId: 'ID-2101', body: 'forward · R-001 · op:MC · risk:0.42 · FLAGGED' },
  { id: uuid(), type: 'repair', ts: '2026-03-26T14:18:33Z', robotId: 'R-003', body: 'R-003 marked inactive — encoder fault. Repair ticket auto-created.' },
  { id: uuid(), type: 'estop', ts: '2026-03-26T13:55:01Z', robotId: 'R-002', operatorId: 'ID-2102', body: 'Robot R-002 emergency stopped by op:DP. Resumed 13:55:48.' },
  { id: uuid(), type: 'camera', ts: '2026-03-26T13:42:15Z', body: 'C-004 feed loss — duration 23s. Auto-escalated to supervisor.' },
  { id: uuid(), type: 'session', ts: '2026-03-26T13:40:00Z', operatorId: 'ID-2101', body: 'Session TOS-4471 opened · op:MC · R-001 · WH-CARSON' },
];

let telemetryInterval: ReturnType<typeof setInterval> | null = null;
let riskInterval: ReturnType<typeof setInterval> | null = null;
let auditInterval: ReturnType<typeof setInterval> | null = null;

export function startMockStreams() {
  const store = useStore.getState();

  store.setRobots(INITIAL_ROBOTS);
  store.setFidelityRequests(INITIAL_FIDELITY);
  INITIAL_AUDIT.forEach((entry) => store.appendAudit(entry));
  store.setWsState('CONNECTED');

  store.setSession({
    sessionId: 'TOS-4471',
    operatorId: 'ID-2101',
    operatorName: 'Maya Chen',
    operatorRole: 'teleop',
    warehouseId: 'WH-CARSON',
    activeRobotId: 'R-001',
    startedAt: new Date().toISOString(),
    fidelityState: { 'R-001': 'MAX', 'R-002': 'MEDIUM', 'R-004': 'LOW' },
  });

  telemetryInterval = setInterval(() => {
    const robots = useStore.getState().robots;
    robots.forEach((robot) => {
      if (robot.status === 'stopped') return;
      const snap: TelemetrySnapshot = {
        robotId: robot.id,
        ts: new Date().toISOString(),
        speedMs: parseFloat((0.2 + Math.random() * 0.6).toFixed(2)),
        headingDeg: Math.floor(40 + Math.random() * 20),
        xPos: parseFloat((10 + Math.random() * 8).toFixed(1)),
        yPos: parseFloat((7 + Math.random() * 4).toFixed(1)),
        batteryPct: Math.max(0, robot.battery - 0.01),
        cpuPct: Math.floor(35 + Math.random() * 30),
        memMb: Math.floor(512 + Math.random() * 256),
        netUpMbs: parseFloat((2.5 + Math.random() * 1.5).toFixed(1)),
        netDownMbs: parseFloat((0.2 + Math.random() * 0.5).toFixed(1)),
        rttMs: Math.floor(120 + Math.random() * 80),
        packetLossPct: parseFloat((Math.random() * 0.5).toFixed(1)),
        healthFlags: [],
      };
      useStore.getState().updateTelemetry(snap);
      useStore.getState().updateRobot(robot.id, { battery: snap.batteryPct });
    });
  }, 500);

  riskInterval = setInterval(() => {
    const robots = useStore.getState().robots;
    robots.forEach((robot) => {
      if (robot.status === 'stopped') return;
      const score = parseFloat((0.1 + Math.random() * 0.6).toFixed(2));
      const level: RiskLevel = score > 0.7 ? 'HIGH' : score > 0.4 ? 'MEDIUM' : 'LOW';
      const prox = Math.min(0.95, score * 1.4 + Math.random() * 0.1);
      const riskScore: RiskScore = {
        score,
        level,
        factors: {
          proximity: parseFloat(prox.toFixed(2)),
          cmdVelocity: parseFloat((score * 0.9 + Math.random() * 0.1).toFixed(2)),
          operatorHistory: parseFloat((0.15 + Math.random() * 0.15).toFixed(2)),
          pathDeviation: parseFloat((0.1 + Math.random() * 0.15).toFixed(2)),
          cameraQuality: parseFloat((0.05 + Math.random() * 0.12).toFixed(2)),
        },
        xaiSummary: score > 0.5
          ? '⚠ Elevated proximity score detected — human worker within 3.2m of robot path. Recommend reduce speed or pause operation. Operator history: nominal.'
          : 'All risk factors within normal operating parameters. Proximity clear, path deviation minimal.',
        robotId: robot.id,
        ts: new Date().toISOString(),
      };
      useStore.getState().updateRisk(riskScore);
      useStore.getState().updateRobot(robot.id, { risk: score });
    });
  }, 1500);

  const auditTypes: AuditEntryType[] = ['command', 'hitl', 'camera', 'fidelity'];
  const auditBodies = [
    'Teleop command: forward · R-001 · op:AK · risk:0.22 · safe',
    'Teleops override: speed reduced to 0.2 m/s by supervisor',
    'Camera R001-F: brief quality degradation (2.1s)',
    'Fidelity check: R-002 stream verified at MEDIUM level',
  ];

  auditInterval = setInterval(() => {
    const typeIdx = Math.floor(Math.random() * auditTypes.length);
    const entry: AuditEntry = {
      id: uuid(),
      type: auditTypes[typeIdx],
      ts: new Date().toISOString(),
      robotId: 'R-001',
      operatorId: 'ID-2101',
      body: auditBodies[typeIdx],
    };
    useStore.getState().appendAudit(entry);
  }, 30000);
}

export function stopMockStreams() {
  if (telemetryInterval) clearInterval(telemetryInterval);
  if (riskInterval) clearInterval(riskInterval);
  if (auditInterval) clearInterval(auditInterval);
  telemetryInterval = null;
  riskInterval = null;
  auditInterval = null;
}
