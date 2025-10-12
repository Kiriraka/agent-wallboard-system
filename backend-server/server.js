// server.js
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import configurations
const { initSQLite, connectMongoDB } = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const agentRoutes = require('./routes/agents');
const messageRoutes = require('./routes/messages');

// Import socket handler
const socketHandler = require('./socket/socketHandler');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

// Initialize Express
const app = express();
const server = http.createServer(app);

// ✅ Safe CORS configuration
const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
  : ['http://localhost:5173', 'http://localhost:3002'];

const corsOptions = {
  origin: corsOrigins,
  credentials: true,
};

app.use(cors(corsOptions));

// ✅ Ensure JSON body parsing works
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ✅ Rate limiting (prevent abuse)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', apiLimiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    error: 'Too many login attempts, please try again later.',
  },
});
app.use('/api/auth/', authLimiter);

// ✅ Log all requests
app.use((req, res, next) => {
  console.log(`🕓 ${new Date().toISOString()} | ${req.method} ${req.originalUrl}`);
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log('📩 Body:', req.body);
  }
  next();
});

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/messages', messageRoutes);

// ✅ Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: {
      used: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
      total: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`,
    },
  });
});

// ✅ 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// ✅ Global error handler
app.use(errorHandler);

// ✅ WebSocket setup
const io = socketio(server, {
  cors: corsOptions,
});

// ✅ Important: allow access to io inside routes
app.set('io', io);

// Load socket events
socketHandler(io);

// ✅ Database initialization and server start
async function startServer() {
  try {
    console.log('🚀 Starting Agent Wallboard Backend Server...\n');
    console.log('📊 Initializing databases...');
    await initSQLite();
    await connectMongoDB();
    console.log('✅ Databases connected successfully!\n');

    const PORT = process.env.PORT || 3001;
    server.listen(PORT, () => {
      console.log('✅ Server started successfully!\n');
      console.log(`📡 HTTP Server: http://localhost:${PORT}`);
      console.log(`⚡ WebSocket Server: ws://localhost:${PORT}`);
      console.log(`🏥 Health Check: http://localhost:${PORT}/health\n`);
      console.log('📋 Available Routes:');
      console.log('   POST   /api/auth/login');
      console.log('   POST   /api/auth/logout');
      console.log('   GET    /api/agents/team/:teamId');
      console.log('   PUT    /api/agents/:agentCode/status');
      console.log('   GET    /api/agents/:agentCode/history');
      console.log('   POST   /api/messages/send');
      console.log('   GET    /api/messages/inbox/:agentCode');
      console.log('   PUT    /api/messages/:messageId/read\n');
      console.log('🔌 WebSocket Events:');
      console.log('   - agent_connect');
      console.log('   - supervisor_connect');
      console.log('   - update_status');
      console.log('   - send_message');
      console.log('   - connection_success');
      console.log('   - agent_status_update');
      console.log('   - new_message\n');
      console.log('🛡️  Rate Limiting:');
      console.log('   - API: 100 requests / 15 min');
      console.log('   - Auth: 10 requests / 15 min\n');
      console.log('Press Ctrl+C to stop');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// ✅ Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

// ✅ Start server
startServer();

module.exports = { app, io };
