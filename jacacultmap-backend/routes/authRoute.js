import express from 'express';
import { signUp, signIn } from '../controllers/authController.js';
import { loginWithGoogle, loginWithGoogleCallback } from '../controllers/socialAuthController.js';
const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.get('/auth/google', loginWithGoogle)
router.get('/auth/google/callback', loginWithGoogleCallback);

export default router;