import { useEffect } from 'react';
import { wsManager } from '@/services/wsManager';
import { useStore } from '@/app/store';
import { WS_URL, DEMO_MODE } from '@/constants/config';
import { startMockStreams, stopMockStreams } from '@/services/mockWsManager';
import * as telemetryService from '@/services/telemetryService';
import * as auditService from '@/services/auditService';

export function useWebSocketInit() {
  useEffect(() => {
    if (DEMO_MODE) {
      startMockStreams();
      return () => { stopMockStreams(); };
    }

    const unsubState = wsManager.onStateChange((s) => {
      useStore.getState().setWsState(s);
    });

    wsManager.onMessage('telemetry', telemetryService.ingest);
    wsManager.onMessage('risk_score', (payload) => {
      useStore.getState().updateRisk(payload as import('@/types/risk').RiskScore);
    });
    wsManager.onMessage('audit_entry', auditService.ingest);
    wsManager.onMessage('robot_status', (payload) => {
      const data = payload as { robotId: string; status: string; battery: number; risk: number };
      useStore.getState().updateRobot(data.robotId, data as Partial<import('@/types/robot').Robot>);
    });
    wsManager.onMessage('fidelity_update', (payload) => {
      const data = payload as { requestId: string } & Partial<import('@/types/fidelity').FidelityRequest>;
      useStore.getState().updateFidelityRequest(data.requestId, data);
    });
    wsManager.onMessage('command_ack', (payload) => {
      const data = payload as { id: string; status: import('@/types/command').CommandStatus };
      useStore.getState().updateCommandStatus(data.id, data.status);
    });
    wsManager.onMessage('auth_ok', (payload) => {
      const data = payload as { robots: import('@/types/robot').Robot[]; fidelityRequests: import('@/types/fidelity').FidelityRequest[]; activeFeeds: string[] };
      useStore.getState().setRobots(data.robots);
      useStore.getState().setFidelityRequests(data.fidelityRequests);
    });

    wsManager.connect(WS_URL, '');

    return () => {
      unsubState();
      wsManager.disconnect();
    };
  }, []);
}
