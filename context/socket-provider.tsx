/* eslint-disable no-unused-vars */
'use client';

import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import { Socket } from 'socket.io-client';

import { disconnectSocket, emitEvent, initializeSocket } from '@/utils/socket';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  emit: <T = any>(
    event: string,
    data: any,
    callback?: (response: T) => void
  ) => boolean;
  disconnect: () => void;
  reconnect: (token?: string) => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  emit: () => false,
  disconnect: () => {},
  reconnect: () => {}
});

export const SocketProvider = ({
  children,
  token
}: {
  children: ReactNode;
  token?: string;
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = useCallback(() => {
    setIsConnected(true);
  }, []);

  const handleDisconnect = useCallback(() => {
    setIsConnected(false);
  }, []);

  const setupSocketListeners = useCallback(
    (socketInstance: Socket) => {
      socketInstance.on('connect', handleConnect);
      socketInstance.on('disconnect', handleDisconnect);

      return () => {
        socketInstance.off('connect', handleConnect);
        socketInstance.off('disconnect', handleDisconnect);
      };
    },
    [handleConnect, handleDisconnect]
  );

  useEffect(() => {
    const socketInstance = initializeSocket(token);
    setSocket(socketInstance);

    const cleanup = setupSocketListeners(socketInstance);

    return () => {
      cleanup();
      disconnectSocket();
    };
  }, [token, setupSocketListeners]);

  const reconnect = useCallback(
    (newToken?: string) => {
      const socketInstance = initializeSocket(newToken || token);
      setSocket(socketInstance);

      // Clean up previous listeners and set up new ones
      const cleanup = setupSocketListeners(socketInstance);

      return cleanup;
    },
    [token, setupSocketListeners]
  );

  const contextValue: SocketContextType = {
    socket,
    isConnected,
    emit: emitEvent,
    disconnect: disconnectSocket,
    reconnect
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
