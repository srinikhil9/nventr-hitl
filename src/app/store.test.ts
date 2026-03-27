import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from './store';
import type { Robot } from '@/types/robot';
import type { TelemetrySnapshot } from '@/types/telemetry';
import type { RiskScore } from '@/types/risk';
import type { Command } from '@/types/command';
import type { AuditEntry } from '@/types/audit';
import type { FidelityRequest } from '@/types/fidelity';

function resetStore() {
  useStore.setState({
    session: null,
    theme: 'dark',
    robots: [],
    selectedRobotId: 'R-001',
    activeFeeds: ['R001-F', 'R001-B'],
    selectedFeedId: 'R001-F',
    layoutMode: 'main',
    telemetry: {},
    rttHistory: {},
    riskScores: {},
    commandLog: [],
    speed: 40,
    auditLog: [],
    fidelityRequests: [],
    estopActive: false,
    activeTab: 'telemetry',
    wsState: 'DISCONNECTED',
    toasts: [],
  });
}

describe('HITLStore', () => {
  beforeEach(resetStore);

  describe('session', () => {
    it('sets session', () => {
      const session = {
        sessionId: 'TOS-001',
        operatorId: 'ID-1001',
        operatorName: 'Alice',
        operatorRole: 'teleop' as const,
        warehouseId: 'WH-CARSON',
        activeRobotId: 'R-001',
        startedAt: '2026-01-01T00:00:00Z',
        fidelityState: {},
      };
      useStore.getState().setSession(session);
      expect(useStore.getState().session).toEqual(session);
    });
  });

  describe('fleet', () => {
    it('sets robots', () => {
      const robots: Robot[] = [
        { id: 'R-001', type: 'AMR', zone: 'Z1', status: 'active', assignedOperatorId: 'ID-1001', battery: 80, risk: 0.3, warehouseId: 'WH-CARSON' },
      ];
      useStore.getState().setRobots(robots);
      expect(useStore.getState().robots).toHaveLength(1);
      expect(useStore.getState().robots[0].id).toBe('R-001');
    });

    it('updates robot', () => {
      useStore.getState().setRobots([
        { id: 'R-001', type: 'AMR', zone: 'Z1', status: 'active', assignedOperatorId: null, battery: 80, risk: 0.3, warehouseId: 'WH-CARSON' },
      ]);
      useStore.getState().updateRobot('R-001', { battery: 50, risk: 0.6 });
      expect(useStore.getState().robots[0].battery).toBe(50);
      expect(useStore.getState().robots[0].risk).toBe(0.6);
    });

    it('selects robot', () => {
      useStore.getState().setSelectedRobot('R-002');
      expect(useStore.getState().selectedRobotId).toBe('R-002');
    });
  });

  describe('camera feeds', () => {
    it('adds feed', () => {
      useStore.getState().addFeed('R002-F');
      expect(useStore.getState().activeFeeds).toContain('R002-F');
      expect(useStore.getState().selectedFeedId).toBe('R002-F');
    });

    it('does not add duplicate feed', () => {
      useStore.getState().addFeed('R001-F');
      expect(useStore.getState().activeFeeds.filter((f) => f === 'R001-F')).toHaveLength(1);
    });

    it('removes feed', () => {
      useStore.getState().addFeed('R002-F');
      useStore.getState().removeFeed('R001-B');
      expect(useStore.getState().activeFeeds).not.toContain('R001-B');
    });

    it('does not remove last feed', () => {
      useStore.setState({ activeFeeds: ['R001-F'], selectedFeedId: 'R001-F' });
      useStore.getState().removeFeed('R001-F');
      expect(useStore.getState().activeFeeds).toHaveLength(1);
    });

    it('cycles layout', () => {
      useStore.getState().setLayout('2h');
      expect(useStore.getState().layoutMode).toBe('2h');
      useStore.getState().setLayout('4');
      expect(useStore.getState().layoutMode).toBe('4');
    });
  });

  describe('telemetry', () => {
    it('updates telemetry snapshot', () => {
      const snap: TelemetrySnapshot = {
        robotId: 'R-001',
        ts: '2026-01-01T00:00:00Z',
        speedMs: 0.5,
        headingDeg: 45,
        xPos: 10,
        yPos: 7,
        batteryPct: 80,
        cpuPct: 45,
        memMb: 512,
        netUpMbs: 3,
        netDownMbs: 0.3,
        rttMs: 150,
        packetLossPct: 0.1,
        healthFlags: [],
      };
      useStore.getState().updateTelemetry(snap);
      expect(useStore.getState().telemetry['R-001']).toEqual(snap);
      expect(useStore.getState().rttHistory['R-001']).toEqual([150]);
    });

    it('caps RTT history at 30', () => {
      for (let i = 0; i < 35; i++) {
        useStore.getState().updateTelemetry({
          robotId: 'R-001',
          ts: `2026-01-01T00:00:${String(i).padStart(2, '0')}Z`,
          speedMs: 0.5,
          headingDeg: 45,
          xPos: 10,
          yPos: 7,
          batteryPct: 80,
          cpuPct: 45,
          memMb: 512,
          netUpMbs: 3,
          netDownMbs: 0.3,
          rttMs: 100 + i,
          packetLossPct: 0.1,
          healthFlags: [],
        });
      }
      expect(useStore.getState().rttHistory['R-001']).toHaveLength(30);
    });
  });

  describe('risk', () => {
    it('updates risk score', () => {
      const risk: RiskScore = {
        score: 0.65,
        level: 'MEDIUM',
        factors: { proximity: 0.8, cmdVelocity: 0.5, operatorHistory: 0.2, pathDeviation: 0.1, cameraQuality: 0.1 },
        xaiSummary: 'test',
        robotId: 'R-001',
        ts: '2026-01-01T00:00:00Z',
      };
      useStore.getState().updateRisk(risk);
      expect(useStore.getState().riskScores['R-001']).toEqual(risk);
    });
  });

  describe('commands', () => {
    it('appends command', () => {
      const cmd: Command = {
        id: 'cmd-1',
        timestamp: '2026-01-01T00:00:00Z',
        verb: 'forward',
        robotId: 'R-001',
        operatorId: 'ID-1001',
        riskAtSend: 0.3,
        speedMs: 0.4,
        status: 'sent',
        geofenceValid: true,
      };
      useStore.getState().appendCommand(cmd);
      expect(useStore.getState().commandLog).toHaveLength(1);
      expect(useStore.getState().commandLog[0].verb).toBe('forward');
    });

    it('updates command status', () => {
      const cmd: Command = {
        id: 'cmd-1',
        timestamp: '2026-01-01T00:00:00Z',
        verb: 'forward',
        robotId: 'R-001',
        operatorId: 'ID-1001',
        riskAtSend: 0.3,
        speedMs: 0.4,
        status: 'sent',
        geofenceValid: true,
      };
      useStore.getState().appendCommand(cmd);
      useStore.getState().updateCommandStatus('cmd-1', 'ack');
      expect(useStore.getState().commandLog[0].status).toBe('ack');
    });

    it('caps command log at 100', () => {
      for (let i = 0; i < 105; i++) {
        useStore.getState().appendCommand({
          id: `cmd-${i}`,
          timestamp: '2026-01-01T00:00:00Z',
          verb: 'forward',
          robotId: 'R-001',
          operatorId: 'ID-1001',
          riskAtSend: 0.3,
          speedMs: 0.4,
          status: 'sent',
          geofenceValid: true,
        });
      }
      expect(useStore.getState().commandLog.length).toBeLessThanOrEqual(100);
    });
  });

  describe('audit', () => {
    it('appends audit entry (prepend)', () => {
      const entry: AuditEntry = {
        id: 'aud-1',
        type: 'command',
        ts: '2026-01-01T00:00:00Z',
        body: 'test command',
      };
      useStore.getState().appendAudit(entry);
      expect(useStore.getState().auditLog).toHaveLength(1);
      expect(useStore.getState().auditLog[0].body).toBe('test command');
    });

    it('prepends newest first', () => {
      useStore.getState().appendAudit({ id: 'a1', type: 'command', ts: '2026-01-01T00:00:00Z', body: 'first' });
      useStore.getState().appendAudit({ id: 'a2', type: 'estop', ts: '2026-01-01T00:00:01Z', body: 'second' });
      expect(useStore.getState().auditLog[0].body).toBe('second');
    });
  });

  describe('fidelity', () => {
    it('sets fidelity requests', () => {
      const reqs: FidelityRequest[] = [
        { requestId: 'REQ-1', robotId: 'R-001', requesterId: 'ID-1001', requesterRole: 'Teleop', level: 'MAX', reason: 'test', durationSeconds: 300, status: 'pending' },
      ];
      useStore.getState().setFidelityRequests(reqs);
      expect(useStore.getState().fidelityRequests).toHaveLength(1);
    });

    it('updates fidelity request', () => {
      useStore.getState().setFidelityRequests([
        { requestId: 'REQ-1', robotId: 'R-001', requesterId: 'ID-1001', requesterRole: 'Teleop', level: 'MAX', reason: 'test', durationSeconds: 300, status: 'pending' },
      ]);
      useStore.getState().updateFidelityRequest('REQ-1', { status: 'approved' });
      expect(useStore.getState().fidelityRequests[0].status).toBe('approved');
    });
  });

  describe('estop', () => {
    it('triggers and clears estop', () => {
      expect(useStore.getState().estopActive).toBe(false);
      useStore.getState().triggerEStop();
      expect(useStore.getState().estopActive).toBe(true);
      useStore.getState().clearEStop();
      expect(useStore.getState().estopActive).toBe(false);
    });
  });

  describe('tabs', () => {
    it('switches active tab', () => {
      useStore.getState().setActiveTab('risk');
      expect(useStore.getState().activeTab).toBe('risk');
    });
  });

  describe('toasts', () => {
    it('adds and removes toast', () => {
      useStore.getState().addToast('test message', 'info');
      expect(useStore.getState().toasts).toHaveLength(1);
      const id = useStore.getState().toasts[0].id;
      useStore.getState().removeToast(id);
      expect(useStore.getState().toasts).toHaveLength(0);
    });
  });

  describe('speed', () => {
    it('sets speed', () => {
      useStore.getState().setSpeed(75);
      expect(useStore.getState().speed).toBe(75);
    });
  });
});
