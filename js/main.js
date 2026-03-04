/* ============================================
   PROP FIRM — Shared JavaScript
   Navigation, animations, interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ── Navbar scroll effect ── */
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    /* ── Mobile hamburger ── */
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('open');
        });
        // Close on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('open');
            });
        });
    }

    /* ── Scroll reveal animations ── */
    const reveals = document.querySelectorAll('.reveal');
    if (reveals.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
        reveals.forEach(el => observer.observe(el));
    }

    /* ── FAQ accordion ── */
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const wasActive = item.classList.contains('active');
            // Close all
            faqItems.forEach(i => i.classList.remove('active'));
            // Open clicked if wasn't active
            if (!wasActive) item.classList.add('active');
        });
    });

    /* ── Legal tabs ── */
    const legalTabs = document.querySelectorAll('.legal-tab');
    const legalContents = document.querySelectorAll('.legal-content');
    legalTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            legalTabs.forEach(t => t.classList.remove('active'));
            legalContents.forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            const target = document.getElementById(tab.dataset.tab);
            if (target) target.classList.add('active');
        });
    });

    /* ── Counter animation ── */
    const counters = document.querySelectorAll('[data-count]');
    if (counters.length) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseFloat(el.dataset.count);
                    const prefix = el.dataset.prefix || '';
                    const suffix = el.dataset.suffix || '';
                    const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
                    const duration = 2000;
                    const start = performance.now();

                    function animate(now) {
                        const progress = Math.min((now - start) / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        const current = (target * eased).toFixed(decimals);
                        el.textContent = prefix + current + suffix;
                        if (progress < 1) requestAnimationFrame(animate);
                    }
                    requestAnimationFrame(animate);
                    counterObserver.unobserve(el);
                }
            });
        }, { threshold: 0.5 });
        counters.forEach(c => counterObserver.observe(c));
    }

    /* ── Dashboard chart (simple canvas line chart) ── */
    const chartCanvas = document.getElementById('equityChart');
    if (chartCanvas) {
        const ctx = chartCanvas.getContext('2d');
        const data = [10000, 10200, 10150, 10400, 10380, 10600, 10800, 10750, 11000, 11200, 11150, 11400,
            11350, 11600, 11800, 11700, 11900, 12100, 12050, 12300, 12500, 12450, 12700, 12900,
            13100, 13000, 13300, 13500, 13450, 13700];

        function drawChart() {
            const w = chartCanvas.width = chartCanvas.offsetWidth * 2;
            const h = chartCanvas.height = 500;
            ctx.scale(1, 1);

            const min = Math.min(...data) * 0.99;
            const max = Math.max(...data) * 1.01;
            const padding = { top: 30, right: 30, bottom: 30, left: 70 };
            const chartW = w - padding.left - padding.right;
            const chartH = h - padding.top - padding.bottom;

            // Clear
            ctx.clearRect(0, 0, w, h);

            // Grid lines
            ctx.strokeStyle = 'rgba(255,255,255,0.05)';
            ctx.lineWidth = 1;
            for (let i = 0; i <= 5; i++) {
                const y = padding.top + (chartH / 5) * i;
                ctx.beginPath();
                ctx.moveTo(padding.left, y);
                ctx.lineTo(w - padding.right, y);
                ctx.stroke();

                // Labels
                const val = max - ((max - min) / 5) * i;
                ctx.fillStyle = 'rgba(255,255,255,0.3)';
                ctx.font = '20px Inter';
                ctx.textAlign = 'right';
                ctx.fillText('$' + val.toFixed(0), padding.left - 10, y + 6);
            }

            // Gradient fill
            const gradient = ctx.createLinearGradient(0, padding.top, 0, h - padding.bottom);
            gradient.addColorStop(0, 'rgba(240, 185, 11, 0.15)');
            gradient.addColorStop(1, 'rgba(240, 185, 11, 0)');

            // Draw area
            ctx.beginPath();
            data.forEach((val, i) => {
                const x = padding.left + (chartW / (data.length - 1)) * i;
                const y = padding.top + chartH - ((val - min) / (max - min)) * chartH;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.lineTo(padding.left + chartW, h - padding.bottom);
            ctx.lineTo(padding.left, h - padding.bottom);
            ctx.closePath();
            ctx.fillStyle = gradient;
            ctx.fill();

            // Draw line
            ctx.beginPath();
            data.forEach((val, i) => {
                const x = padding.left + (chartW / (data.length - 1)) * i;
                const y = padding.top + chartH - ((val - min) / (max - min)) * chartH;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.strokeStyle = '#f0b90b';
            ctx.lineWidth = 3;
            ctx.stroke();

            // End dot
            const lastX = padding.left + chartW;
            const lastY = padding.top + chartH - ((data[data.length - 1] - min) / (max - min)) * chartH;
            ctx.beginPath();
            ctx.arc(lastX, lastY, 6, 0, Math.PI * 2);
            ctx.fillStyle = '#f0b90b';
            ctx.fill();
            ctx.beginPath();
            ctx.arc(lastX, lastY, 12, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(240,185,11,0.3)';
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        drawChart();
        window.addEventListener('resize', drawChart);
    }

    /* ── Dashboard Tabs ── */
    const dashNavLinks = document.querySelectorAll('.sidebar-nav a[data-tab]');
    const dashTabs = document.querySelectorAll('.dash-tab');

    if (dashNavLinks.length > 0 && dashTabs.length > 0) {
        dashNavLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('data-tab');
                const targetTab = document.getElementById(targetId);

                if (targetTab) {
                    dashNavLinks.forEach(l => l.classList.remove('active'));
                    dashTabs.forEach(t => t.classList.remove('active'));

                    link.classList.add('active');
                    targetTab.classList.add('active');
                }
            });
        });
    }

    /* ── Active nav highlight ── */
    const currentPage = window.location.pathname.split('/').pop() || '';
    document.querySelectorAll('.nav-links a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === '/' + currentPage || (currentPage === '' && href === '/')) {
            link.classList.add('active');
        }
    });

    /* ── Auth-Aware Navigation ── */
    async function updateNavForAuth() {
        try {
            const res = await fetch('/api/auth-status');
            const data = await res.json();

            const navLinksContainer = document.querySelector('.nav-links');
            if (!navLinksContainer) return;

            // Find the Start Challenge CTA to keep it at the end
            const ctaBtn = navLinksContainer.querySelector('.nav-cta');

            if (data.loggedIn) {
                // Remove Login if it exists
                const loginLink = Array.from(navLinksContainer.querySelectorAll('a')).find(a => a.textContent.includes('Log In'));
                if (loginLink) loginLink.remove();

                // Add Dashboard and Logout if they don't exist
                const hasDashboard = Array.from(navLinksContainer.querySelectorAll('a')).some(a => a.textContent === 'Dashboard');
                if (!hasDashboard) {
                    const dashLink = document.createElement('a');
                    dashLink.href = '/dashboard';
                    dashLink.textContent = 'Dashboard';
                    if (currentPage === 'dashboard') dashLink.classList.add('active');
                    navLinksContainer.insertBefore(dashLink, ctaBtn);
                }

                const hasLogout = Array.from(navLinksContainer.querySelectorAll('a')).some(a => a.textContent === 'Logout');
                if (!hasLogout) {
                    const logoutLink = document.createElement('a');
                    logoutLink.href = '/logout';
                    logoutLink.textContent = 'Logout';
                    navLinksContainer.insertBefore(logoutLink, ctaBtn);
                }
            } else {
                // Not logged in: Remove Dashboard/Logout, add Login
                Array.from(navLinksContainer.querySelectorAll('a')).forEach(a => {
                    if (a.textContent === 'Dashboard' || a.textContent === 'Logout') {
                        a.remove();
                    }
                });

                const hasLogin = Array.from(navLinksContainer.querySelectorAll('a')).some(a => a.textContent === 'Log In');
                if (!hasLogin) {
                    const loginLink = document.createElement('a');
                    loginLink.href = '/login';
                    loginLink.textContent = 'Log In';
                    loginLink.className = 'btn--login';
                    if (currentPage === 'login') loginLink.classList.add('active');
                    navLinksContainer.insertBefore(loginLink, ctaBtn);
                }
            }
        } catch (e) {
            console.error('Failed to fetch auth status', e);
        }
    }

    updateNavForAuth();

    /* ── AI Chatbox Component ── */
    function createChatbox() {
        const chatboxHTML = `
      <div id="ai-chat-widget">
        <button id="chat-toggle" aria-label="Open AI Assistant">
          <span class="icon">💬</span>
        </button>
        <div id="chat-window" class="hidden">
          <div class="chat-header">
            <div class="chat-title">
              <span class="status-dot"></span>
              FundedEdge AI
            </div>
            <button id="chat-close">✕</button>
          </div>
          <div class="chat-messages" id="chat-messages">
            <div class="message bot-message">
              Hi there! 👋 I'm the FundedEdge AI assistant. How can I help you with our trading challenges today?
            </div>
          </div>
          <form id="chat-form" class="chat-input-area">
            <input type="text" id="chat-input" placeholder="Type your question..." autocomplete="off">
            <button type="submit" id="chat-send">➤</button>
          </form>
        </div>
      </div>
    `;

        document.body.insertAdjacentHTML('beforeend', chatboxHTML);

        const toggleBtn = document.getElementById('chat-toggle');
        const closeBtn = document.getElementById('chat-close');
        const chatWindow = document.getElementById('chat-window');
        const chatForm = document.getElementById('chat-form');
        const chatInput = document.getElementById('chat-input');
        const messagesContainer = document.getElementById('chat-messages');

        // Toggle chat
        toggleBtn.addEventListener('click', () => {
            chatWindow.classList.toggle('hidden');
            if (!chatWindow.classList.contains('hidden')) {
                chatInput.focus();
            }
        });

        closeBtn.addEventListener('click', () => {
            chatWindow.classList.add('hidden');
        });

        // Handle messages
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = chatInput.value.trim();
            if (!text) return;

            // Add user message
            appendMessage(text, 'user-message');
            chatInput.value = '';

            // Simulate AI typing and response
            setTimeout(() => {
                const response = getAIResponse(text);
                appendMessage(response, 'bot-message');
            }, 600 + Math.random() * 500);
        });

        function appendMessage(text, className) {
            const msgDiv = document.createElement('div');
            msgDiv.className = `message ${className}`;
            msgDiv.textContent = text;
            messagesContainer.appendChild(msgDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        function getAIResponse(input) {
            const lower = input.toLowerCase();
            if (lower.includes('payout')) return "We offer weekly payouts with an 80% profit split. You can withdraw via Crypto (BTC, ETH, USDT) or Bank Transfer.";
            if (lower.includes('cost') || lower.includes('fee') || lower.includes('price')) return "Challenge fees vary by account size, starting at $99 for a $10K account up to $499 for a $100K account. It's a one-time fee.";
            if (lower.includes('rule') || lower.includes('drawdown')) return "Our main rules are a 5% daily loss limit and a 10% maximum overall drawdown. We also do not allow copy trading or latency arbitrage.";
            if (lower.includes('ea') || lower.includes('bot')) return "Yes, we fully support Expert Advisors (EAs) and automated trading bots, as long as they don't perform latency arbitrage or high-frequency tick trading.";
            if (lower.includes('news')) return "You are completely free to trade during news events. We have no restrictions on news trading.";
            return "Thanks for your question! I'm a demo AI. For specific help, please check our FAQ page or email support@fundededge.com.";
        }
    }

    // Initialize chatbox
    createChatbox();

});
