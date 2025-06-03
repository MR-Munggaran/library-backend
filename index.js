import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import bookRoutes from './routes/books.js';
import authRoutes from './routes/auth.js';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));

// express.json() sudah built-in, tidak perlu pakai body-parser eksternal
app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/books', bookRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
