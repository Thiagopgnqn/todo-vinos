import { Router } from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../utils/cloudinary.js';
import { auth } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';

const router = Router();

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'todo-vinos',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    // opcional: redimensiona en el borde para no subir imágenes gigantes
    transformation: [{ width: 1200, height: 1200, crop: 'limit' }],
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG and WEBP are allowed.'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter
});

router.post('/image', auth, admin, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image provided' });
  }
  // req.file.path ya es la URL completa de Cloudinary (https://res.cloudinary.com/...)
  // req.file.filename es el public_id, útil si más adelante querés borrar la imagen
  res.status(201).json({ url: req.file.path, publicId: req.file.filename });
});

export default router;