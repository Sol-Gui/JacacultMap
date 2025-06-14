import express from 'express';
import { authenticateWithToken } from '../middleware/authMiddleware.js';
const router = express.Router();

router.get('/tokenValidation', authenticateWithToken, (req, res) => {
   res.send('Token validado com sucesso!');
});

export default router;