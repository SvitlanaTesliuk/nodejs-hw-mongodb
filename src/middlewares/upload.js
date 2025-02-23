import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from 'cloudinary';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: async (req, file) => ({
    folder: 'contacts',
    format: 'png',
    public_id: `${Date.now()}-${file.originalname}`,
  }),
});

export const upload = multer({ storage });
