/**
 * WebSocket Telemetry & Real-Time Sync Service
 * Manages WebSocket connections, heartbeat pings, message queuing, and event subscriptions.
 */

class WebSocketService {
  constructor() {
    this.ws = null;
    this.url = null;
    this.token = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 10;
    this.reconnectInterval = 2000; // 2 seconds initial delay
    this.heartbeatInterval = null;
    this.listeners = new Map(); // Event type -> Set of callback functions
    this.messageQueue = []; // Queue for messages sent while offline/connecting
    this.isConnected = false;
  }

  /**
   * Initialize and open the WebSocket connection
   */
  connect(url = process.env.REACT_APP_WS_URL || 'ws://localhost:8080/ws', token = null) {
    this.url = url;
    this.token = token || localStorage.getItem('auth_token');

    const wsUrl = this.token ? `${this.url}?token=${encodeURIComponent(this.token)}` : this.url;

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = this.handleOpen.bind(this);
      this.ws.onmessage = this.handleMessage.bind(this);
      this.ws.onerror = this.handleError.bind(this);
      this.ws.onclose = this.handleClose.bind(this);
    } catch (err) {
      console.error('[WebSocket] Initialization error:', err);
      this.scheduleReconnect();
    }
  }

  /**
   * Event Handler: Connection Opened
   */
  handleOpen() {
    console.log('[WebSocket] Connection established successfully.');
    this.isConnected = true;
    this.reconnectAttempts = 0;

    // Start 30-second heartbeat ping
    this.startHeartbeat();

    // Flush queued messages accumulated while disconnected
    this.flushMessageQueue();

    // Dispatch global connection event
    this.notifyListeners('connection_change', { status: 'connected' });
  }

  /**
   * Event Handler: Incoming Message Router
   */
  handleMessage(event) {
    try {
      const data = JSON.parse(event.data);
      const { type, payload } = data;

      // Handle server pong
      if (type === 'PONG') {
        return;
      }

      // Notify registered listeners for this event type
      this.notifyListeners(type, payload);
    } catch (err) {
      console.error('[WebSocket] Failed to parse message payload:', err, event.data);
    }
  }

  /**
   * Event Handler: Connection Error
   */
  handleError(error) {
    console.error('[WebSocket] Socket encountered error:', error);
    this.notifyListeners('connection_change', { status: 'error', error });
  }

  /**
   * Event Handler: Connection Closed
   */
  handleClose(event) {
    console.warn(`[WebSocket] Connection closed (Code: ${event.code}). Cleaning up...`);
    this.isConnected = false;
    this.stopHeartbeat();

    this.notifyListeners('connection_change', { status: 'disconnected', code: event.code });

    if (event.code !== 1000) {
      // 1000 = Normal Closure
      this.scheduleReconnect();
    }
  }

  /**
   * Exponential backoff reconnect scheduler
   */
  scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('[WebSocket] Max reconnect attempts reached. Manual intervention required.');
      return;
    }

    this.reconnectAttempts += 1;
    const delay = Math.min(this.reconnectInterval * Math.pow(1.5, this.reconnectAttempts), 30000);

    console.log(`[WebSocket] Attempting reconnect #${this.reconnectAttempts} in ${Math.round(delay / 1000)}s...`);
    setTimeout(() => {
      this.connect(this.url, this.token);
    }, delay);
  }

  /**
   * Send JSON payload over the socket or queue if disconnected
   */
  send(type, payload = {}) {
    const message = JSON.stringify({ type, payload, timestamp: new Date().toISOString() });

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(message);
    } else {
      console.warn('[WebSocket] Connection not ready. Queuing message:', type);
      this.messageQueue.push(message);
    }
  }

  /**
   * Flush pending queued messages
   */
  flushMessageQueue() {
    while (this.messageQueue.length > 0 && this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message = this.messageQueue.shift();
      this.ws.send(message);
    }
  }

  /**
   * Heartbeat keep-alive mechanism
   */
  startHeartbeat() {
    this.stopHeartbeat();
    this.heartbeatInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'PING' }));
      }
    }, 30000);
  }

  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  /**
   * Subscribe to specific event channels
   */
  subscribe(eventType, callback) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType).add(callback);

    // Return unsubscribe helper function
    return () => {
      const callbacks = this.listeners.get(eventType);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this.listeners.delete(eventType);
        }
      }
    };
  }

  /**
   * Notify subscribers of an event
   */
  notifyListeners(eventType, payload) {
    const callbacks = this.listeners.get(eventType);
    if (callbacks) {
      callbacks.forEach((callback) => {
        try {
          callback(payload);
        } catch (err) {
          console.error(`[WebSocket] Error in subscriber callback for '${eventType}':`, err);
        }
      });
    }
  }

  /**
   * Explicitly close connection
   */
  disconnect() {
    this.stopHeartbeat();
    this.messageQueue = [];
    if (this.ws) {
      this.ws.close(1000, 'User initiated disconnect');
      this.ws = null;
    }
    this.isConnected = false;
  }
}

// Singleton instance export
export const wsService = new WebSocketService();
export default wsService;