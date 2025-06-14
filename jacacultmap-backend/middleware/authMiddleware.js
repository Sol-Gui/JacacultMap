import auth from '../services/authService.js';
const { verifyToken } = auth;

export async function authenticateWithToken(req, res) {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Não autorizado' });
        }
        const email = await verifyToken(token);
        if (!email) {
            return res.status(401).json({ message: 'Não autorizado' });
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