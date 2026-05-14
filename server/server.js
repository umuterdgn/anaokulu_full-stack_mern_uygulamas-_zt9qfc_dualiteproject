import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Bağlantısı (Vercel her istekte burayı tetikler, mongoose bunu yönetir)
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return; // Zaten bağlıysa tekrar bağlama

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB bağlantısı başarılı!');
  } catch (error) {
    console.error('❌ MongoDB bağlantı hatası:', error.message);
  }
};

connectDB();

// Rotalar
app.use('/api', apiRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Backend çalışıyor' });
});

// LOKALDE ÇALIŞTIRMAK İÇİN (Vercel bunu görmezden gelir)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Sunucu http://localhost:${PORT} adresinde çalışıyor`);
  });
}

// VERCEL İÇİN EXPORT
export default app;
