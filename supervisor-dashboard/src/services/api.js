// src/services/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const loginSupervisor = async (supervisorCode) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      supervisorCode,
      type: 'supervisor' 
    })
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  return response.json();
};

export const getTeamData = async (supervisorCode) => {
  const response = await fetch(`${API_BASE_URL}/teams/${supervisorCode}/agents`);
  return response.json();
};

export const sendMessage = async (messageData) => {
  const response = await fetch(`${API_BASE_URL}/messages/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(messageData)
  });

  return response.json();
};