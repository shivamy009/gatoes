import express from 'express';
import connectDB from './config/db.js';
import cors from 'cors';



// Connect to MongoDB
connectDB();

const app = express();


// Middleware
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));