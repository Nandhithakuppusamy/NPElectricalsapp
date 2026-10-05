import express from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { upload } from '../middleware/upload.js';
import fs from 'fs';

const router = express.Router();

// Configure Cloudinary if environment variables are provided
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

// POST /api/upload - Upload an image file (Device gallery / File system)
router.post('/', (req, res, next) => {
  upload.single('image')(req, res, async (err) => {
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

    let finalImageUrl = `/uploads/${req.file.filename}`;

    // If Cloudinary is configured, upload to Cloudinary storage
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'np_electricals',
          resource_type: 'image'
        });
        if (result && result.secure_url) {
          finalImageUrl = result.secure_url;
          try { fs.unlinkSync(req.file.path); } catch (e) {}
        }
      } catch (cloudErr) {
        console.warn('Cloudinary upload warning, fallback to local URL:', cloudErr);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Image upload vetrikkaramaga mudindhadhu',
      imageUrl: finalImageUrl,
      filename: req.file.filename
    });
  });
});

export default router;
