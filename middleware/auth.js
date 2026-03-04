const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'fundededge_secret_key_change_in_production';

// Middleware: require authentication — redirects to login if not authenticated
function requireAuth(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.redirect('/login');
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.clearCookie('token');
        return res.redirect('/login');
    }
}

// Middleware: inject user info into all responses (for nav rendering)
function injectUser(req, res, next) {
    const token = req.cookies.token;
    if (token) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded;
            res.locals.user = decoded;
        } catch (err) {
            res.clearCookie('token');
            res.locals.user = null;
        }
    } else {
        res.locals.user = null;
    }
    next();
}

module.exports = { requireAuth, injectUser, JWT_SECRET };
