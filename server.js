const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const { injectUser } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(injectUser);

// Static files (CSS, JS, assets)
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Routes
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');

app.use(authRoutes);
app.use(dashboardRoutes);

// Public pages
const publicPages = [
    { route: '/', file: 'index.html' },
    { route: '/how-it-works', file: 'how-it-works.html' },
    { route: '/challenges', file: 'challenges.html' },
    { route: '/trading-rules', file: 'trading-rules.html' },
    { route: '/payouts', file: 'payouts.html' },
    { route: '/faq', file: 'faq.html' },
    { route: '/affiliate', file: 'affiliate.html' },
    { route: '/about', file: 'about.html' },
    { route: '/legal', file: 'legal.html' }
];

publicPages.forEach(({ route, file }) => {
    app.get(route, (req, res) => {
        res.sendFile(path.join(__dirname, file));
    });
});

// API: auth status for client-side nav
app.get('/api/auth-status', (req, res) => {
    res.json({
        loggedIn: !!res.locals.user,
        user: res.locals.user || null
    });
});

// 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'index.html'));
});

// Start
app.listen(PORT, () => {
    console.log(`\n  🚀 FundedEdge server running at http://localhost:${PORT}\n`);
});
