import express from 'express';
import { 
  checkoutBill, 
  getBillingHistory, 
  getStats 
} from '../controllers/billingController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getBillingHistory)
  .post(optionalAuth, checkoutBill);

router.get('/stats', getStats);

export default router;
