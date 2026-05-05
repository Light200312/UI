import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import tasksRouter from './routes/tasks.js';
import authRouter from './routes/auth.js';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to database
await connectDB();

// Routes
app.use('/api/auth', authRouter);
app.use('/api/tasks', tasksRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
