import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from '@/app/store';
import { ingest } from './telemetryService';

function resetStore() {
  useStore.setState({ telemetry: {}, rttHistory: {} });
}

describe('telemetryService', () => {
  beforeEach(resetStore);

  it('ingests telemetry snapshot', () => {
    const snap = {
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
    ingest(snap);
    expect(useStore.getState().telemetry['R-001']).toBeDefined();
    expect(useStore.getState().telemetry['R-001'].speedMs).toBe(0.5);
  });

  it('ignores invalid payload', () => {
    ingest({});
    expect(Object.keys(useStore.getState().telemetry)).toHaveLength(0);
  });
});
