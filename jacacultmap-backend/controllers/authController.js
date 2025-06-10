const { createUser, userExists } = require('../services/userService');
const { hash } = require('bcrypt');

const signUp = async (req, res) => {

    const email = req.body["email"];
    const password = req.body["password"];
    const hashedPassword = await hash(password, 12);
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

    if (!email || !password) {
        return res.status(400).json({ error: "Email e senha são obrigatórios!" });
    }

    else if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Por favor, insira um email válido"});
    }

    else if (password.length < 6) {
        return res.status(400).json({ error: "A senha deve ter pelo menos 6 caracteres!" });
    }

    try {
        const exists = await userExists(email);
        if (exists) {
            console.log("Usuário já existe")
            return res.status(400).json({ error: "Email já cadastrado!" });
        }
        await createUser(email, hashedPassword);
        res.status(200).json({ message: "Usuário criado com sucesso!" });
    } catch (err) {
        res.status(500).json({ error: "Erro ao criar usuário: " + err.message });
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