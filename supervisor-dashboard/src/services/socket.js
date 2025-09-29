// src/services/socket.js
import io from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001';
let socket = null;

export const connectSocket = (supervisorCode) => {
  socket = io(SOCKET_URL, {
    query: { 
      supervisorCode, 
      type: 'supervisor' 
    }
  });

  socket.on('connect', () => {
    console.log('Supervisor connected to server');
    // Join supervisor room
    socket.emit('join_supervisor_room', { supervisorCode });
  });

  socket.on('disconnect', () => {
    console.log('Supervisor disconnected from server');
  });

  // เก็บ socket ไว้ใน global scope
  window.socket = socket;
  
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    window.socket = null;
  }
};