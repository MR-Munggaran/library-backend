import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';


import bookRoutes from './routes/books.js';
import authRoutes from './routes/auth.js';
import ebookRoutes from './routes/ebooks.js';

const app = express();
const port = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:5173',      // Web (Vite)
  'http://192.168.0.9:5173',      // Web (Vite)
  'https://yourwebfrontend.com' // Produksi
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) {
      // Tidak ada Origin -> biasanya dari mobile/native app (seperti Flutter) atau Postman
      return callback(null, true);
    }
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// express.json() sudah built-in, tidak perlu pakai body-parser eksternal
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/ebooks', ebookRoutes);
app.use('/api/books', bookRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
