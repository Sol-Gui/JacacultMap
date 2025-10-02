import express from 'express';
import { createEventController, getEventController, getLimitedEventsController } from '../controllers/eventController.js';
const router = express.Router();

router.post('/send-event', createEventController);

router.get('/events/:id', getEventController);

router.get('/events', getLimitedEventsController);
// FALHA NA SEGURANÇA DO ENVIO DOS EMAILS, SE O USUÁRIO SOUBER O EMAIL DE UM ADMIN/EVENT-MANAGER, ELE PODE CRIAR EVENTOS
export default router;