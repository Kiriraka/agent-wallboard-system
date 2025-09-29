// src/theme/colors.js
export const statusColors = {
  Available: '#4caf50',    // Green
  Busy: '#ff9800',         // Orange  
  Break: '#2196f3',        // Blue
  Offline: '#9e9e9e',      // Gray
};

export const getStatusColor = (status) => {
  return statusColors[status] || statusColors.Offline;
};