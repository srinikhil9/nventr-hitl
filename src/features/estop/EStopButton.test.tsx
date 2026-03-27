import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EStopButton } from './EStopButton';
import { useStore } from '@/app/store';

function resetStore() {
  useStore.setState({ estopActive: false });
}

describe('EStopButton', () => {
  beforeEach(resetStore);

  it('renders E-STOP text when not active', () => {
    render(<EStopButton />);
    expect(screen.getByText(/E-STOP/)).toBeInTheDocument();
  });

  it('renders STOPPED text when active', () => {
    useStore.setState({ estopActive: true });
    render(<EStopButton />);
    expect(screen.getByText(/STOPPED/)).toBeInTheDocument();
  });

  it('dispatches open-estop-modal event on click', () => {
    const handler = vi.fn();
    window.addEventListener('open-estop-modal', handler);
    render(<EStopButton />);
    fireEvent.click(screen.getByRole('button'));
    expect(handler).toHaveBeenCalled();
    window.removeEventListener('open-estop-modal', handler);
  });
});
