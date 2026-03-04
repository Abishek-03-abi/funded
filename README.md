# FundedEdge — Prop Firm Trading Platform

FundedEdge is a modern, high-performance prop firm website built with a Node.js backend and a glassmorphic frontend. It features a complete evaluation flow, user authentication, a dynamic trading dashboard, and a crypto-integrated payment system.

## 🚀 Features

- **10+ Premium Pages**: Homepage, Challenges, Rules, Payouts, FAQ, Dashboard, and more.
- **Dynamic Dashboard**: Real-time calculation of equity, balance, P&L, drawdown limits, and trading history.
- **Secure Authentication**: JWT-based auth with HTTP-only cookies and bcrypt password hashing.
- **Crypto Payments**: Integrated USDT (TRC20) checkout modal for challenge purchases.
- **AI Assistant**: Built-in support chatbot to answer trader inquiries.
- **Clean UI**: Modern dark theme with gold accents, fully responsive for all devices.

## 🛠️ Tech Stack

- **Backend**: Node.js & Express.js
- **Database**: SQLite (via `better-sqlite3`)
- **Frontend**: Vanilla HTML5, CSS3, and JavaScript (No heavy frameworks)
- **Design**: Custom CSS Grid/Flexbox with glassmorphism effects.

## 📦 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- npm

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Abishek-03-abi/funded.git
   cd funded
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
4. Open your browser to: `http://localhost:3000`

## 🌐 Deployment (Render)

1. Create a new **Web Service** on [Render](https://render.com).
2. Connect your GitHub repository.
3. Set the following environment variables:
   - `JWT_SECRET`: A long random string.
   - `NODE_ENV`: `production`
4. Use `npm install` as the Build Command and `npm start` as the Start Command.

## 📂 Project Structure

- `/css` — Global styles and design system.
- `/js` — Core frontend logic, charts, and AI chatbot.
- `/db` — SQLite database and connection logic.
- `/routes` — Express API routes (Auth, Dashboard).
- `/middleware` — Authentication and security logic.
- `/views` — Authentication pages (Login/Register).
- `server.js` — Main entry point.

## 📄 License
This project is for demonstration purposes. All rights reserved.
