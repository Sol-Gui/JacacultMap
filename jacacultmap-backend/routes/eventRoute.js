import express from 'express';
import { createEventController, getEventController, getLimitedEventsController } from '../controllers/eventController.js';
const router = express.Router();

router.post('/send-event', createEventController);

router.get('/events/:id', getEventController);

router.get('/events', getLimitedEventsController);

export default router;