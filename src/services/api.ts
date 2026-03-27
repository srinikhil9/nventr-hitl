import axios from 'axios';
import { API_URL, DEMO_MODE } from '@/constants/config';
import { useStore } from '@/app/store';
import type { Robot } from '@/types/robot';
import type { Command } from '@/types/command';
import type { FidelityRequest } from '@/types/fidelity';
import type { AuditEntry } from '@/types/audit';
import type { HITLSession } from '@/types/session';

interface ApiResponse<T> {
  data: T;
  meta?: { ts: string; requestId: string };
}

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const session = useStore.getState().session;
  if (session) {
    config.headers.Authorization = `Bearer mock-jwt-token`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error instanceof Error ? error.message : 'API request failed';
    useStore.getState().addToast(message, 'error');
    return Promise.reject(error);
  },
);

function mockDelay(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 80 + Math.random() * 120));
}

export async function fetchFleet(warehouseId: string): Promise<Robot[]> {
  if (DEMO_MODE) {
    await mockDelay();
    return useStore.getState().robots;
  }
  const res = await api.get<ApiResponse<Robot[]>>(`/v1/fleet?warehouseId=${warehouseId}`);
  return res.data.data;
}

export async function sendCommand(robotId: string, command: Command): Promise<Command> {
  if (DEMO_MODE) {
    await mockDelay();
    return { ...command, status: 'ack' };
  }
  const res = await api.post<ApiResponse<Command>>(`/v1/robots/${robotId}/command`, command);
  return res.data.data;
}

export async function triggerEStop(robotId: string): Promise<{ status: string }> {
  if (DEMO_MODE) {
    await mockDelay();
    return { status: 'stopped' };
  }
  const res = await api.post<ApiResponse<{ status: string }>>(`/v1/robots/${robotId}/estop`);
  return res.data.data;
}

export async function clearEStop(robotId: string): Promise<{ status: string }> {
  if (DEMO_MODE) {
    await mockDelay();
    return { status: 'active' };
  }
  const res = await api.post<ApiResponse<{ status: string }>>(`/v1/robots/${robotId}/estop/clear`);
  return res.data.data;
}

export async function fetchFidelityRequests(warehouseId: string): Promise<FidelityRequest[]> {
  if (DEMO_MODE) {
    await mockDelay();
    return useStore.getState().fidelityRequests;
  }
  const res = await api.get<ApiResponse<FidelityRequest[]>>(`/v1/fidelity/requests?warehouseId=${warehouseId}`);
  return res.data.data;
}

export async function approveFidelityRequest(requestId: string): Promise<FidelityRequest> {
  if (DEMO_MODE) {
    await mockDelay();
    const req = useStore.getState().fidelityRequests.find((r) => r.requestId === requestId);
    return { ...req!, status: 'approved' };
  }
  const res = await api.post<ApiResponse<FidelityRequest>>(`/v1/fidelity/requests/${requestId}/approve`);
  return res.data.data;
}

export async function fetchAuditLog(params: { robotId?: string; limit?: number }): Promise<AuditEntry[]> {
  if (DEMO_MODE) {
    await mockDelay();
    return useStore.getState().auditLog;
  }
  const res = await api.get<ApiResponse<AuditEntry[]>>('/v1/audit', { params });
  return res.data.data;
}

export async function submitTicket(data: {
  robotId: string;
  type: string;
  severity: string;
  details: string;
}): Promise<{ ticketId: string; status: string }> {
  if (DEMO_MODE) {
    await mockDelay();
    return { ticketId: `TKT-${Math.floor(1000 + Math.random() * 9000)}`, status: 'open' };
  }
  const res = await api.post<ApiResponse<{ ticketId: string; status: string }>>('/v1/tickets', data);
  return res.data.data;
}

export async function createSession(): Promise<HITLSession> {
  if (DEMO_MODE) {
    await mockDelay();
    return useStore.getState().session!;
  }
  const res = await api.post<ApiResponse<HITLSession>>('/v1/sessions');
  return res.data.data;
}
