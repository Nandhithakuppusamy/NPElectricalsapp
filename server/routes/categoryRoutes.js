import express from 'express';
import { 
  getCategories, 
  addCategory, 
  updateCategory, 
  updateCategoryImage,
  deleteCategory 
} from '../controllers/categoryController.js';
import { optionalAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.route('/')
  .get(getCategories)
  .post(optionalAuth, upload.single('image'), addCategory);

router.route('/:id')
  .put(optionalAuth, upload.single('image'), updateCategory)
  .delete(optionalAuth, deleteCategory);

router.route('/:id/image')
  .patch(optionalAuth, upload.single('image'), updateCategoryImage);

export default router;
