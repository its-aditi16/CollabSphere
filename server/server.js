require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/projects', require('./routes/project.routes'));
app.use('/api/chat', require('./routes/chat.routes')); // Added chat routes
app.use('/api/users', require('./routes/user.routes')); // Added user routes
app.use('/api/tasks', require('./routes/task.routes'));
app.use('/api/ai/tasks', require('./routes/aiTask.routes'));

const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // In production, restrict this to client URL
    methods: ['GET', 'POST']
  }
});

// Initialize Chat Socket
require('./socket/chat.socket')(io);

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/collabsphere';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log('Socket.io initialized');
    });
  })

  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
