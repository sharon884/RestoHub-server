// src/index.ts
import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.config';
import cors from "cors";
import restaurantRoutes from './routes/restaurant.routes';
import morgan from 'morgan';
// import { errorHandler } from './middlewares/error.middleware';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/restaurantDB';


app.use(
  cors({
    origin: "http://localhost:5173", // your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);
// Middleware
app.use(express.json());

app.use(morgan('dev'));

// Routes
app.use('/api/restaurants', restaurantRoutes);

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});



app.get('/test', (req, res) => {
  res.json({ message: 'CORS is working!' });
});

// Error middleware (always last)
// app.use(errorHandler);

// Connect MongoDB and start server
connectDB(MONGO_URI).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
