import type { WsConnectionState } from '@/app/store';

type MessageHandler = (payload: unknown) => void;

interface WsMessage {
  type: string;
  payload?: unknown;
  ts?: string;
}

class WebSocketManager {
  private ws: WebSocket | null = null;
  private url = '';
  private token = '';
  private handlers = new Map<string, Set<MessageHandler>>();
  private state: WsConnectionState = 'DISCONNECTED';
  private stateListeners = new Set<(s: WsConnectionState) => void>();
  private reconnectAttempts = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private lastMessageTime = 0;

  getState(): WsConnectionState {
    return this.state;
  }

  private setState(s: WsConnectionState) {
    this.state = s;
    this.stateListeners.forEach((fn) => fn(s));
  }

  onStateChange(fn: (s: WsConnectionState) => void): () => void {
    this.stateListeners.add(fn);
    return () => { this.stateListeners.delete(fn); };
  }

  connect(url: string, token: string) {
    this.url = url;
    this.token = token;
    this.doConnect();
  }

  private doConnect() {
    if (this.ws) {
      this.ws.onclose = null;
      this.ws.close();
    }

    this.setState('CONNECTING');

    try {
      this.ws = new WebSocket(this.url);
    } catch {
      this.scheduleReconnect();
      return;
    }

    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
      this.setState('CONNECTED');
      this.lastMessageTime = Date.now();

      this.ws?.send(JSON.stringify({
        type: 'auth',
        token: this.token,
        sessionId: '',
        warehouseId: 'WH-CARSON',
      }));

      this.startHeartbeat();
    };

    this.ws.onmessage = (event) => {
      this.lastMessageTime = Date.now();
      try {
        const msg = JSON.parse(event.data as string) as WsMessage;
        const handlers = this.handlers.get(msg.type);
        if (handlers) {
          handlers.forEach((fn) => fn(msg.payload));
        }
      } catch {
        // ignore parse errors
      }
    };

    this.ws.onclose = () => {
      this.stopHeartbeat();
      if (this.state !== 'DISCONNECTED') {
        this.scheduleReconnect();
      }
    };

    this.ws.onerror = () => {
      // onclose will fire after onerror
    };
  }

  private scheduleReconnect() {
    this.setState('RECONNECTING');
    const delay = Math.min(500 * Math.pow(2, this.reconnectAttempts), 30000);
    this.reconnectAttempts++;
    this.reconnectTimer = setTimeout(() => this.doConnect(), delay);
  }

  private startHeartbeat() {
    this.stopHeartbeat();
    this.heartbeatTimer = setInterval(() => {
      if (Date.now() - this.lastMessageTime > 10000) {
        this.ws?.close();
        return;
      }
      this.send({ type: 'ping', ts: new Date().toISOString() });
    }, 5000);
  }

  private stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  disconnect() {
    this.setState('DISCONNECTED');
    this.stopHeartbeat();
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.onclose = null;
      this.ws.close();
      this.ws = null;
    }
  }

  send(msg: Record<string, unknown>) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg));
    }
  }

  onMessage(type: string, handler: MessageHandler) {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set());
    }
    this.handlers.get(type)!.add(handler);
  }

  offMessage(type: string, handler: MessageHandler) {
    this.handlers.get(type)?.delete(handler);
  }
}

export const wsManager = new WebSocketManager();
