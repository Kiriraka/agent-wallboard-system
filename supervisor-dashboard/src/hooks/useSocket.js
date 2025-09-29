// src/hooks/useSocket.js
import { useEffect, useRef } from 'react';
import { connectSocket, disconnectSocket } from '../services/socket';

export const useSocket = (supervisorCode, onConnect) => {
  const socketRef = useRef(null);

  useEffect(() => {
    if (supervisorCode) {
      socketRef.current = connectSocket(supervisorCode);
      
      if (onConnect) {
        socketRef.current.on('connect', onConnect);
      }

      return () => {
        disconnectSocket();
      };
    }
  }, [supervisorCode, onConnect]);

  return socketRef.current;
};