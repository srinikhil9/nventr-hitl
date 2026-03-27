import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Robot } from '@/types/robot';
import type { LayoutMode } from '@/types/camera';
import type { Command } from '@/types/command';
import type { TelemetrySnapshot } from '@/types/telemetry';
import type { RiskScore } from '@/types/risk';
import type { AuditEntry } from '@/types/audit';
import type { FidelityRequest } from '@/types/fidelity';
import type { HITLSession } from '@/types/session';

export type RightPanelTab = 'telemetry' | 'risk' | 'audit' | 'fidelity' | 'ticket';
export type WsConnectionState = 'CONNECTING' | 'CONNECTED' | 'DISCONNECTED' | 'RECONNECTING';

interface HITLStore {
  session: HITLSession | null;
  setSession: (s: HITLSession) => void;

  theme: 'dark' | 'light';
  toggleTheme: () => void;

  robots: Robot[];
  selectedRobotId: string;
  setRobots: (r: Robot[]) => void;
  setSelectedRobot: (id: string) => void;
  updateRobot: (id: string, patch: Partial<Robot>) => void;

  activeFeeds: string[];
  selectedFeedId: string | null;
  layoutMode: LayoutMode;
  addFeed: (id: string) => void;
  removeFeed: (id: string) => void;
  selectFeed: (id: string) => void;
  setLayout: (mode: LayoutMode) => void;

  telemetry: Record<string, TelemetrySnapshot>;
  rttHistory: Record<string, number[]>;
  updateTelemetry: (snap: TelemetrySnapshot) => void;

  riskScores: Record<string, RiskScore>;
  updateRisk: (score: RiskScore) => void;

  commandLog: Command[];
  appendCommand: (cmd: Command) => void;
  updateCommandStatus: (id: string, status: Command['status']) => void;
  speed: number;
  setSpeed: (v: number) => void;

  auditLog: AuditEntry[];
  appendAudit: (entry: AuditEntry) => void;

  fidelityRequests: FidelityRequest[];
  setFidelityRequests: (reqs: FidelityRequest[]) => void;
  updateFidelityRequest: (id: string, patch: Partial<FidelityRequest>) => void;

  estopActive: boolean;
  triggerEStop: () => void;
  clearEStop: () => void;

  activeTab: RightPanelTab;
  setActiveTab: (tab: RightPanelTab) => void;

  wsState: WsConnectionState;
  setWsState: (state: WsConnectionState) => void;

  toasts: Array<{ id: string; message: string; type: 'info' | 'warn' | 'error' | 'success' }>;
  addToast: (message: string, type: 'info' | 'warn' | 'error' | 'success') => void;
  removeToast: (id: string) => void;
}

const savedTheme = (typeof window !== 'undefined' ? localStorage.getItem('nventr-theme') : null) as 'dark' | 'light' | null;

export const useStore = create<HITLStore>()(
  immer((set) => ({
    session: null,
    setSession: (s) => set((state) => { state.session = s; }),

    theme: savedTheme ?? 'dark',
    toggleTheme: () => set((state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('nventr-theme', state.theme);
      if (state.theme === 'light') {
        document.documentElement.classList.add('light');
      } else {
        document.documentElement.classList.remove('light');
      }
    }),

    robots: [],
    selectedRobotId: 'R-001',
    setRobots: (r) => set((state) => { state.robots = r; }),
    setSelectedRobot: (id) => set((state) => { state.selectedRobotId = id; }),
    updateRobot: (id, patch) => set((state) => {
      const idx = state.robots.findIndex((r) => r.id === id);
      if (idx !== -1) {
        Object.assign(state.robots[idx], patch);
      }
    }),

    activeFeeds: ['R001-F', 'R001-B'],
    selectedFeedId: 'R001-F',
    layoutMode: 'main',
    addFeed: (id) => set((state) => {
      if (!state.activeFeeds.includes(id)) {
        state.activeFeeds.push(id);
        state.selectedFeedId = id;
      }
    }),
    removeFeed: (id) => set((state) => {
      if (state.activeFeeds.length <= 1) return;
      state.activeFeeds = state.activeFeeds.filter((f) => f !== id);
      if (state.selectedFeedId === id) {
        state.selectedFeedId = state.activeFeeds[0] ?? null;
      }
    }),
    selectFeed: (id) => set((state) => { state.selectedFeedId = id; }),
    setLayout: (mode) => set((state) => { state.layoutMode = mode; }),

    telemetry: {},
    rttHistory: {},
    updateTelemetry: (snap) => set((state) => {
      state.telemetry[snap.robotId] = snap;
      if (!state.rttHistory[snap.robotId]) {
        state.rttHistory[snap.robotId] = [];
      }
      state.rttHistory[snap.robotId].push(snap.rttMs);
      if (state.rttHistory[snap.robotId].length > 30) {
        state.rttHistory[snap.robotId].shift();
      }
    }),

    riskScores: {},
    updateRisk: (score) => set((state) => {
      state.riskScores[score.robotId] = score;
    }),

    commandLog: [],
    appendCommand: (cmd) => set((state) => {
      state.commandLog.push(cmd);
      if (state.commandLog.length > 100) {
        state.commandLog = state.commandLog.slice(-100);
      }
    }),
    updateCommandStatus: (id, status) => set((state) => {
      const cmd = state.commandLog.find((c) => c.id === id);
      if (cmd) cmd.status = status;
    }),
    speed: 40,
    setSpeed: (v) => set((state) => { state.speed = v; }),

    auditLog: [],
    appendAudit: (entry) => set((state) => {
      state.auditLog.unshift(entry);
      if (state.auditLog.length > 200) {
        state.auditLog = state.auditLog.slice(0, 200);
      }
    }),

    fidelityRequests: [],
    setFidelityRequests: (reqs) => set((state) => { state.fidelityRequests = reqs; }),
    updateFidelityRequest: (id, patch) => set((state) => {
      const req = state.fidelityRequests.find((r) => r.requestId === id);
      if (req) Object.assign(req, patch);
    }),

    estopActive: false,
    triggerEStop: () => set((state) => { state.estopActive = true; }),
    clearEStop: () => set((state) => { state.estopActive = false; }),

    activeTab: 'telemetry',
    setActiveTab: (tab) => set((state) => { state.activeTab = tab; }),

    wsState: 'DISCONNECTED',
    setWsState: (wsState) => set((state) => { state.wsState = wsState; }),

    toasts: [],
    addToast: (message, type) => set((state) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      state.toasts.push({ id, message, type });
    }),
    removeToast: (id) => set((state) => {
      state.toasts = state.toasts.filter((t) => t.id !== id);
    }),
  }))
);
