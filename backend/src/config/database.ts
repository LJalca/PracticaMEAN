// src/config/database.ts
import mongoose from 'mongoose';

export const connectDatabase = async (): Promise<void> => {
  const MONGO_URI =
    process.env.MONGODB_URI
      ? `${process.env.MONGODB_URI.replace(/\/$/, '')}/usuarios_db?retryWrites=true&w=majority`
      : 'mongodb+srv://luiggijalca_db_user:XF5yTOwhB107o9i7@cluster0.e7jq226.mongodb.net/usuarios_db?retryWrites=true&w=majority';

  try {
    await mongoose.connect(MONGO_URI);
    console.log('🔄 [Database]: Conexión exitosa a MongoDB Atlas');
  } catch (error) {
    console.error('❌ Error crítico al conectar a MongoDB Atlas:', error);
    process.exit(1);
  }
};