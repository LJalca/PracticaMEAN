import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import empleadosRoutes from './routes/empleados.routes';
import { globalErrorHandler } from './middlewares/error.middleware';

const app = express();

// Middlewares perimetrales y generales
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Configuración de la aplicación
app.set('puerto', process.env.PORT || 3000);
app.set('nombreApp', 'Gestión de empleados');

// Rutas base
app.use('/api/v1', empleadosRoutes);

// Middleware interceptor global de errores (debe ir después de las rutas)
app.use(globalErrorHandler);

export default app;