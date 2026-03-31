import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RobotCard } from './RobotCard';
import { useStore } from '@/app/store';

function resetStore() {
  useStore.setState({
    selectedRobotId: 'R-001',
    toasts: [],
  });
}

describe('RobotCard', () => {
  beforeEach(resetStore);

  const mockRobot = {
    id: 'R-001',
    type: 'AMR Jack',
    zone: 'Z1',
    status: 'active' as const,
    assignedOperatorId: 'ID-1001',
    battery: 74,
    risk: 0.38,
    warehouseId: 'WH-CARSON',
  };

  it('renders robot ID', () => {
    render(<RobotCard robot={mockRobot} />);
    expect(screen.getByText('R-001')).toBeInTheDocument();
  });

  it('renders robot type', () => {
    render(<RobotCard robot={mockRobot} />);
    expect(screen.getByText('AMR Jack')).toBeInTheDocument();
  });

  it('renders status pill', () => {
    render(<RobotCard robot={mockRobot} />);
    expect(screen.getByText('ASSIGNED')).toBeInTheDocument();
  });

  it('renders stopped status', () => {
    const stoppedRobot = { ...mockRobot, id: 'R-003', status: 'stopped' as const, assignedOperatorId: null };
    render(<RobotCard robot={stoppedRobot} />);
    expect(screen.getByText('STOPPED')).toBeInTheDocument();
  });

  it('selects robot on click', () => {
    useStore.setState({ selectedRobotId: 'R-002' });
    render(<RobotCard robot={mockRobot} />);
    fireEvent.click(screen.getByText('R-001'));
    expect(useStore.getState().selectedRobotId).toBe('R-001');
  });

  it('shows risk value', () => {
    render(<RobotCard robot={mockRobot} />);
    expect(screen.getByText('0.38')).toBeInTheDocument();
  });
});
