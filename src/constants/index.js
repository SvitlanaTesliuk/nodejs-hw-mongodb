import path from 'path';
import { fileURLToPath } from 'url';

export const SORT_ORDER = {
    ASC: 'asc',
    DESC: 'desc',
  };

export const FIFTEEN_MINUTES = 15 * 60 * 1000;
export const THIRTY_DAYS = 1000 * 60 * 60 * 24 * 30;

export const SMTP = {
  SMTP_HOST: 'SMTP_HOST',
  SMTP_PORT: 'SMTP_PORT',
  SMTP_USER: 'SMTP_USER',
  SMTP_PASSWORD: 'SMTP_PASSWORD',
  SMTP_FROM: 'SMTP_FROM',
};

export const CLOUDINARY = {
  CLOUDINARY_CLOUD_NAME: 'CLOUDINARY_CLOUD_NAME',
  CLOUDINARY_API_KEY: 'CLOUDINARY_API_KEY',
  CLOUDINARY_API_SECRET: 'CLOUDINARY_API_SECRET',
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const SWAGGER_PATH = path.resolve('docs/swagger.json');
