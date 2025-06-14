import auth from '../services/authService.js';
const { verifyToken } = auth;

export async function authenticateToken(token) {
    try {
        if (!token) {
            throw new Error('Não autorizado');
        }

        const email = await verifyToken(token);

        if (!email) {
            throw new Error('Não autorizado');
        }

        return {
            sucess: true,
            email: email,
            token: token
        };
    
  } catch (error) {
        console.error('Authentication error:', error);
        throw new Error('Internal server error');
  }
}

export async function authenticateWithToken (req, res) {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const response = await authenticateToken(token);
        if (!response) {
            return res.status(401).json({ message: 'Não autorizado' });
        }
        return response;
    } catch (error) {
        console.error('Erro ao autenticar com token:', error);
        res.status(401).json({ message: 'Não autorizado' });
    }
}