import express from 'express';
import { createPaymentIntent, confirmPayment, getPaymentHistory, mockProcessPayment } from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All payment routes require authentication
router.use(protect);

router.post('/create-intent', createPaymentIntent);
router.post('/confirm', confirmPayment);
router.post('/mock-confirm', mockProcessPayment);
router.get('/history', getPaymentHistory);

export default router;
