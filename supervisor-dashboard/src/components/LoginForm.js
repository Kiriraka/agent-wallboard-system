// src/components/LoginForm.js
import React, { useState } from 'react';
import {
  Paper, TextField, Button, Typography, Alert, Box, CircularProgress
} from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { loginSupervisor } from '../services/api';

function LoginForm({ onLogin }) {
  const [supervisorCode, setSupervisorCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await loginSupervisor(supervisorCode);
      onLogin(response.supervisor, response.teamData);
    } catch (err) {
      setError('Invalid supervisor code or team not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      minHeight="100vh"
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
        <Box textAlign="center" mb={3}>
          <AccountCircle sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Supervisor Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sign in to monitor your team
          </Typography>
        </Box>
        
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Supervisor Code"
            placeholder="e.g., SP001"
            value={supervisorCode}
            onChange={(e) => setSupervisorCode(e.target.value.toUpperCase())}
            margin="normal"
            required
            disabled={loading}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ mt: 3 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign In'}
          </Button>
          
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </form>
        
        <Box mt={3} textAlign="center">
          <Typography variant="caption" color="text.secondary">
            Test Credentials: SP001, SP002, SP003
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}

export default LoginForm;