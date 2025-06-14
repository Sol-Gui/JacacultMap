import { registerUser, authenticateUser } from '../services/authService.js';

export async function signUp (req, res) {
    try {
        const email = req.body['email']?.toLowerCase();
        const password = req.body['password'];

        const response = await registerUser(email, password);
        res.json({ message: response });
    } catch (error) {
        res.status(400).json({ message: error.message})
    }
}

export async function signIn (req, res) {
    try {
        const email = req.body['email']?.toLowerCase();
        const password = req.body['password'];

        const response = await authenticateUser(email, password);
        res.json({ message: response });
    } catch (error) {
        res.status(401).json({ message: error.message })
    }
}