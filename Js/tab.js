// Glass effect implementation using CSS variables
document.addEventListener('DOMContentLoaded', function() {
    // Glass effect manager
    const glassEffect = {
        // Apply glass effect using CSS classes
        applyGlassEffect(selector) {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.classList.add('glass');
            });
        },
        
        
        // Initialize glass effects
        init() {
            // Apply glass effect to cards
            this.applyGlassEffect('.glass-card');
            
            // Apply glass effect to buttons
            this.applyGlassEffect('.glass-button');
            
            // Apply glass effect to tabs
            this.applyGlassEffect('.glass-tab');
            this.applyGlassEffect('.glass-tab-pane');
        }
    };
    
    // Tab functionality
    const tabManager = {
        init() {
            // Use event delegation for tabs
            document.addEventListener('click', (e) => {
                if (e.target.classList.contains('glass-tab') || e.target.closest('.glass-tab')) {
                    const tab = e.target.classList.contains('glass-tab') ? e.target : e.target.closest('.glass-tab');
                    this.activateTab(tab);
                }
            });
            
            // Set initial active tab
            const activeTab = document.querySelector('.glass-tab.active');
            if (activeTab) {
                this.activateTab(activeTab);
            }
        },
        
        activateTab(tab) {
            // Get tab container
            const tabContainer = tab.closest('.tab-container');
            if (!tabContainer) return;
            
            // Get all tabs and panes in this container
            const tabs = tabContainer.querySelectorAll('.glass-tab');
            const tabPanes = tabContainer.querySelectorAll('.glass-tab-pane');
            
            // Deactivate all tabs and panes
            tabs.forEach(t => {
                t.classList.remove('active');
                t.style.background = '';
                t.style.color = '';
            });
            
            tabPanes.forEach(pane => {
                pane.classList.remove('active');
                pane.style.display = 'none';
            });
            
            // Activate clicked tab
            tab.classList.add('active');
            tab.style.background = 'rgba(255, 255, 255, 0.3)';
            tab.style.color = 'var(--primary)';
            
            // Show corresponding tab pane
            const tabId = tab.getAttribute('data-tab');
            const targetPane = document.getElementById(tabId);
            if (targetPane) {
                targetPane.classList.add('active');
                targetPane.style.display = 'block';
            }
        }
    };
    
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
        
        init() {
            if (this.button) this.button.addEventListener('click', () => this.open());
            if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.close());
            if (this.overlay) this.overlay.addEventListener('click', () => this.close());
            
            // Close menu when nav link is clicked
            document.addEventListener('click', (e) => {
                if (e.target.classList.contains('mobile-nav-link') || e.target.closest('.mobile-nav-link')) {
                    this.close();
                }
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
            document.addEventListener('click', (e) => {
                const item = e.target.closest('.notification-item');
                if (item) {
                    item.classList.remove('unread');
                }
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
            
            // Send message events
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
        init() {
            // Use event delegation for filter chips
            document.addEventListener('click', (e) => {
                const chip = e.target.closest('.filter-chip');
                if (chip) {
                    // Toggle active state
                    document.querySelectorAll('.filter-chip').forEach(c => {
                        c.classList.remove('active');
                        c.setAttribute('aria-pressed', 'false');
                    });
                    
                    chip.classList.add('active');
                    chip.setAttribute('aria-pressed', 'true');
                }
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
    
    // User profile badge functionality
    const userProfileBadge = {
        init() {
            // Add click event to user profile badge
            document.addEventListener('click', (e) => {
                const badge = e.target.closest('.user-profile-badge');
                if (badge) {
                    // Handle profile badge click
                    console.log('Profile badge clicked');
                    // You can add navigation to profile page here
                }
            });
        }
    };
    
    // Initialize all components
    glassEffect.init();
    tabManager.init();
    darkMode.init();
    mobileMenu.init();
    notifications.init();
    chatbot.init();
    filterChips.init();
    keyboardDetection.init();
    userProfileBadge.init();
});
  document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Example: simple local check (you can replace this with API verification)
    if (username === 'admin' && password === '1234') {
      // ✅ Save login flag
      localStorage.setItem('password', password); // or localStorage.setItem('loggedIn', 'true');
      
      // ✅ Redirect to home page
      window.location.href = 'home.html';
    } else {
      alert('Invalid username or password');
    }
  });

document.addEventListener('DOMContentLoaded', () => {
  // Example: check for a stored token or password
  const loggedIn = localStorage.getItem('password'); // or 'token', 'user', etc.

  if (!loggedIn) {
    // Not logged in → redirect to index.html
    window.location.href = 'index.html';
  }
});
// DOM Elements
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
const closeMobileMenu = document.getElementById('close-mobile-menu');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const mobileDarkModeToggle = document.getElementById('mobile-dark-mode-toggle');
const notificationToggle = document.getElementById('notification-toggle');
const notificationPanel = document.getElementById('notification-panel');
const closeNotifications = document.getElementById('close-notifications');
const chatbotButton = document.getElementById('chatbot-button');
const chatbotWindow = document.getElementById('chatbot-window');
const chatbotClose = document.getElementById('chatbot-close');
const chatbotInput = document.getElementById('chatbot-input');
const chatbotSend = document.getElementById('chatbot-send');
const chatbotMessages = document.getElementById('chatbot-messages');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    checkDarkMode();
});

// Setup event listeners
function setupEventListeners() {
    // Mobile menu
    mobileMenuButton.addEventListener('click', toggleMobileMenu);
    closeMobileMenu.addEventListener('click', toggleMobileMenu);
    mobileMenuOverlay.addEventListener('click', toggleMobileMenu);
    
    // Dark mode
    darkModeToggle.addEventListener('click', toggleDarkMode);
    mobileDarkModeToggle.addEventListener('click', toggleDarkMode);
    
    // Notifications
    notificationToggle.addEventListener('click', toggleNotifications);
    closeNotifications.addEventListener('click', toggleNotifications);
    
    // Chatbot
    chatbotButton.addEventListener('click', toggleChatbot);
    chatbotClose.addEventListener('click', toggleChatbot);
    chatbotSend.addEventListener('click', sendMessage);
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
    
    // Close notifications when clicking outside
    document.addEventListener('click', (e) => {
        if (!notificationPanel.contains(e.target) && !notificationToggle.contains(e.target) && !notificationPanel.classList.contains('hidden')) {
            toggleNotifications();
        }
    });
    
    // Close chatbot when clicking outside
    document.addEventListener('click', (e) => {
        if (!chatbotWindow.contains(e.target) && !chatbotButton.contains(e.target) && !chatbotWindow.classList.contains('hidden')) {
            toggleChatbot();
        }
    });
}

// Toggle mobile menu
function toggleMobileMenu() {
    mobileMenu.classList.toggle('translate-x-full');
    mobileMenuOverlay.classList.toggle('hidden');
}

// Toggle dark mode
function toggleDarkMode() {
    document.body.classList.toggle('dark');
    localStorage.setItem('darkMode', document.body.classList.contains('dark'));
    
    // Update icons
    const isDark = document.body.classList.contains('dark');
    darkModeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    mobileDarkModeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

// Check for saved dark mode preference
function checkDarkMode() {
    const isDark = localStorage.getItem('darkMode') === 'true';
    if (isDark) {
        document.body.classList.add('dark');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        mobileDarkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
}

// Toggle notifications panel
function toggleNotifications() {
    notificationPanel.classList.toggle('hidden');
}

// Toggle chatbot window
function toggleChatbot() {
    chatbotWindow.classList.toggle('hidden');
    if (!chatbotWindow.classList.contains('hidden')) {
        chatbotInput.focus();
    }
}

// Send a message in the chatbot
function sendMessage() {
    const message = chatbotInput.value.trim();
    if (message === '') return;
    
    // Add user message
    addMessage(message, 'sent');
    chatbotInput.value = '';
    
    // Simulate bot response
    setTimeout(() => {
        const responses = [
            "Thank you for your message. How can I assist you today?",
            "I understand your concern. Let me help you with that.",
            "Thanks for reaching out! Our team will get back to you soon.",
            "I'm here to help. Could you provide more details?",
            "That's a great question. Let me find the information for you."
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        addMessage(randomResponse, 'received');
    }, 1000);
}

// Add a message to the chat
function addMessage(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.innerHTML = `
        <div>
            <div class="message-bubble">${text}</div>
            <div class="message-time">${time}</div>
        </div>
    `;
    
    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}