import express from 'express';
import connectDB from './config/db.js';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import formRoutes from './routes/formRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';



// Connect to MongoDB
connectDB();

const app = express();
const allowedOrigins = [
  "https://gatoes.vercel.app",   // ✅ Production frontend
  "http://localhost:5173"        // ✅ Local development frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS policy violation"));
      }
    },
    credentials: true, // If using cookies or authentication
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


// Middleware
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Routes
app.use('/api/forms', formRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Error handling
app.use(notFound);
app.use(errorHandler);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));