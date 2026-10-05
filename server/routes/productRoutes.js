import express from 'express';
import { 
  getProducts, 
  getProductsByCategory, 
  addProduct, 
  updateProduct, 
  updateProductImage,
  deleteProduct, 
  updateStock 
} from '../controllers/productController.js';
import { optionalAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(optionalAuth, upload.single('image'), addProduct);

router.get('/category/:categoryId', getProductsByCategory);

router.route('/:id')
  .put(optionalAuth, upload.single('image'), updateProduct)
  .delete(optionalAuth, deleteProduct);

router.route('/:id/image')
  .patch(optionalAuth, upload.single('image'), updateProductImage);

router.patch('/:id/stock', optionalAuth, updateStock);

export default router;
