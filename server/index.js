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

const db = require('./database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Middleware to parse JSON bodies
app.use(express.json());

// Secret key for JWT (Use env var in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// --- Auth Endpoints ---

app.post('/api/auth/signup', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = `INSERT INTO users (email, password) VALUES (?, ?)`;
  db.run(sql, [email, hashedPassword], function (err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ success: false, message: 'Email already exists' });
      }
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    const token = jwt.sign({ id: this.lastID, email }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ success: true, token, message: 'User created successfully' });
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  const sql = `SELECT * FROM users WHERE email = ?`;
  db.get(sql, [email], async (err, user) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error' });
    if (!user) return res.status(400).json({ success: false, message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ success: true, token, message: 'Login successful' });
  });
});

// --- Admin Endpoints ---

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
