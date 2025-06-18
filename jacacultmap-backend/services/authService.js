import { compare, hash } from 'bcrypt';
import { createUser, userExists } from './userService.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { connectToDatabase } from "./database.js";

dotenv.config({ path: "../.env" });

export async function createToken(email) {
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return token;
}

export async function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
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

export async function registerUser(name, email, password) {
    await connectToDatabase();
    try {
        if (typeof name !== 'string') throw new Error('Nome inválido');
        if (typeof email !== 'string') throw new Error('Email inválido');
        if (typeof password !== 'string') throw new Error('Senha inválida');

        if (!email || !password) {
            throw new Error("Email e senha são obrigatórios!");
        }

        if (!name) {
            throw new Error("Por favor, insira um nome")
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

        const hashedPassword = await hash(password, 8);
        await createUser(name, email, hashedPassword);
        const token = await createToken(email);

        return {
            success: true,
            message: "Usuário criado com sucesso!",
            token
        };

    } catch (error) {
        console.error("Erro ao registrar usuário:", error.message);
        throw new Error(error.message || "Erro ao registrar usuário, tente novamente mais tarde.");
    }
};

export async function authenticateUser (email, password) {
    await connectToDatabase();
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
        throw new Error(error.message || "Erro ao autenticar usuário, tente novamente mais tarde.");
    }
};

export default {
  createToken,
  verifyToken,
  registerUser,
  authenticateUser,
};