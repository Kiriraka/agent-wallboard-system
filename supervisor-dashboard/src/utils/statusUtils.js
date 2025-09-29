// src/utils/statusUtils.js
import { 
  CheckCircle, Cancel, Pause, PowerOff 
} from '@mui/icons-material';

export const getStatusColor = (status) => {
  const colors = {
    Available: '#4caf50',
    Busy: '#ff9800', 
    Break: '#2196f3',
    Offline: '#9e9e9e'
  };
  return colors[status] || colors.Offline;
};

export const getStatusIcon = (status) => {
  const icons = {
    Available: CheckCircle,
    Busy: Cancel,
    Break: Pause,
    Offline: PowerOff
  };
  return icons[status] || icons.Offline;
};

export const formatTimeAgo = (timestamp) => {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInSeconds = Math.floor((now - time) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};