export function detectClientOrigin(req) {
    const clientHeader = req.headers['x-client']?.toLowerCase();
    
    if (clientHeader === 'app') {
        return {
            isApp: true,
            isWeb: false,
            source: 'header'
        };
    }
    
    if (clientHeader === 'web') {
        return {
            isApp: false,
            isWeb: true,
            source: 'header'
        };
    }
    
    const clientParam = req.query.client?.toLowerCase();
    
    if (clientParam === 'app') {
        return {
            isApp: true,
            isWeb: false,
            source: 'query'
        };
    }
    
    if (clientParam === 'web') {
        return {
            isApp: false,
            isWeb: true,
            source: 'query'
        };
    }
    
    const userAgent = req.headers['user-agent'] || '';
    

    const appPatterns = [
        /Expo/i,                    // Expo apps
        /ReactNative/i,             // React Native
        /Cordova/i,                 // Cordova apps
        /ionic/i,                   // Ionic apps
        /NativeScript/i,            // NativeScript
        /okhttp/i,                  // Android WebView
        /CFNetwork/i,               // iOS WebView
        /Mobile Safari.*WebView/i   // Safari WebView
    ];
    
    const isApp = appPatterns.some(pattern => pattern.test(userAgent));
    
    return {
        isApp,
        isWeb: !isApp,
        source: 'user-agent',
        userAgent
    };
}

export function clientDetectionMiddleware(req, res, next) {
    req.client = detectClientOrigin(req);
    next();
}

export function getFrontendUrl(clientInfo) {
    if (clientInfo.isApp) {
        return process.env.DEVELOPMENT_URL_FRONTEND || 'myapp://';
    }
    return process.env.PRODUCTION_URL_FRONTEND || 'http://jacacultmap-app.vercel.app';
}

export function logClientOrigin(clientInfo, req) {
    console.log({
        timestamp: new Date().toISOString(),
        origin: clientInfo.isApp ? 'APP' : 'WEB',
        source: clientInfo.source,
        userAgent: req.headers['user-agent']?.substring(0, 100),
        ip: req.ip,
        url: req.originalUrl
    });
}
