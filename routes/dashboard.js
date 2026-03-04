const express = require('express');
const db = require('../db/database');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET /dashboard — protected
router.get('/dashboard', requireAuth, (req, res) => {
    res.sendFile('dashboard.html', { root: '.' });
});

// GET /api/dashboard — return dashboard data as JSON
router.get('/api/dashboard', requireAuth, (req, res) => {
    try {
        const userId = req.user.id;

        // Get active challenge
        const challenge = db.prepare(
            'SELECT * FROM challenges WHERE user_id = ? ORDER BY created_at DESC LIMIT 1'
        ).get(userId);

        if (!challenge) {
            return res.json({
                user: req.user,
                challenge: null,
                trades: [],
                stats: null
            });
        }

        // Get recent trades
        const trades = db.prepare(
            'SELECT * FROM trades WHERE challenge_id = ? ORDER BY opened_at DESC LIMIT 10'
        ).all(challenge.id);

        // Calculate stats
        const profit = challenge.balance - challenge.account_size;
        const profitPercent = ((profit / challenge.account_size) * 100).toFixed(2);
        const todayPnl = trades
            .filter(t => t.status === 'closed')
            .slice(0, 3)
            .reduce((sum, t) => sum + t.pnl, 0);

        const stats = {
            balance: challenge.balance,
            equity: challenge.equity,
            accountSize: challenge.account_size,
            profit: profit,
            profitPercent: profitPercent,
            todayPnl: todayPnl,
            availablePayout: (Math.max(0, profit) * 0.8).toFixed(2),
            dailyLossUsed: challenge.daily_loss_used || 0,
            maxDrawdownUsed: challenge.max_drawdown_used || 0,
            status: challenge.status,
            daysSinceStart: Math.floor(
                (Date.now() - new Date(challenge.created_at).getTime()) / (1000 * 60 * 60 * 24)
            )
        };

        res.json({
            user: req.user,
            challenge,
            trades,
            stats
        });
    } catch (err) {
        console.error('Dashboard API error:', err);
        res.status(500).json({ error: 'Failed to load dashboard data' });
    }
});

module.exports = router;
