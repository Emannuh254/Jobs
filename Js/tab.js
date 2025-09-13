// Dark mode toggle and mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    // Dark mode toggle
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const mobileDarkModeToggle = document.getElementById('mobile-dark-mode-toggle');
    const body = document.body;
    
    // Check for saved dark mode preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    if (currentTheme === 'dark') {
        body.classList.add('dark');
        if (darkModeToggle) {
            darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
        if (mobileDarkModeToggle) {
            mobileDarkModeToggle.innerHTML = '<i class="fas fa-sun mr-3"></i> Dark Mode';
        }
    }
    
    function toggleDarkMode() {
        body.classList.toggle('dark');
        const theme = body.classList.contains('dark') ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
        
        // Update the icon
        if (theme === 'dark') {
            if (darkModeToggle) {
                darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            }
            if (mobileDarkModeToggle) {
                mobileDarkModeToggle.innerHTML = '<i class="fas fa-sun mr-3"></i> Dark Mode';
            }
        } else {
            if (darkModeToggle) {
                darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            }
            if (mobileDarkModeToggle) {
                mobileDarkModeToggle.innerHTML = '<i class="fas fa-moon mr-3"></i> Dark Mode';
            }
        }
    }
    
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
    }
    
    if (mobileDarkModeToggle) {
        mobileDarkModeToggle.addEventListener('click', toggleDarkMode);
    }
    
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileSideNavbar = document.getElementById('mobile-side-navbar');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const closeMobileMenu = document.getElementById('close-mobile-menu');
    
    function openMobileMenu() {
        if (mobileSideNavbar && mobileMenuOverlay) {
            mobileSideNavbar.classList.add('open');
            mobileMenuOverlay.classList.add('open');
            document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
        }
    }
    
    function closeMobileMenuFunction() {
        if (mobileSideNavbar && mobileMenuOverlay) {
            mobileSideNavbar.classList.remove('open');
            mobileMenuOverlay.classList.remove('open');
            document.body.style.overflow = ''; // Enable scrolling again
        }
    }
    
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', openMobileMenu);
    }
    
    if (closeMobileMenu) {
        closeMobileMenu.addEventListener('click', closeMobileMenuFunction);
    }
    
    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', closeMobileMenuFunction);
    }
    
    // Notification panel toggle
    const notificationToggle = document.getElementById('notification-toggle');
    const notificationPanel = document.getElementById('notification-panel');
    const closeNotifications = document.getElementById('close-notifications');
    
    function toggleNotificationPanel() {
        if (notificationPanel) {
            if (notificationPanel.style.display === 'flex') {
                notificationPanel.style.display = 'none';
            } else {
                notificationPanel.style.display = 'flex';
                
                // Close mobile menu if open
                if (mobileSideNavbar && mobileSideNavbar.classList.contains('open')) {
                    closeMobileMenuFunction();
                }
            }
        }
    }
    
    function closeNotificationPanel() {
        if (notificationPanel) {
            notificationPanel.style.display = 'none';
        }
    }
    
    if (notificationToggle) {
        notificationToggle.addEventListener('click', toggleNotificationPanel);
    }
    
    if (closeNotifications) {
        closeNotifications.addEventListener('click', closeNotificationPanel);
    }
    
    // Close notification panel when clicking outside
    document.addEventListener('click', function(event) {
        if (notificationPanel && notificationToggle) {
            if (!notificationPanel.contains(event.target) && !notificationToggle.contains(event.target)) {
                notificationPanel.style.display = 'none';
            }
        }
    });
    
    // Chatbot functionality
    const chatbotButton = document.getElementById('chatbot-button');
    const mobileChatbotToggle = document.getElementById('mobile-chatbot-toggle');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');
    const chatbotMessages = document.getElementById('chatbot-messages');
    
    function openChatbot() {
        if (chatbotWindow) {
            chatbotWindow.style.display = 'flex';
            if (chatbotInput) {
                chatbotInput.focus();
            }
            // Close mobile menu if open
            if (mobileSideNavbar && mobileSideNavbar.classList.contains('open')) {
                closeMobileMenuFunction();
            }
            // Close notification panel if open
            if (notificationPanel && notificationPanel.style.display === 'flex') {
                notificationPanel.style.display = 'none';
            }
        }
    }
    
    if (chatbotButton) {
        chatbotButton.addEventListener('click', openChatbot);
    }
    
    if (mobileChatbotToggle) {
        mobileChatbotToggle.addEventListener('click', openChatbot);
    }
    
    if (chatbotClose) {
        chatbotClose.addEventListener('click', () => {
            if (chatbotWindow) {
                chatbotWindow.style.display = 'none';
            }
        });
    }
    
    function sendMessage() {
        if (!chatbotInput || !chatbotMessages) return;
        
        const message = chatbotInput.value.trim();
        if (message) {
            // Add user message
            const userMessage = document.createElement('div');
            userMessage.className = 'message sent';
            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            userMessage.innerHTML = `
                <div>
                    <div class="message-bubble">${message}</div>
                    <div class="message-time">${time}</div>
                </div>
            `;
            chatbotMessages.appendChild(userMessage);
            
            // Clear input
            chatbotInput.value = '';
            
            // Scroll to bottom
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            
            // Show typing indicator
            const typingIndicator = document.createElement('div');
            typingIndicator.className = 'message received';
            typingIndicator.innerHTML = `
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            `;
            chatbotMessages.appendChild(typingIndicator);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            
            // Simulate admin response after a delay
            setTimeout(() => {
                // Remove typing indicator
                chatbotMessages.removeChild(typingIndicator);
                
                const adminMessage = document.createElement('div');
                adminMessage.className = 'message received';
                const adminTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                
                // Simple response logic
                let response = "Thank you for your message. Our support team will get back to you soon.";
                
                if (message.toLowerCase().includes('job') || message.toLowerCase().includes('apply')) {
                    response = "For job-related questions, please check our Jobs page or contact our recruitment team at recruitment@derrickmawirajobs.com.";
                } else if (message.toLowerCase().includes('account') || message.toLowerCase().includes('login') || message.toLowerCase().includes('password')) {
                    response = "For account issues, you can reset your password from the login page or contact our support team at support@derrickmawirajobs.com.";
                } else if (message.toLowerCase().includes('refer') || message.toLowerCase().includes('referral')) {
                    response = "For referral questions, please visit our Referrals page or email referrals@derrickmawirajobs.com.";
                } else if (message.toLowerCase().includes('profile') || message.toLowerCase().includes('resume') || message.toLowerCase().includes('cv')) {
                    response = "You can manage your profile, resume, and other career resources from your account dashboard. If you need specific help, please let me know what you're trying to do.";
                } else if (message.toLowerCase().includes('token') || message.toLowerCase().includes('balance')) {
                    response = "You can earn tokens by completing tasks, referring candidates, and participating in community events. You can redeem tokens for premium services or features on our platform.";
                }
                
                adminMessage.innerHTML = `
                    <div>
                        <div class="message-bubble">${response}</div>
                        <div class="message-time">${adminTime}</div>
                    </div>
                `;
                chatbotMessages.appendChild(adminMessage);
                
                // Scroll to bottom
                chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            }, 1500);
        }
    }
    
    if (chatbotSend) {
        chatbotSend.addEventListener('click', sendMessage);
    }
    
    if (chatbotInput) {
        chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    // Filter chips functionality
    const filterChips = document.querySelectorAll('.filter-chip');
    filterChips.forEach(chip => {
        chip.addEventListener('click', function() {
            // Toggle active state
            filterChips.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            
            // Update aria-pressed attribute
            filterChips.forEach(c => c.setAttribute('aria-pressed', 'false'));
            this.setAttribute('aria-pressed', 'true');
        });
    });
    
    // Detect keyboard open on mobile devices
    let originalViewportHeight = window.innerHeight;
    let chatWindow = document.querySelector('.chatbot-window');
    window.addEventListener('resize', function() {
        if (window.innerHeight < originalViewportHeight * 0.8) {
            // Keyboard is likely open
            if (chatWindow) {
                chatWindow.classList.add('keyboard-open');
            }
        } else {
            // Keyboard is closed
            if (chatWindow) {
                chatWindow.classList.remove('keyboard-open');
            }
        }
    });
});