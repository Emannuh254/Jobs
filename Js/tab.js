// Dark mode toggle and mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    // Dark mode functionality
    const darkMode = {
        toggle: document.getElementById('dark-mode-toggle'),
        mobileToggle: document.getElementById('mobile-dark-mode-toggle'),
        body: document.body,
        
        init() {
            // Check for saved preference
            const currentTheme = localStorage.getItem('theme') || 'light';
            if (currentTheme === 'dark') {
                this.body.classList.add('dark');
                this.updateIcons('dark');
            }
            
            // Add event listeners
            if (this.toggle) this.toggle.addEventListener('click', () => this.toggleMode());
            if (this.mobileToggle) this.mobileToggle.addEventListener('click', () => this.toggleMode());
        },
        
        toggleMode() {
            this.body.classList.toggle('dark');
            const theme = this.body.classList.contains('dark') ? 'dark' : 'light';
            localStorage.setItem('theme', theme);
            this.updateIcons(theme);
        },
        
        updateIcons(theme) {
            const icon = theme === 'dark' ? 'fa-sun' : 'fa-moon';
            const mobileText = theme === 'dark' ? '<i class="fas fa-sun mr-3"></i> Dark Mode' : '<i class="fas fa-moon mr-3"></i> Dark Mode';
            
            if (this.toggle) this.toggle.innerHTML = `<i class="fas ${icon}"></i>`;
            if (this.mobileToggle) this.mobileToggle.innerHTML = mobileText;
        }
    };
    
    // Mobile menu functionality
    const mobileMenu = {
        button: document.getElementById('mobile-menu-button'),
        navbar: document.getElementById('mobile-side-navbar'),
        overlay: document.getElementById('mobile-menu-overlay'),
        closeBtn: document.getElementById('close-mobile-menu'),
        navLinks: document.querySelectorAll('.mobile-nav-link'),
        
        init() {
            if (this.button) this.button.addEventListener('click', () => this.open());
            if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.close());
            if (this.overlay) this.overlay.addEventListener('click', () => this.close());
            
            // Close menu when nav link is clicked
            this.navLinks.forEach(link => {
                link.addEventListener('click', () => this.close());
            });
        },
        
        open() {
            if (this.navbar && this.overlay) {
                this.navbar.classList.add('open');
                this.overlay.classList.add('open');
                document.body.style.overflow = 'hidden';
            }
        },
        
        close() {
            if (this.navbar && this.overlay) {
                this.navbar.classList.remove('open');
                this.overlay.classList.remove('open');
                document.body.style.overflow = '';
            }
        }
    };
    
    // Notification panel functionality
    const notifications = {
        toggle: document.getElementById('notification-toggle'),
        panel: document.getElementById('notification-panel'),
        closeBtn: document.getElementById('close-notifications'),
        notificationItems: document.querySelectorAll('.notification-item'),
        
        init() {
            if (this.toggle) this.toggle.addEventListener('click', () => this.togglePanel());
            if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.closePanel());
            
            // Close when clicking outside
            document.addEventListener('click', (e) => {
                if (this.panel && this.toggle && 
                    !this.panel.contains(e.target) && 
                    !this.toggle.contains(e.target)) {
                    this.closePanel();
                }
            });
            
            // Mark as read when clicked
            this.notificationItems.forEach(item => {
                item.addEventListener('click', () => {
                    item.classList.remove('unread');
                });
            });
        },
        
        togglePanel() {
            if (this.panel) {
                this.panel.style.display = this.panel.style.display === 'flex' ? 'none' : 'flex';
                if (this.panel.style.display === 'flex') {
                    mobileMenu.close(); // Close mobile menu if open
                }
            }
        },
        
        closePanel() {
            if (this.panel) {
                this.panel.style.display = 'none';
            }
        }
    };
    
    // Chatbot functionality
    const chatbot = {
        button: document.getElementById('chatbot-button'),
        mobileToggle: document.getElementById('mobile-chatbot-toggle'),
        window: document.getElementById('chatbot-window'),
        closeBtn: document.getElementById('chatbot-close'),
        input: document.getElementById('chatbot-input'),
        sendBtn: document.getElementById('chatbot-send'),
        messagesContainer: document.getElementById('chatbot-messages'),
        
        responses: {
            job: "For job-related questions, please check our Jobs page or contact our recruitment team at recruitment@derrickmawirajobs.com.",
            account: "For account issues, you can reset your password from the login page or contact our support team at support@derrickmawirajobs.com.",
            referral: "For referral questions, please visit our Referrals page or email referrals@derrickmawirajobs.com.",
            profile: "You can manage your profile, resume, and other career resources from your account dashboard. If you need specific help, please let me know what you're trying to do.",
            token: "You can earn tokens by completing tasks, referring candidates, and participating in community events. You can redeem tokens for premium services or features on our platform.",
            default: "Thank you for your message. Our support team will get back to you soon."
        },
        
        init() {
            if (this.button) this.button.addEventListener('click', () => this.open());
            if (this.mobileToggle) this.mobileToggle.addEventListener('click', () => this.open());
            if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.close());
            if (this.sendBtn) this.sendBtn.addEventListener('click', () => this.sendMessage());
            if (this.input) this.input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.sendMessage();
            });
        },
        
        open() {
            if (this.window) {
                this.window.style.display = 'flex';
                if (this.input) this.input.focus();
                mobileMenu.close(); // Close mobile menu if open
                notifications.closePanel(); // Close notifications if open
            }
        },
        
        close() {
            if (this.window) {
                this.window.style.display = 'none';
            }
        },
        
        sendMessage() {
            if (!this.input || !this.messagesContainer) return;
            
            const message = this.input.value.trim();
            if (!message) return;
            
            // Add user message
            this.addMessage(message, 'sent');
            this.input.value = '';
            
            // Show typing indicator
            const typingId = this.showTypingIndicator();
            
            // Simulate admin response
            setTimeout(() => {
                this.removeTypingIndicator(typingId);
                const response = this.generateResponse(message);
                this.addMessage(response, 'received');
            }, 1500);
        },
        
        addMessage(text, type) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${type}`;
            
            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            messageDiv.innerHTML = `
                <div>
                    <div class="message-bubble">${text}</div>
                    <div class="message-time">${time}</div>
                </div>
            `;
            
            this.messagesContainer.appendChild(messageDiv);
            this.scrollToBottom();
        },
        
        showTypingIndicator() {
            const typingId = `typing-${Date.now()}`;
            const typingDiv = document.createElement('div');
            typingDiv.id = typingId;
            typingDiv.className = 'message received';
            typingDiv.innerHTML = `
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            `;
            
            this.messagesContainer.appendChild(typingDiv);
            this.scrollToBottom();
            return typingId;
        },
        
        removeTypingIndicator(id) {
            const indicator = document.getElementById(id);
            if (indicator) {
                indicator.remove();
            }
        },
        
        generateResponse(message) {
            const lowerMessage = message.toLowerCase();
            
            // Check for keywords
            for (const [key, response] of Object.entries(this.responses)) {
                if (key !== 'default' && lowerMessage.includes(key)) {
                    return response;
                }
            }
            
            // Check for additional keywords
            if (lowerMessage.includes('apply') || lowerMessage.includes('vacancy')) {
                return this.responses.job;
            }
            
            if (lowerMessage.includes('login') || lowerMessage.includes('password')) {
                return this.responses.account;
            }
            
            if (lowerMessage.includes('refer') || lowerMessage.includes('referral')) {
                return this.responses.referral;
            }
            
            if (lowerMessage.includes('resume') || lowerMessage.includes('cv')) {
                return this.responses.profile;
            }
            
            if (lowerMessage.includes('balance') || lowerMessage.includes('points')) {
                return this.responses.token;
            }
            
            return this.responses.default;
        },
        
        scrollToBottom() {
            if (this.messagesContainer) {
                this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
            }
        }
    };
    
    // Filter chips functionality
    const filterChips = {
        chips: document.querySelectorAll('.filter-chip'),
        
        init() {
            this.chips.forEach(chip => {
                chip.addEventListener('click', function() {
                    // Toggle active state
                    filterChips.chips.forEach(c => {
                        c.classList.remove('active');
                        c.setAttribute('aria-pressed', 'false');
                    });
                    
                    this.classList.add('active');
                    this.setAttribute('aria-pressed', 'true');
                });
            });
        }
    };
    
    // Keyboard detection for mobile devices
    const keyboardDetection = {
        originalHeight: window.innerHeight,
        chatWindow: document.querySelector('.chatbot-window'),
        
        init() {
            window.addEventListener('resize', () => {
                if (window.innerHeight < this.originalHeight * 0.8) {
                    // Keyboard is open
                    if (this.chatWindow) this.chatWindow.classList.add('keyboard-open');
                } else {
                    // Keyboard is closed
                    if (this.chatWindow) this.chatWindow.classList.remove('keyboard-open');
                }
            });
        }
    };
    
    // Initialize all components
    darkMode.init();
    mobileMenu.init();
    notifications.init();
    chatbot.init();
    filterChips.init();
    keyboardDetection.init();
});