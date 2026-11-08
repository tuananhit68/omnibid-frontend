import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getStoredToken } from "../api/auth-storage";

let stompClient: Client | null = null;
let isConnected = false;
const listeners = new Set<(connected: boolean) => void>();

function notifyListeners(status: boolean) {
  isConnected = status;
  listeners.forEach((listener) => listener(status));
}

export function getWsClient(): Client {
  if (stompClient) {
    return stompClient;
  }

  const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:8080/ws-auction";

  stompClient = new Client({
    webSocketFactory: () => new SockJS(wsUrl),
    reconnectDelay: 4000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,
    beforeConnect: () => {
      const token = getStoredToken();
      if (token && stompClient) {
        stompClient.connectHeaders = {
          Authorization: `Bearer ${token}`,
        };
      } else if (stompClient) {
        stompClient.connectHeaders = {};
      }
    },
    onConnect: () => {
      notifyListeners(true);
    },
    onDisconnect: () => {
      notifyListeners(false);
    },
    onStompError: (frame) => {
      console.warn("STOMP error:", frame.headers["message"]);
      notifyListeners(false);
    },
    onWebSocketClose: () => {
      notifyListeners(false);
    },
  });

  stompClient.activate();
  return stompClient;
}

export function isWsConnected(): boolean {
  return isConnected;
}

export function subscribeWsStatus(listener: (connected: boolean) => void): () => void {
  listeners.add(listener);
  listener(isConnected);
  return () => {
    listeners.delete(listener);
  };
}

