import { registerUser, authenticateUser } from '../services/authService.js';

export async function signUp (req, res) {
    try {
        const name = req.body['name']
        const email = req.body['email']?.toLowerCase();
        const password = req.body['password'];

        const response = await registerUser(name, email, password,  'local');
        res.json(response);
    } catch (error) {
        res.status(400).json({ message: error.message})
    }
}

export async function signIn (req, res) {
    try {
        const email = req.body['email']?.toLowerCase();
        const password = req.body['password'];

        const response = await authenticateUser(email, password);
        res.json(response);
    } catch (error) {
        res.status(401).json({ message: error.message })
    }
}