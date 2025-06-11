import auth from '../services/authService.js';
const { verifyToken } = auth;
import cookie from 'cookie';

export async function authenticateToken(token) {
    try {
        if (!token) {
            throw new Error('Não autorizado');
        }

        const email = await verifyToken(token);

        if (!email) {
            throw new Error('Não autorizado');
        }
        
        const secureCookie = true;
        const httpOnlyCookie = true;
        const sameSiteCookie = 'Strict';
        const cookieOptions = {
            sameSite: sameSiteCookie,
            secure: secureCookie,
            maxAge: 86400 * 7, // 86400 * 7 = 7 days
            path: '/',
            httpOnly: httpOnlyCookie,
        };

        const cookieString = cookie.serialize('jwtToken', token, cookieOptions)

        return {
            sucess: true,
            email: email,
            cookie: cookieString,
            token: token
        };
    
  } catch (error) {
        console.error('Authentication error:', error);
        throw new Error('Internal server error');
  }
}