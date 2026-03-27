import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useStore } from '@/app/store';
import { dispatch } from './commandService';

function resetStore() {
  useStore.setState({
    session: {
      sessionId: 'TOS-001',
      operatorId: 'ID-1001',
      operatorName: 'Alice',
      operatorRole: 'teleop',
      warehouseId: 'WH-CARSON',
      activeRobotId: 'R-001',
      startedAt: '2026-01-01T00:00:00Z',
      fidelityState: {},
    },
    robots: [
      { id: 'R-001', type: 'AMR', zone: 'Z1', status: 'active', assignedOperatorId: 'ID-1001', battery: 80, risk: 0.3, warehouseId: 'WH-CARSON' },
    ],
    selectedRobotId: 'R-001',
    estopActive: false,
    riskScores: {},
    commandLog: [],
    speed: 40,
    toasts: [],
  });
}

describe('commandService.dispatch', () => {
  beforeEach(resetStore);

  it('dispatches forward command successfully', async () => {
    const status = await dispatch('forward');
    expect(status).toBe('sent');
    expect(useStore.getState().commandLog).toHaveLength(1);
    expect(useStore.getState().commandLog[0].verb).toBe('forward');
    expect(useStore.getState().commandLog[0].status).toBe('sent');
  });

  it('blocks command when estop is active', async () => {
    useStore.setState({ estopActive: true });
    const status = await dispatch('forward');
    expect(status).toBe('estop');
    expect(useStore.getState().commandLog[0].status).toBe('estop');
  });

  it('blocks command when risk > 0.75', async () => {
    useStore.setState({
      riskScores: {
        'R-001': {
          score: 0.8,
          level: 'HIGH',
          factors: { proximity: 0.9, cmdVelocity: 0.7, operatorHistory: 0.2, pathDeviation: 0.1, cameraQuality: 0.1 },
          xaiSummary: 'high risk',
          robotId: 'R-001',
          ts: '2026-01-01T00:00:00Z',
        },
      },
    });
    const status = await dispatch('forward');
    expect(status).toBe('blocked');
    expect(useStore.getState().commandLog[0].status).toBe('blocked');
  });

  it('dispatches stop command', async () => {
    const status = await dispatch('stop');
    expect(status).toBe('sent');
    expect(useStore.getState().commandLog[0].verb).toBe('stop');
  });

  it('dispatches all direction commands', async () => {
    await dispatch('forward');
    await dispatch('backward');
    await dispatch('left');
    await dispatch('right');
    expect(useStore.getState().commandLog).toHaveLength(4);
  });

  it('simulates ACK in demo mode', async () => {
    vi.useFakeTimers();
    await dispatch('forward');
    expect(useStore.getState().commandLog[0].status).toBe('sent');
    vi.advanceTimersByTime(300);
    expect(useStore.getState().commandLog[0].status).toBe('ack');
    vi.useRealTimers();
  });
});
