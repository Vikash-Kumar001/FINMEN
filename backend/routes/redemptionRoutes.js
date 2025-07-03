import express from 'express';
import { requireAuth } from '../middlewares/requireAuth.js';
import { redeemItem, getRedemptionHistory } from '../controllers/redemptionController.js';

const router = express.Router();

router.use(requireAuth);

router.post('/', redeemItem);
router.get('/history', getRedemptionHistory);

export default router;
