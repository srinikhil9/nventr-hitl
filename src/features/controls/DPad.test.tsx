import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DPad } from './DPad';
import { useStore } from '@/app/store';

vi.mock('@/services/commandService', () => ({
  dispatch: vi.fn().mockResolvedValue('sent'),
}));

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
    selectedRobotId: 'R-001',
    estopActive: false,
    riskScores: {},
    commandLog: [],
    speed: 40,
  });
}

describe('DPad', () => {
  beforeEach(() => {
    resetStore();
    vi.clearAllMocks();
  });

  it('renders all direction buttons', () => {
    render(<DPad />);
    expect(screen.getByText('▲')).toBeInTheDocument();
    expect(screen.getByText('▼')).toBeInTheDocument();
    expect(screen.getByText('◀')).toBeInTheDocument();
    expect(screen.getByText('▶')).toBeInTheDocument();
    expect(screen.getByText('STOP')).toBeInTheDocument();
  });

  it('dispatches forward on up arrow click', async () => {
    const { dispatch } = await import('@/services/commandService');
    render(<DPad />);
    fireEvent.mouseDown(screen.getByText('▲'));
    expect(dispatch).toHaveBeenCalledWith('forward');
  });

  it('dispatches stop on center click', async () => {
    const { dispatch } = await import('@/services/commandService');
    render(<DPad />);
    fireEvent.mouseDown(screen.getByText('STOP'));
    expect(dispatch).toHaveBeenCalledWith('stop');
  });

  it('dispatches left on left arrow click', async () => {
    const { dispatch } = await import('@/services/commandService');
    render(<DPad />);
    fireEvent.mouseDown(screen.getByText('◀'));
    expect(dispatch).toHaveBeenCalledWith('left');
  });

  it('dispatches right on right arrow click', async () => {
    const { dispatch } = await import('@/services/commandService');
    render(<DPad />);
    fireEvent.mouseDown(screen.getByText('▶'));
    expect(dispatch).toHaveBeenCalledWith('right');
  });

  it('dispatches backward on down arrow click', async () => {
    const { dispatch } = await import('@/services/commandService');
    render(<DPad />);
    fireEvent.mouseDown(screen.getByText('▼'));
    expect(dispatch).toHaveBeenCalledWith('backward');
  });
});
