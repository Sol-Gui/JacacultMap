import dotenv from 'dotenv';
import { OAuth2Client } from 'google-auth-library';
import { connectToDatabase } from './database.js';
import { validateEmail, createToken } from './authService.js';
import { createUser, userExists } from './userService.js';

dotenv.config({ path: ".env" });

const oauth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    //"https://jacacultmap-backend-server.vercel.app/auth/google/callback"
    "http://localhost:3000/auth/google/callback" // URL de callback para desenvolvimento
);

export async function generateGoogleLoginUrl(state) {
    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        include_granted_scopes: true,
        scope: ['openid', 'email', 'profile'],
        state: state, // Adicionar state para proteção CSRF
    });
    return url
}

export async function getGoogleTokens(code) {
    try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        const ticket = await oauth2Client.verifyIdToken({
        idToken: tokens.id_token,
        audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        return {
            user: {
                email: payload.email,
                name: payload.name,
                picture: payload.picture
            },
            tokens: tokens
        };
    } catch (error) {
        console.error("Erro ao obter tokens do Google:", error);
        throw new Error("Falha ao obter tokens do Google");
    }
}

export async function registerOrLoginWithGoogle(name, email) {
    await connectToDatabase();
    try {
        if (typeof name !== 'string') throw new Error('Nome inválido');
        if (typeof email !== 'string') throw new Error('Email inválido');

        if (!email) {
            throw new Error("Email é obrigatório!");
        }

        if (!name) {
            throw new Error("Nome inválido!")
        }

        if (!validateEmail(email)) {
            throw new Error("Email inválido!");
        }

        const exists = await userExists(email);
        if (exists) {
            console.log("Usuário já cadastrado:", exists);
            return {
                success: true,
                message: "Usuário já cadastrado!",
                token: await createToken(email)
            };
        }

        await createUser(name, email, null, 'google');
        const token = await createToken(email);

        return {
            success: true,
            message: "Usuário criado com sucesso!",
            token
        };

    } catch (error) {
        console.error("Erro ao registrar usuário social:", error.message);
        throw new Error(error.message || "Erro ao registrar usuário social, tente novamente mais tarde.");
    }
}