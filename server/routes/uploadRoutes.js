import express from 'express';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// POST /api/upload - Upload an image file
router.post('/', (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || 'Image upload error'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Endha image file-um select seiyavillai (No image file provided)'
      });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    res.status(200).json({
      success: true,
      message: 'Image upload vetrikkaramaga mudindhadhu',
      imageUrl,
      filename: req.file.filename
    });
  });
});

export default router;
