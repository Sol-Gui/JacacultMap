import { generateGoogleLoginUrl, getGoogleTokens } from '../services/socialAuthService.js';
import crypto from 'crypto';

export async function loginWithGoogle(req, res) {

    const state = crypto.randomBytes(32).toString('hex');
    
    req.session = req.session || {};
    req.session.oauthState = state;

    const url = await generateGoogleLoginUrl(state);
    res.redirect(url);
}

export async function loginWithGoogleCallback(req, res) {
    const { code, state } = req.query;
  
    try {
        // Verificar state para proteção CSRF
        if (!state || !req.session?.oauthState || state !== req.session.oauthState) {
        return res.status(400).json({ error: 'Estado inválido - possível ataque CSRF' });
        }
        
        // Limpar state da sessão
        delete req.session.oauthState;

        const data = await getGoogleTokens(code);
        
        res.set({
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'X-XSS-Protection': '1; mode=block',
            'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
            'Referrer-Policy': 'strict-origin-when-cross-origin'
        });

        res.json({
            message: 'Login OK',
            user: {
                email: data.user.email,
                name: data.user.name,
                picture: data.user.picture
            },
            tokens: data.tokens
        });

    } catch (error) {
    res.status(400).json({ error: 'Falha no login' });
  }

}