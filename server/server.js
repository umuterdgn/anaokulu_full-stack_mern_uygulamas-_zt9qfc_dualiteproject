import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Bağlantısı
const connectDB = async () => {
  if (!process.env.MONGODB_URI || process.env.MONGODB_URI === 'YOUR_API_KEY') {
    console.warn('⚠️ MONGODB_URI tanımlanmamış. Veritabanı işlemleri çalışmayacaktır.');
    return;
  }
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

// Sağlık kontrolü
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Backend çalışıyor' });
});

app.listen(PORT, () => {
  console.log(`🚀 Sunucu http://localhost:${PORT} adresinde çalışıyor`);
});
