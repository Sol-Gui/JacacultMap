import express from 'express';
import { signUp, signIn } from '../controllers/authController.js';
import { loginWithGoogle, loginWithGoogleCallback, useCode } from '../controllers/socialAuthController.js';
const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.get('/auth/google', loginWithGoogle)
router.get('/auth/google/callback', loginWithGoogleCallback);
router.post('/auth/google/useCode', useCode);

export default router;