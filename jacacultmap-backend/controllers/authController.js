const { registerUser, authenticateUser } = require('../services/authService');

async function signUp (req, res) {
    try {
        const email = req.body['email']?.toLowerCase();
        const password = req.body['password'];

        await registerUser(email, password);
        res.json({ message: "Usuário cadastrado com sucesso!" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const signIn = async (req, res) => {
    console.log("Usuário logado:", req.body["email"]);
    res.json({ message: "Usuário logado com sucesso!" });
}

module.exports = {
  signUp,
  signIn
};