import { generateGoogleLoginUrl, getGoogleTokens } from '../services/socialAuthService.js';
import { registerOrLoginWithGoogle } from '../services/socialAuthService.js';
import { detectClientOrigin, getFrontendUrl, logClientOrigin } from '../utils/clientDetection.js';
//import crypto from 'crypto';

// STATE DESATIVADO POR MOTIVOS DE FACILIDADE DE DESENVOLVIMENTO


export async function loginWithGoogle(req, res) {

    /**const state = crypto.randomBytes(32).toString('hex');
    
    req.session = req.session || {};
    req.session.oauthState = state;

    console.log(req.session.oauthState);**/

    const url = await generateGoogleLoginUrl(/**state**/);
    console.log("Google Login URL:", url);
    res.json({url});
}

export async function loginWithGoogleCallback(req, res) {
    const { code } = req.query;
    console.log("Código recebido:", code);
    /**const { code, state } = req.query;
    console.log("\nstate:", state, "session", req.session.oauthState);
    console.log("\ncode:", code);**/
  
    try {
        // Verificar state para proteção CSRF
        /**if (!state || !req.session?.oauthState || state !== req.session.oauthState) {
            return res.status(400).json({ error: 'Estado inválido - possível ataque CSRF' });
        }
        
        // Limpar state da sessão
        delete req.session.oauthState;**/
        
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

        // Detectar origem da requisição (web vs app mobile)
        const clientInfo = detectClientOrigin(req);
        const frontendUrl = getFrontendUrl(clientInfo);
        
        logClientOrigin(clientInfo, req);
        console.log({
            origin: clientInfo.isApp ? 'APP' : 'WEB',
            method: clientInfo.source,
            redirectUrl: frontendUrl
        });
        
        return res.redirect(`${frontendUrl}/auth-callback?code=${code}`);
    } catch (error) {
        res.status(400).json({ error: 'Falha no login' });
        console.log(error)
    }
}

export async function useCode(req, res) {
    const { code } = req.body;
    try {
        const data = await getGoogleTokens(code);
        const result = await registerOrLoginWithGoogle(data.user.name, data.user.email);
        res.json({
            success: true,
            token: result.token
        });
    } catch (error) {
        console.error("Erro ao usar o código:", error);
        throw new Error("Falha ao usar o código do Google");
    }
}