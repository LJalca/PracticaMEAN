// src/config/database.ts
import mongoose from 'mongoose';

export const connectDatabase = async (): Promise<void> => {
  const baseUri = process.env.MONGODB_URI;

  if (!baseUri) {
    console.error('❌ Falta la variable de entorno MONGODB_URI');
    process.exit(1);
  }

  const MONGO_URI = `${baseUri.replace(/\/$/, '')}/usuarios_db?retryWrites=true&w=majority`;

  try {
    await mongoose.connect(MONGO_URI);
    console.log('🔄 [Database]: Conexión exitosa a MongoDB Atlas');
  } catch (error) {
    console.error('❌ Error crítico al conectar a MongoDB Atlas:', error);
    process.exit(1);
  }
};