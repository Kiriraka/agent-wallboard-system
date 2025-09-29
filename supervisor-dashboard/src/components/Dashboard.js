// src/components/Dashboard.js
import React, { useState } from 'react';
import {
  Grid, AppBar, Toolbar, Typography, Button, Box, Chip
} from '@mui/material';
import { Logout, People, Message } from '@mui/icons-material';
import TeamOverview from './TeamOverview';
import AgentCard from './AgentCard';
import MessagePanel from './MessagePanel';
import StatusFilter from './StatusFilter';

function Dashboard({ supervisor, teamData, messages, onSendMessage }) {
  const [statusFilter, setStatusFilter] = useState('All');
  const [showMessagePanel, setShowMessagePanel] = useState(false);

  // กรองข้อมูล agent ตาม status filter
  const filteredAgents = teamData.filter(agent => 
    statusFilter === 'All' || agent.currentStatus === statusFilter
  );

  // สถิติทีม
  const teamStats = {
    total: teamData.length,
    online: teamData.filter(a => a.isOnline).length,
    available: teamData.filter(a => a.currentStatus === 'Available').length,
    busy: teamData.filter(a => a.currentStatus === 'Busy').length
  };

  return (
    <>
      {/* App Bar */}
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <People sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {supervisor.name} - {supervisor.teamName}
          </Typography>
          <Chip 
            label={`${teamStats.online}/${teamStats.total} Online`}
            color="success"
            variant="outlined"
            sx={{ mr: 2, color: 'white', borderColor: 'white' }}
          />
          <Button 
            color="inherit" 
            startIcon={<Message />}
            onClick={() => setShowMessagePanel(true)}
            sx={{ mr: 1 }}
          >
            Messages
          </Button>
          <Button color="inherit" startIcon={<Logout />}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ mt: 3 }}>
        <Grid container spacing={3}>
          {/* Team Overview */}
          <Grid item xs={12}>
            <TeamOverview stats={teamStats} />
          </Grid>

          {/* Status Filter */}
          <Grid item xs={12}>
            <StatusFilter 
              currentFilter={statusFilter}
              onFilterChange={setStatusFilter}
              stats={teamStats}
            />
          </Grid>

          {/* Agent Cards */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              {filteredAgents.map(agent => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={agent.agentCode}>
                  <AgentCard 
                    agent={agent} 
                    onSendMessage={(content) => onSendMessage({
                      type: 'direct',
                      to: agent.agentCode,
                      content
                    })}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Box>

      {/* Message Panel Modal */}
      <MessagePanel
        open={showMessagePanel}
        onClose={() => setShowMessagePanel(false)}
        teamData={teamData}
        messages={messages}
        onSendMessage={onSendMessage}
      />
    </>
  );
}

export default Dashboard;