import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import routineRoutes from './routes/routines.js';
import suggestionRoutes from './routes/suggestions.js';
import { connectDB } from './db/index.js';

// Load environment variables
dotenv.config();

// Create Express application
const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Connect to database
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/routines', routineRoutes);
app.use('/api/suggestions', suggestionRoutes);

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'Minha Rotina API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Exporta o app para a Vercel usar como handler
export default app;