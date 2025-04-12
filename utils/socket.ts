import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initializeSocket = () => {
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
    autoConnect: true // Connect automatically
  });

  socket.on('connect', () => {
    console.log('Connected to socket server', socket?.id);
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });

  return socket;
};

export const getSocket = () => {
  return socket;
};
