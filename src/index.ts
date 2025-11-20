// src/index.ts
import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.config';
// import restaurantRoutes from './routes/restaurant.routes';
// import { errorHandler } from './middlewares/error.middleware';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/restaurantDB';

// Middleware
app.use(express.json());

// Routes
// app.use('/api/restaurants', restaurantRoutes);

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

// Error middleware (always last)
// app.use(errorHandler);

// Connect MongoDB and start server
connectDB(MONGO_URI).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
