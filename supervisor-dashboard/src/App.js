// src/App.js - React dashboard หลัก
import React, { useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline, Container } from '@mui/material';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import { connectSocket, disconnectSocket } from './services/socket';
import theme from './theme/theme';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [supervisor, setSupervisor] = useState(null);
  const [teamData, setTeamData] = useState([]);
  const [messages, setMessages] = useState([]);

  // 🔌 เชื่อมต่อ WebSocket เมื่อ login สำเร็จ
  useEffect(() => {
    if (isLoggedIn && supervisor) {
      connectSocket(supervisor.supervisorCode);
      
      // ฟัง agent status updates
      window.socket?.on('agent_status_update', (data) => {
        setTeamData(prev => prev.map(agent => 
          agent.agentCode === data.agentCode 
            ? { ...agent, currentStatus: data.status, lastUpdate: data.timestamp }
            : agent
        ));
      });
      
      // ฟัง agent connections
      window.socket?.on('agent_connected', (data) => {
        setTeamData(prev => prev.map(agent => 
          agent.agentCode === data.agentCode 
            ? { ...agent, isOnline: true, lastSeen: data.timestamp }
            : agent
        ));
      });

      // ฟัง agent disconnections
      window.socket?.on('agent_disconnected', (data) => {
        setTeamData(prev => prev.map(agent => 
          agent.agentCode === data.agentCode 
            ? { ...agent, isOnline: false, lastSeen: data.timestamp }
            : agent
        ));
      });
    }
    
    return () => {
      disconnectSocket();
    };
  }, [isLoggedIn, supervisor]);

  // 🔐 Handle login
  const handleLogin = (supervisorData, initialTeamData) => {
    setSupervisor(supervisorData);
    setTeamData(initialTeamData);
    setIsLoggedIn(true);
  };

  // 💬 Handle message sending
  const handleSendMessage = (messageData) => {
    window.socket?.emit('send_message', {
      from: supervisor.supervisorCode,
      ...messageData
    });
    
    // เพิ่มข้อความลง history
    setMessages(prev => [...prev, {
      ...messageData,
      timestamp: new Date(),
      sender: supervisor.name
    }]);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ py: 2 }}>
        {!isLoggedIn ? (
          <LoginForm onLogin={handleLogin} />
        ) : (
          <Dashboard
            supervisor={supervisor}
            teamData={teamData}
            messages={messages}
            onSendMessage={handleSendMessage}
          />
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;