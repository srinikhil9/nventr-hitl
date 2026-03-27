export const WS_URL = import.meta.env.VITE_WS_URL as string ?? 'ws://localhost:8080/ws';
export const API_URL = import.meta.env.VITE_API_URL as string ?? 'http://localhost:8080/api';
export const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL as string ?? 'wss://localhost:7880';
export const LIVEKIT_TOKEN = import.meta.env.VITE_LIVEKIT_TOKEN as string ?? '';
export const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';
export const WAREHOUSE_ID = import.meta.env.VITE_WAREHOUSE_ID as string ?? 'WH-CARSON';
