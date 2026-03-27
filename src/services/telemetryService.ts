import { useStore } from '@/app/store';
import type { TelemetrySnapshot } from '@/types/telemetry';

export function ingest(payload: unknown) {
  const snap = payload as TelemetrySnapshot;
  if (!snap.robotId) return;
  useStore.getState().updateTelemetry(snap);
}
