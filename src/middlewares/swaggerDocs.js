import createHttpError from 'http-errors';
import swaggerUI from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import { SWAGGER_PATH } from '../constants/index.js';

export const swaggerDocs = (app) => {
  try {
    if (!fs.existsSync(SWAGGER_PATH)) {
      throw new Error("Swagger file not found");
    }
    const swaggerDoc = JSON.parse(fs.readFileSync(SWAGGER_PATH, 'utf8'));
    app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));
  } catch (err) {
    console.error("Swagger Docs Error:", err.message);
    app.use('/api-docs', (req, res, next) =>
      next(createHttpError(500, "Can't load swagger docs"))
    );
  }
};
