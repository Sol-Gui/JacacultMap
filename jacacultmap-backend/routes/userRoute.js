import express from 'express';
import { getUserDataController, updateUserDataController } from '../controllers/userController.js';
const router = express.Router();

router.get("/get-user-data", getUserDataController)

router.post("/update-user-data", updateUserDataController)

export default router;