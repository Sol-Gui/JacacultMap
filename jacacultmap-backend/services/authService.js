const { compare, hash } = require('bcrypt');
const { createUser, userExists } = require('./userService');
const { sign, verify } = require('jsonwebtoken');
const dotenv = require("dotenv");

dotenv.config({ path: "../.env" });

async function createToken(email) {
    const token = sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return token;
}

async function verifyToken(token) {
    try {
        const decoded = verify(token, process.env.JWT_SECRET);
        return decoded.email;
    } catch (err) {
        console.log("Token inválido ou expirado!");
        return null;
    }
}

async function validateEmail(email) {
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    return emailRegex.test(email);
};

async function validatePasswordLength(password) {
    return typeof password === "string" && password.length >= 6;
};

async function registerUser(email, password) {
    try {
        if (!validateEmail(email)) {
            throw new Error("Por favor, insira um email válido");
        }

        if (!email || !password) {
            throw new Error("Email e senha são obrigatórios!");
        }

        if (!validateEmail(email)) {
            throw new Error("Por favor, insira um email válido");
        }

        if (!validatePasswordLength(password)) {
            throw new Error("A senha deve ter pelo menos 6 caracteres!");
        }

        const exists = await userExists(email);
        if (exists) {
            throw new Error("Email já cadastrado!");
        }

        const hashedPassword = await hash(password, 12);
        await createUser(email, hashedPassword);
        const token = await createToken(email);

        return {
            success: true,
            message: "Usuário criado com sucesso!",
            token
        };

    } catch (error) {
        console.error("Erro ao registrar usuário:", error.message);
        throw new Error("Erro ao registrar usuário, tente novamente mais tarde.");
    }
};

async function authenticateUser (email, password) {
    try {
        if (!email || !password) {
            throw new Error("Email e senha são obrigatórios!");
        }

        const user = await userExists(email);
        if (!user) {
            throw new Error("Email ou senha inválidos!");
        }

        const isValidPassword = await compare(password, user.password);
        if (!isValidPassword) {
            throw new Error("Email ou senha inválidos!");
        }

        const token = await createToken(email);

        return {
            success: true,
            message: "Usuário autenticado com sucesso!",
            token
        };
    
    } catch (error) {
        console.error("Erro ao autenticar usuário:", error.message);
        throw new Error("Erro ao autenticar usuário, tente novamente mais tarde.");
    }
};

async function autoAuthenticateUser(token) {
    try {
        const email = await verifyToken(token);
        if (!email) {
            throw new Error("Token inválido ou expirado!");
        }

        const user = await userExists(email);
        if (!user) {
            throw new Error("Usuário não encontrado!");
        }

        return {
            success: true,
            message: "Usuário autenticado com sucesso!",
            email
        };

    } catch (error) {
        console.error("Erro ao autenticar usuário automaticamente:", error.message);
    }
}

module.exports = {
    registerUser,
    authenticateUser,
    createToken,
    verifyToken
};