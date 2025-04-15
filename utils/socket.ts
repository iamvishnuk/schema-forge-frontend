import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initializeSocket = (token?: string) => {
  // Close any existing connection
  if (socket) socket.close();

  // Create a new connection
  const socketUrl =
    process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:8000';

  socket = io(socketUrl, {
    withCredentials: true,
    transports: ['websocket', 'polling'], // Fallback to polling if websocket fails
    reconnection: true, // Enable reconnection
    reconnectionAttempts: 5, // Number of reconnection attempts
    reconnectionDelay: 1000, // Initial delay between reconnections (ms)
    reconnectionDelayMax: 5000, // Maximum delay between reconnections (ms)
    timeout: 20000, // Connection timeout (ms)
    autoConnect: true, // Connect automatically
    auth: token ? { token } : undefined // Add authentication if token is provided
  });

  socket.on('connect', () => {
    console.log('Connected to socket server', socket?.id);
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
    // Attempt to reconnect with exponential backoff
    setTimeout(
      () => {
        if (socket) socket.connect();
      },
      Math.min(
        5000,
        1000 *
          Math.pow(
            2,
            socket?.io
              ? typeof socket.io.reconnectionAttempts === 'function'
                ? socket.io.reconnectionAttempts()
                : 0
              : 0
          )
      )
    );
  });

  socket.on('disconnect', (reason) => {
    console.log('Disconnected from socket server:', reason);
    if (reason === 'io server disconnect') {
      // The server has forcefully disconnected the socket
      // Attempt to reconnect manually
      setTimeout(() => {
        if (socket) socket.connect();
      }, 3000);
    }
  });

  socket.on('reconnect', (attemptNumber) => {
    console.log(`Reconnected to socket server after ${attemptNumber} attempts`);
  });

  socket.on('reconnect_error', (error) => {
    console.error('Socket reconnection error:', error);
  });

  socket.on('reconnect_failed', () => {
    console.error('Socket reconnection failed after all attempts');
    // You might want to notify the user here
  });

  return socket;
};

export const getSocket = () => {
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const emitEvent = <T = any>(
  event: string,
  data: any,
  // eslint-disable-next-line no-unused-vars
  callback?: (response: T) => void
) => {
  if (socket && socket.connected) {
    if (callback) {
      socket.emit(event, data, callback);
    } else {
      socket.emit(event, data);
    }
    return true;
  }
  console.warn('Socket not connected, cannot emit event:', event);
  return false;
};
