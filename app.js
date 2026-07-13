import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import healthRoutes from './routes/healthRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

const createApp = () => {
  const app = express();
  const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:3000';

  app.use(
    cors({
      origin: clientOrigin,
      credentials: true,
    })
  );
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));
  app.use(morgan('dev'));

  app.use('/api/health', healthRoutes);
  app.use('/api/portfolio', portfolioRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
};

export default createApp;