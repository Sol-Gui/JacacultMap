import express from 'express';
const router = express.Router();

router.post('/send-event', (req, res) => {
    res.send("oi");
})

router.get('/get-event', (req, res) => {
    res.send("ola");
})

export default router;