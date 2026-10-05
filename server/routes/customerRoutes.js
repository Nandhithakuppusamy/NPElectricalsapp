import express from 'express';
import { 
  getCustomers, 
  addCustomer, 
  updateCustomer, 
  deleteCustomer, 
  settleCustomerBalance, 
  addPastCredit 
} from '../controllers/customerController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getCustomers)
  .post(optionalAuth, addCustomer);

router.route('/:id')
  .put(optionalAuth, updateCustomer)
  .delete(optionalAuth, deleteCustomer);

router.post('/:id/settle', optionalAuth, settleCustomerBalance);
router.post('/:id/credit', optionalAuth, addPastCredit);

export default router;
