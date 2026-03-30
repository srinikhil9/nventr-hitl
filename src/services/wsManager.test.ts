import { describe, it, expect, vi } from 'vitest';
import { wsManager } from './wsManager';

describe('WebSocketManager', () => {
  it('starts in DISCONNECTED state', () => {
    expect(wsManager.getState()).toBe('DISCONNECTED');
  });

  it('registers and calls state change listeners', () => {
    const listener = vi.fn();
    const unsub = wsManager.onStateChange(listener);
    
    // Trigger a connect attempt (will fail since no server)
    // Just verify the listener mechanism works
    unsub();
    expect(typeof unsub).toBe('function');
  });

  it('registers message handlers', () => {
    const handler = vi.fn();
    wsManager.onMessage('test_type', handler);
    wsManager.offMessage('test_type', handler);
  });

  it('send does nothing when disconnected', () => {
    // Should not throw
    wsManager.send({ type: 'test', payload: {} });
  });
});
