import { verifyToken } from '../services/authService.js';

export async function authenticateWithToken(req, res) {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            throw new Error('Não autorizado');
        }
        const email = await verifyToken(token);
        if (!email) {
            throw new Error('Não autorizado');
        }
        return res.json({
            success: true,
            email: email,
            token: token
        });
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}