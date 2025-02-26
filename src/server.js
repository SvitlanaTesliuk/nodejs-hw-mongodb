import express from 'express';
import cors from 'cors';
import pino from 'pino';
import pinoHttp from 'pino-http';
import router from './routers/index.js';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { swaggerDocs } from './middlewares/swaggerDocs.js';

const getEnvVar = (key, defaultValue) => process.env[key] || defaultValue;

const PORT = Number(getEnvVar('PORT', '3000'));
const UPLOAD_DIR = './uploads';
export const setupServer = () => {
  const app = express();

  app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }));
  app.use(cookieParser());
  const logger = pino();
  app.use(pinoHttp({ logger }));

  app.use(express.json());

  app.use('/uploads', express.static(UPLOAD_DIR));

  swaggerDocs(app);

  app.use( router);

  app.use('*', notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

}
