const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/database');
const { JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// GET /login
router.get('/login', (req, res) => {
    if (res.locals.user) return res.redirect('/dashboard');
    res.sendFile('login.html', { root: './views' });
});

// GET /register
router.get('/register', (req, res) => {
    if (res.locals.user) return res.redirect('/dashboard');
    res.sendFile('register.html', { root: './views' });
});

// POST /api/register
router.post('/api/register', async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        // Check if email exists
        const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
        if (existing) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Insert user
        const result = db.prepare(
            'INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)'
        ).run(fullName, email, passwordHash);

        // Create a default $50K challenge for the user
        db.prepare(
            'INSERT INTO challenges (user_id, account_size, fee, balance, equity) VALUES (?, ?, ?, ?, ?)'
        ).run(result.lastInsertRowid, 50000, 299, 50000, 50000);

        res.json({ success: true, redirect: '/login?registered=1' });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ error: 'Server error. Please try again.' });
    }
});

// POST /api/login
router.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user
        const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Compare password
        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, fullName: user.full_name },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            sameSite: 'lax'
        });

        res.json({ success: true, redirect: '/dashboard' });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Server error. Please try again.' });
    }
});

// GET /logout
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});

// GET /api/me — return current user info
router.get('/api/me', (req, res) => {
    if (!res.locals.user) {
        return res.status(401).json({ loggedIn: false });
    }
    res.json({ loggedIn: true, user: res.locals.user });
});

module.exports = router;
