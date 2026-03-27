import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from '@/app/store';
import { ingest } from './auditService';

function resetStore() {
  useStore.setState({ auditLog: [] });
}

describe('auditService', () => {
  beforeEach(resetStore);

  it('ingests audit entry', () => {
    const entry = {
      id: 'aud-1',
      type: 'command' as const,
      ts: '2026-01-01T00:00:00Z',
      body: 'test audit entry',
    };
    ingest(entry);
    expect(useStore.getState().auditLog).toHaveLength(1);
    expect(useStore.getState().auditLog[0].body).toBe('test audit entry');
  });

  it('ignores entry without id', () => {
    ingest({ type: 'command', ts: '2026-01-01T00:00:00Z', body: 'no id' });
    expect(useStore.getState().auditLog).toHaveLength(0);
  });
});
