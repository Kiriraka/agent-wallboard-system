// src/components/AgentCard.js
import React, { useState } from 'react';
import {
  Card, CardContent, Typography, Chip, IconButton, 
  Tooltip, Box, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField
} from '@mui/material';
import { 
  Circle, Message, Person, AccessTime, 
  CheckCircle, Cancel, Pause, PowerOff 
} from '@mui/icons-material';
import { getStatusColor, getStatusIcon, formatTimeAgo } from '../utils/statusUtils';

function AgentCard({ agent, onSendMessage }) {
  const [messageDialog, setMessageDialog] = useState(false);
  const [messageContent, setMessageContent] = useState('');

  const handleSendMessage = () => {
    if (messageContent.trim()) {
      onSendMessage(messageContent);
      setMessageContent('');
      setMessageDialog(false);
    }
  };

  const StatusIcon = getStatusIcon(agent.currentStatus);
  const statusColor = getStatusColor(agent.currentStatus);

  return (
    <>
      <Card 
        elevation={2}
        sx={{ 
          border: agent.isOnline ? `2px solid ${statusColor}` : '2px solid #ccc',
          opacity: agent.isOnline ? 1 : 0.7
        }}
      >
        <CardContent>
          {/* Agent Info */}
          <Box display="flex" alignItems="center" mb={2}>
            <Person sx={{ mr: 1, color: 'text.secondary' }} />
            <Box flexGrow={1}>
              <Typography variant="h6" noWrap>
                {agent.agentName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {agent.agentCode}
              </Typography>
            </Box>
            {agent.isOnline && (
              <Circle sx={{ fontSize: 12, color: 'success.main' }} />
            )}
          </Box>

          {/* Current Status */}
          <Box display="flex" alignItems="center" mb={2}>
            <StatusIcon sx={{ mr: 1, color: statusColor }} />
            <Chip
              label={agent.currentStatus}
              size="small"
              sx={{ 
                backgroundColor: statusColor,
                color: 'white',
                fontWeight: 'bold'
              }}
            />
          </Box>

          {/* Last Update */}
          <Box display="flex" alignItems="center" mb={2}>
            <AccessTime sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {agent.isOnline 
                ? `Updated ${formatTimeAgo(agent.lastUpdate)}`
                : `Last seen ${formatTimeAgo(agent.lastSeen)}`
              }
            </Typography>
          </Box>

          {/* Actions */}
          <Box display="flex" justifyContent="space-between">
            <Button
              size="small"
              startIcon={<Message />}
              onClick={() => setMessageDialog(true)}
              disabled={!agent.isOnline}
            >
              Message
            </Button>
            <Tooltip title={agent.isOnline ? 'Online' : 'Offline'}>
              <Chip
                size="small"
                label={agent.isOnline ? 'Online' : 'Offline'}
                color={agent.isOnline ? 'success' : 'default'}
                variant="outlined"
              />
            </Tooltip>
          </Box>
        </CardContent>
      </Card>

      {/* Send Message Dialog */}
      <Dialog 
        open={messageDialog} 
        onClose={() => setMessageDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Send Message to {agent.agentName}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Message"
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            margin="normal"
            placeholder="Type your message here..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMessageDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSendMessage}
            variant="contained"
            disabled={!messageContent.trim()}
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AgentCard;