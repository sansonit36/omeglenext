const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const socketHandler = require('./socket/handler');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for now, tighten in production
    methods: ["GET", "POST"]
  }
});

// Initialize socket handler
socketHandler(io);

// Middleware to parse JSON bodies
app.use(express.json());

// Admin Login Endpoint
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  // TODO: Use environment variables for credentials in production
  if (username === 'admin' && password === 'admin123') {
    res.json({ success: true, token: 'admin-token-secret' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Stats Endpoint
app.get('/api/stats', (req, res) => {
  // Simple token check (in production, use proper middleware)
  const token = req.headers['authorization'];
  if (token !== 'Bearer admin-token-secret') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (io.getStats) {
    res.json(io.getStats());
  } else {
    res.status(500).json({ error: 'Stats not available' });
  }
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access from network: http://[YOUR_LOCAL_IP]:${PORT}`);
});
