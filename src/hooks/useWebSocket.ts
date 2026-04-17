/**
 * useWebSocket — auto-reconnecting WebSocket hook.
 *
 * Features:
 * - Exponential back-off reconnection (1s → 2s → 4s → 8s → max 30s)
 * - Connection state tracking
 * - Automatic cleanup on unmount
 * - JSON message parsing
 *
 * @example
 * ```tsx
 * const { sendMessage, lastMessage, readyState } = useWebSocket(
 *   'wss://api.example.com/ws',
 *   { onMessage: (data) => console.log(data) }
 * );
 * ```
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { logger } from '@/lib/logger';

export type ReadyState = 'connecting' | 'open' | 'closing' | 'closed';

interface UseWebSocketOptions {
  /** Called when a message is received. */
  onMessage?: (data: unknown) => void;
  /** Called when the connection opens. */
  onOpen?: () => void;
  /** Called when the connection closes. */
  onClose?: () => void;
  /** Called on error. */
  onError?: (event: Event) => void;
  /** Maximum reconnection attempts. 0 = infinite. Default: 0. */
  maxRetries?: number;
  /** Protocols to pass to the WebSocket constructor. */
  protocols?: string | string[];
  /** Disable auto-connect (useful for conditional connections). */
  enabled?: boolean;
}

export function useWebSocket(
  url: string | null,
  options: UseWebSocketOptions = {}
) {
  const {
    onMessage,
    onOpen,
    onClose,
    onError,
    maxRetries = 0,
    protocols,
    enabled = true,
  } = options;

  const [readyState, setReadyState] = useState<ReadyState>('closed');
  const [lastMessage, setLastMessage] = useState<unknown>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const retriesRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const mountedRef = useRef(true);

  // Keep callbacks in refs to avoid reconnection cycles
  const callbacksRef = useRef({ onMessage, onOpen, onClose, onError });
  callbacksRef.current = { onMessage, onOpen, onClose, onError };

  const connect = useCallback(() => {
    if (!url || !mountedRef.current) return;

    try {
      const ws = new WebSocket(url, protocols);
      wsRef.current = ws;
      setReadyState('connecting');

      ws.onopen = () => {
        if (!mountedRef.current) return;
        retriesRef.current = 0;
        setReadyState('open');
        callbacksRef.current.onOpen?.();
      };

      ws.onmessage = (event: MessageEvent) => {
        if (!mountedRef.current) return;
        const { data: rawData } = event;
        let data: unknown;
        try {
          data = JSON.parse(rawData as string);
        } catch {
          data = rawData;
        }
        setLastMessage(data);
        callbacksRef.current.onMessage?.(data);
      };

      ws.onerror = event => {
        if (!mountedRef.current) return;
        logger.warn('WebSocket error', { url });
        callbacksRef.current.onError?.(event);
      };

      ws.onclose = () => {
        if (!mountedRef.current) return;
        setReadyState('closed');
        callbacksRef.current.onClose?.();

        // Reconnect with exponential backoff
        if (maxRetries === 0 || retriesRef.current < maxRetries) {
          const delay = Math.min(1000 * 2 ** retriesRef.current, 30_000);
          retriesRef.current += 1;
          timerRef.current = setTimeout(connect, delay);
        }
      };
    } catch (error) {
      logger.error('WebSocket connection failed', {
        url,
        error: error instanceof Error ? error.message : 'unknown',
      });
    }
  }, [url, protocols, maxRetries]);

  useEffect(() => {
    mountedRef.current = true;

    if (enabled && url) {
      connect();
    }

    return () => {
      mountedRef.current = false;
      clearTimeout(timerRef.current);
      if (wsRef.current) {
        wsRef.current.onclose = null; // prevent reconnect on intentional close
        wsRef.current.close();
      }
    };
  }, [connect, enabled, url]);

  const sendMessage = useCallback((data: unknown) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        typeof data === 'string' ? data : JSON.stringify(data)
      );
    }
  }, []);

  const disconnect = useCallback(() => {
    clearTimeout(timerRef.current);
    if (wsRef.current) {
      wsRef.current.onclose = null;
      wsRef.current.close();
      setReadyState('closed');
    }
  }, []);

  return { sendMessage, disconnect, lastMessage, readyState };
}
