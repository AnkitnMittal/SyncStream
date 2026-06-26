import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { io } from 'socket.io-client';

const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const [isConnected, setIsConnected] = useState(false);

  const socket = useMemo(() => {
    return io(baseUrl, {
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      autoConnect: false,
    });
  }, []);

  useEffect(() => {
    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.disconnect();
    };
  }, [socket]);

  const connectSocket = () => socket?.connect();
  const disconnectSocket = () => socket?.disconnect();

  const emitEvent = (event, payload) => {
    if (socket) socket.emit(event, payload);
  };

  const registerListener = (event, callback) => {
    if (!socket) return;
    socket.on(event, callback);
    return () => socket.off(event, callback);
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        emitEvent,
        registerListener,
        connectSocket,
        disconnectSocket,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export const useSocketService = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocketService must be used within a SocketProvider');
  }
  return context;
};
