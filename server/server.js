require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const cors = require('cors');
const helmet = require('helmet');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});
// Attach io to app for controller access
app.set('io', io);

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

// MongoDB connection
connectDB();

// Socket.IO setup
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Basic route
app.get('/', (req, res) => {
  res.send('Inventory Management System API');
});

// Product routes
app.use('/api/products', require('./routes/productRoutes'));
// Supplier routes
app.use('/api/suppliers', require('./routes/supplierRoutes'));
// User routes
app.use('/api/users', require('./routes/userRoutes'));
// Auth routes
app.use('/api/auth', require('./routes/authRoutes'));

// Serve static files from React app
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

// Catch-all: send back React's index.html for any non-API route
app.get('*', (req, res) => {
  // Only serve index.html if the request is not for an API route
  if (!req.originalUrl.startsWith('/api/')) {
    res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

// Error handling middleware (should be after all routes)
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
