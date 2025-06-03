const { createUser } = require('../services/userService');

const signUp = async (req, res) => {
    if (!req.body["email"] || !req.body["password"]) {
        return res.status(400).json({ error: "Email e senha são obrigatórios!" });
    }

    createUser(req.body["email"], req.body["password"])
        .then(() => res.status(200).json({ message: "Usuário criado com sucesso!" }))
        .catch(err => res.status(500).json({ error: "Erro ao criar usuário: " + err.message }));
}

const signIn = async (req, res) => {
    console.log("Usuário logado:", req.body["email"]);
    res.json({ message: "Usuário logado com sucesso!" });
}

module.exports = {
  signUp,
  signIn
};