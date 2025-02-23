import cloudinary from 'cloudinary';
import fs from 'node:fs/promises';
import { getEnvVar } from './getEnvVar.js';
import { CLOUDINARY } from '../constants/index.js';

cloudinary.v2.config({
  secure: true,
  cloud_name: getEnvVar(CLOUDINARY.CLOUDINARY_CLOUD_NAME),
  api_key: getEnvVar(CLOUDINARY.CLOUDINARY_API_KEY),
  api_secret: getEnvVar(CLOUDINARY.CLOUDINARY_API_SECRET),
});

export const saveFileToCloudinary = async (file) => {
    const result = await cloudinary.v2.uploader.upload(file.path, {
      folder: 'contacts',
    });

    if (file.path.startsWith('/tmp') || file.path.includes('uploads')) {
      await fs.unlink(file.path).catch(err => console.warn("Failed to delete local file:", err));
    }

    return result.secure_url;
};
