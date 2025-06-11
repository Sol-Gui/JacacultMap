import { registerUser, authenticateUser } from '../services/authService.js';
import { authenticateToken } from '../middleware/authMiddleware.mjs';

export async function signUp (req, res) {
    try {
        const email = req.body['email']?.toLowerCase();
        const password = req.body['password'];

        await registerUser(email, password);
        res.json({ message: "Usuário cadastrado com sucesso!" });
    } catch (error) {
        res.status(400).json({ message: error.message})
    }
}

export async function signIn (req, res) {
    try {
        const email = req.body['email']?.toLowerCase();
        const password = req.body['password'];

        await authenticateUser(email, password);
        res.json({ message: "Usuário logado com sucesso!"});
    } catch (error) {
        res.status(401).json({ message: error.message })
    }
}

export async function authenticateWithToken (req, res) {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const response = await authenticateToken(token);
        res.setHeader('Set-Cookie', response.cookie);
    } catch (error) {
       // Lógica do erro aqui 
    }
}

export async function validateToken(req, res) {
    const token = req.cookies.jwtToken;
    if (!token) {
        return res.status(401).json({ message: 'Não autorizado' });
    }

    try {
        const decoded = await verifyToken(token);
        res.json({ email: decoded.email });
    } catch (error) {
        console.error('Erro ao validar token:', error);
        res.status(401).json({ message: 'Não autorizado' });
    }
    
}