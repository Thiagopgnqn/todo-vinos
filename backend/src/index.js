import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import fs from 'fs';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import userRoutes from './routes/user.routes.js';
import wineTypeRoutes from './routes/wineType.routes.js';
import metaRoutes from './routes/meta.routes.js';

const app = express();

// Detrás del proxy de Railway: necesario para obtener la IP real del cliente en req.ip
app.set('trust proxy', 1);

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Middlewares
app.use(helmet({ crossOriginResourcePolicy: false })); // Allow cross-origin images
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(morgan('dev'));
app.use(express.json());

// Serve static files
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/users', userRoutes);
app.use('/api/wine-types', wineTypeRoutes);
app.use('/api/meta', metaRoutes);

// Error handler
app.use(errorHandler);

// Start server
app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
});
