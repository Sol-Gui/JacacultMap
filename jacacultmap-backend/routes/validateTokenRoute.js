import express from 'express';
import { authenticateWithToken } from '../middleware/authMiddleware.js';
const router = express.Router();

router.get('/tokenValidation', authenticateWithToken);

export default router;