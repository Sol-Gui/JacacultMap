import dotenv from 'dotenv';
import { OAuth2Client } from 'google-auth-library';

dotenv.config({ path: ".env" });

const oauth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "https://jacacultmap-backend-server.vercel.app/auth/google/callback"
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
}