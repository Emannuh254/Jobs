document.addEventListener('DOMContentLoaded', function() {
    // Initialize modals
    const profileCompletionModal = new bootstrap.Modal(document.getElementById('profileCompletionModal'));
    const editProfileModal = new bootstrap.Modal(document.getElementById('editProfileModal'));
    
    // DOM elements
    const editProfileBtn = document.getElementById('editProfileBtn');
    const completeProfileBtn = document.getElementById('completeProfileBtn');
    const completeProfileFromAlert = document.getElementById('completeProfileFromAlert');
    const saveProfileBtn = document.getElementById('saveProfileBtn');
    const addSkillBtn = document.getElementById('addSkillBtn');
    const skillInput = document.getElementById('skillInput');
    const skillsList = document.getElementById('skillsList');
    const missingFieldsList = document.getElementById('missingFieldsList');
    
    // Header elements
    const notificationToggle = document.getElementById('notification-toggle');
    const closeNotifications = document.getElementById('close-notifications');
    const notificationPanel = document.getElementById('notification-panel');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const closeMobileMenu = document.getElementById('close-mobile-menu');
    const mobileSideNavbar = document.getElementById('mobile-side-navbar');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const mobileDarkModeToggle = document.getElementById('mobile-dark-mode-toggle');
    const mobileChatbotToggle = document.getElementById('mobile-chatbot-toggle');
    
    // Profile data - initialize with empty values
    let userProfile = {
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        location: '',
        region: '',
        profession: '',
        bio: '',
        profileImage: '',
        skills: [],
        documents: [],
        experience: [],
        education: []
    };
    
    // Common skills for auto-suggestions
    const commonSkills = [
        'JavaScript', 'React', 'TypeScript', 'HTML', 'CSS', 'Node.js', 'Python', 'Java',
        'C#', 'PHP', 'SQL', 'MongoDB', 'Express.js', 'Angular', 'Vue.js', 'Svelte',
        'jQuery', 'Bootstrap', 'Tailwind CSS', 'Sass', 'Less', 'Git', 'Docker',
        'AWS', 'Azure', 'Firebase', 'REST API', 'GraphQL', 'Redux', 'Next.js',
        'Gatsby', 'Webpack', 'Babel', 'Jest', 'Cypress', 'Figma', 'Adobe XD'
    ];
    
    // Dark mode functionality
    const darkMode = {
        toggle: document.getElementById('dark-mode-toggle'),
        mobileToggle: document.getElementById('mobile-dark-mode-toggle'),
        body: document.body,
        
        init() {
            // Check for saved preference
            const currentTheme = localStorage.getItem('theme') || 'light';
            if (currentTheme === 'dark') {
                this.body.setAttribute('data-theme', 'dark');
                this.updateIcons('dark');
            }
            
            // Add event listeners
            if (this.toggle) this.toggle.addEventListener('click', () => this.toggleMode());
            if (this.mobileToggle) this.mobileToggle.addEventListener('click', () => this.toggleMode());
        },
        
        toggleMode() {
            const currentTheme = this.body.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            this.body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            this.updateIcons(newTheme);
        },
        
        updateIcons(theme) {
            const icon = theme === 'dark' ? 'fa-sun' : 'fa-moon';
            const mobileText = theme === 'dark' ? 
                '<i class="fas fa-sun mr-3"></i> Light Mode' : 
                '<i class="fas fa-moon mr-3"></i> Dark Mode';
            
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
                this.panel.classList.toggle('show');
                if (this.panel.classList.contains('show')) {
                    mobileMenu.close(); // Close mobile menu if open
                }
            }
        },
        
        closePanel() {
            if (this.panel) {
                this.panel.classList.remove('show');
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
                this.window.classList.add('show');
                if (this.input) this.input.focus();
                mobileMenu.close(); // Close mobile menu if open
                notifications.closePanel(); // Close notifications if open
            }
        },
        
        close() {
            if (this.window) {
                this.window.classList.remove('show');
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
    
    // Load user profile from localStorage or initialize with empty values
    function loadUserProfile() {
        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
            userProfile = JSON.parse(savedProfile);
        } else {
            // Initialize with empty values
            userProfile = {
                id: '',
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                location: '',
                region: '',
                profession: '',
                bio: '',
                profileImage: '',
                skills: [],
                documents: [],
                experience: [],
                education: []
            };
        }
        updateProfileUI();
        checkProfileCompletion();
    }
    
    // Save user profile to localStorage
    function saveUserProfile() {
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
    }
    
    // Update profile UI with fetched data
    function updateProfileUI() {
        // Update profile image
        const profileImage = document.getElementById('profileImage');
        if (userProfile.profileImage) {
            profileImage.src = userProfile.profileImage;
        } else {
            profileImage.src = 'https://randomuser.me/api/portraits/men/75.jpg';
        }
        
        // Update profile header
        document.getElementById('profileName').textContent = 
            userProfile.firstName && userProfile.lastName 
                ? `${userProfile.firstName} ${userProfile.lastName}` 
                : 'Your Name';
                
        document.getElementById('profileProfession').textContent = 
            userProfile.profession || 'Your Profession';
            
        document.getElementById('profileEmail').textContent = 
            userProfile.email || 'your.email@example.com';
            
        document.getElementById('profilePhone').textContent = 
            userProfile.phone || '+1 (555) 123-4567';
            
        document.getElementById('profileLocation').textContent = 
            userProfile.location || 'Your Location';
            
        document.getElementById('profileRegion').textContent = 
            userProfile.region ? formatRegion(userProfile.region) : 'Your Region';
            
        document.getElementById('profileBio').textContent = 
            userProfile.bio || 'Tell us about yourself...';
        
        // Update skills
        const profileSkills = document.getElementById('profileSkills');
        profileSkills.innerHTML = '';
        
        if (userProfile.skills && userProfile.skills.length > 0) {
            userProfile.skills.forEach(skill => {
                const skillBadge = document.createElement('span');
                skillBadge.className = 'badge bg-primary rounded-pill p-2';
                skillBadge.textContent = skill;
                profileSkills.appendChild(skillBadge);
            });
        } else {
            profileSkills.innerHTML = '<span class="text-muted">No skills added yet</span>';
        }
        
        // Update experience
        const experienceList = document.getElementById('experienceList');
        experienceList.innerHTML = '';
        
        if (userProfile.experience && userProfile.experience.length > 0) {
            userProfile.experience.forEach(exp => {
                const expItem = document.createElement('div');
                expItem.className = 'mb-4 pb-4 border-bottom';
                expItem.innerHTML = `
                    <div class="d-flex justify-content-between mb-2">
                        <h6 class="fw-bold">${exp.title || 'Job Title'}</h6>
                        <span class="text-muted">${exp.period || 'Period'}</span>
                    </div>
                    <p class="text-primary mb-2">${exp.company || 'Company'}</p>
                    <p>${exp.description || 'Job description'}</p>
                `;
                experienceList.appendChild(expItem);
            });
        } else {
            experienceList.innerHTML = '<p class="text-muted">No experience added yet</p>';
        }
        
        // Update education
        const educationList = document.getElementById('educationList');
        educationList.innerHTML = '';
        
        if (userProfile.education && userProfile.education.length > 0) {
            userProfile.education.forEach(edu => {
                const eduItem = document.createElement('div');
                eduItem.className = 'mb-3 pb-3 border-bottom';
                eduItem.innerHTML = `
                    <div class="d-flex justify-content-between mb-2">
                        <h6 class="fw-bold">${edu.degree || 'Degree'}</h6>
                        <span class="text-muted">${edu.period || 'Period'}</span>
                    </div>
                    <p class="text-primary">${edu.institution || 'Institution'}</p>
                `;
                educationList.appendChild(eduItem);
            });
        } else {
            educationList.innerHTML = '<p class="text-muted">No education added yet</p>';
        }
        
        // Update documents
        const documentsListMain = document.getElementById('documentsListMain');
        documentsListMain.innerHTML = '';
        
        if (userProfile.documents && userProfile.documents.length > 0) {
            userProfile.documents.forEach(doc => {
                const docItem = document.createElement('div');
                docItem.className = 'd-flex align-items-center p-2 border rounded mb-2';
                
                // Determine icon based on file type
                let iconClass = 'fas fa-file';
                if (doc.type === 'resume') iconClass = 'fas fa-file-pdf';
                if (doc.type === 'certificate') iconClass = 'fas fa-certificate';
                
                docItem.innerHTML = `
                    <i class="${iconClass} text-danger me-2"></i>
                    <div class="flex-grow-1">
                        <div>${doc.name || 'Document Name'}</div>
                        <small class="text-muted">${doc.type || 'Document Type'}</small>
                    </div>
                    <a href="${doc.url || '#'}" class="btn btn-sm btn-outline-primary" download>
                        <i class="fas fa-download"></i>
                    </a>
                `;
                documentsListMain.appendChild(docItem);
            });
        } else {
            documentsListMain.innerHTML = '<p class="text-muted">No documents uploaded yet</p>';
        }
    }
    
    // Calculate profile completion percentage
    function calculateProfileCompletion() {
        const requiredFields = [
            'firstName', 'lastName', 'email', 'phone', 
            'location', 'region', 'profession', 'bio'
        ];
        
        let completedFields = 0;
        
        // Check basic fields
        requiredFields.forEach(field => {
            if (userProfile[field] && userProfile[field].trim() !== '') {
                completedFields++;
            }
        });
        
        // Check skills
        if (userProfile.skills && userProfile.skills.length > 0) {
            completedFields++;
        }
        
        // Check documents
        if (userProfile.documents && userProfile.documents.length > 0) {
            completedFields++;
        }
        
        // Check experience
        if (userProfile.experience && userProfile.experience.length > 0) {
            completedFields++;
        }
        
        // Check education
        if (userProfile.education && userProfile.education.length > 0) {
            completedFields++;
        }
        
        // Calculate percentage (out of 12 possible fields)
        const percentage = Math.round((completedFields / 12) * 100);
        
        return {
            percentage,
            completedFields,
            totalFields: 12,
            missingFields: requiredFields.filter(field => 
                !userProfile[field] || userProfile[field].trim() === ''
            ).map(field => {
                const fieldNames = {
                    'firstName': 'First Name',
                    'lastName': 'Last Name',
                    'email': 'Email',
                    'phone': 'Phone Number',
                    'location': 'Location',
                    'region': 'Region',
                    'profession': 'Profession',
                    'bio': 'Bio'
                };
                return fieldNames[field] || field;
            })
        };
    }
    
    // Check if profile is incomplete
    function checkProfileCompletion() {
        const completionData = calculateProfileCompletion();
        
        // Update header progress bar
        const headerProgress = document.getElementById('header-completion-progress');
        const headerPercentage = document.getElementById('header-completion-percentage');
        
        if (headerProgress && headerPercentage) {
            headerProgress.style.width = `${completionData.percentage}%`;
            headerPercentage.textContent = `${completionData.percentage}%`;
            
            // Change color based on completion
            if (completionData.percentage < 50) {
                headerProgress.classList.remove('bg-success', 'bg-warning');
                headerProgress.classList.add('bg-danger');
            } else if (completionData.percentage < 80) {
                headerProgress.classList.remove('bg-danger', 'bg-success');
                headerProgress.classList.add('bg-warning');
            } else {
                headerProgress.classList.remove('bg-danger', 'bg-warning');
                headerProgress.classList.add('bg-success');
            }
        }
        
        // Show/hide profile completion alert
        const profileCompletionAlert = document.getElementById('profileCompletionAlert');
        if (profileCompletionAlert) {
            if (completionData.percentage < 100) {
                profileCompletionAlert.classList.remove('d-none');
            } else {
                profileCompletionAlert.classList.add('d-none');
            }
        }
        
        // If profile is incomplete, show modal
        if (completionData.percentage < 80) {
            // Update modal progress bar
            const modalProgress = document.getElementById('completion-progress');
            const modalPercentage = document.getElementById('completion-percentage');
            
            if (modalProgress && modalPercentage) {
                modalProgress.style.width = `${completionData.percentage}%`;
                modalPercentage.textContent = `${completionData.percentage}%`;
                
                // Change color based on completion
                if (completionData.percentage < 50) {
                    modalProgress.classList.remove('bg-success', 'bg-warning');
                    modalProgress.classList.add('bg-danger');
                } else {
                    modalProgress.classList.remove('bg-danger', 'bg-success');
                    modalProgress.classList.add('bg-warning');
                }
            }
            
            // Populate missing fields list
            missingFieldsList.innerHTML = '';
            if (completionData.missingFields.length > 0) {
                completionData.missingFields.forEach(field => {
                    const li = document.createElement('li');
                    li.className = 'list-group-item';
                    li.textContent = field;
                    missingFieldsList.appendChild(li);
                });
            } else if (!userProfile.skills || userProfile.skills.length === 0) {
                const li = document.createElement('li');
                li.className = 'list-group-item';
                li.textContent = 'Skills';
                missingFieldsList.appendChild(li);
            }
            
            // Show profile completion modal
            profileCompletionModal.show();
        }
    }
    
    // Format region for display
    function formatRegion(region) {
        const regions = {
            'nairobi': 'Nairobi',
            'coast': 'Coast',
            'eastern': 'Eastern',
            'central': 'Central',
            'rift-valley': 'Rift Valley',
            'western': 'Western',
            'nyanza': 'Nyanza',
            'north-eastern': 'North Eastern'
        };
        return regions[region] || region;
    }
    
    // Populate edit profile form
    function populateEditForm() {
        document.getElementById('firstName').value = userProfile.firstName || '';
        document.getElementById('lastName').value = userProfile.lastName || '';
        document.getElementById('email').value = userProfile.email || '';
        document.getElementById('phone').value = userProfile.phone || '';
        document.getElementById('location').value = userProfile.location || '';
        document.getElementById('region').value = userProfile.region || '';
        document.getElementById('profession').value = userProfile.profession || '';
        document.getElementById('bio').value = userProfile.bio || '';
        
        // Set profile image preview
        const profileImagePreview = document.getElementById('editProfileImagePreview');
        if (userProfile.profileImage) {
            profileImagePreview.src = userProfile.profileImage;
        } else {
            profileImagePreview.src = 'https://randomuser.me/api/portraits/men/75.jpg';
        }
        
        // Populate skills
        skillsList.innerHTML = '';
        if (userProfile.skills && userProfile.skills.length > 0) {
            userProfile.skills.forEach(skill => {
                addSkillToUI(skill);
            });
        }
        
        // Populate documents
        const documentsList = document.getElementById('documentsList');
        documentsList.innerHTML = '';
        if (userProfile.documents && userProfile.documents.length > 0) {
            userProfile.documents.forEach(doc => {
                addDocumentToUI(doc);
            });
        }
    }
    
    // Add skill to UI
    function addSkillToUI(skill) {
        const skillTag = document.createElement('span');
        skillTag.className = 'badge bg-primary d-flex align-items-center p-2 me-2 mb-2';
        skillTag.innerHTML = `
            ${skill}
            <button type="button" class="btn-close btn-close-white ms-2" data-skill="${skill}"></button>
        `;
        skillsList.appendChild(skillTag);
        
        // Add event listener to remove button
        const removeBtn = skillTag.querySelector('.btn-close');
        removeBtn.addEventListener('click', function() {
            const skillToRemove = this.getAttribute('data-skill');
            if (userProfile.skills) {
                userProfile.skills = userProfile.skills.filter(s => s !== skillToRemove);
            }
            skillTag.remove();
        });
    }
    
    // Add document to UI
    function addDocumentToUI(doc) {
        const docItem = document.createElement('div');
        docItem.className = 'd-flex align-items-center justify-content-between p-2 border rounded mb-2';
        docItem.innerHTML = `
            <div>
                <div>${doc.name || 'Document'}</div>
                <small class="text-muted">${doc.type || 'Type'}</small>
            </div>
            <button type="button" class="btn btn-sm btn-outline-danger remove-doc" data-doc-id="${doc.id || ''}">
                <i class="fas fa-trash"></i>
            </button>
        `;
        document.getElementById('documentsList').appendChild(docItem);
        
        // Add event listener to remove button
        const removeBtn = docItem.querySelector('.remove-doc');
        removeBtn.addEventListener('click', function() {
            const docIdToRemove = this.getAttribute('data-doc-id');
            if (userProfile.documents) {
                userProfile.documents = userProfile.documents.filter(d => d.id !== docIdToRemove);
            }
            docItem.remove();
        });
    }
    
    // Show error message
    function showError(message) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-danger alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3';
        alertDiv.style.zIndex = '9999';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        document.body.appendChild(alertDiv);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }
    
    // Show success message
    function showSuccess(message) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-success alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3';
        alertDiv.style.zIndex = '9999';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        document.body.appendChild(alertDiv);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }
    
    // Event listeners
    editProfileBtn.addEventListener('click', function() {
        populateEditForm();
        editProfileModal.show();
    });
    
    completeProfileBtn.addEventListener('click', function() {
        profileCompletionModal.hide();
        populateEditForm();
        editProfileModal.show();
    });
    
    completeProfileFromAlert.addEventListener('click', function() {
        populateEditForm();
        editProfileModal.show();
    });
    
    saveProfileBtn.addEventListener('click', async function() {
        // Get form data
        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            location: document.getElementById('location').value,
            region: document.getElementById('region').value,
            profession: document.getElementById('profession').value,
            bio: document.getElementById('bio').value
        };
        
        // Basic validation
        if (!formData.firstName || !formData.lastName || !formData.email) {
            showError('Please fill in all required fields');
            return;
        }
        
        try {
            // Update user profile
            userProfile = { ...userProfile, ...formData };
            
            // Add profile image if available
            if (window.tempProfileImage) {
                userProfile.profileImage = window.tempProfileImage;
                delete window.tempProfileImage;
            }
            
            // Save to localStorage
            saveUserProfile();
            
            // Update UI
            updateProfileUI();
            
            // Check profile completion again
            checkProfileCompletion();
            
            // Close modal
            editProfileModal.hide();
            
            // Show success message
            showSuccess('Profile updated successfully!');
            
        } catch (error) {
            console.error('Error updating profile:', error);
            showError('Failed to update profile. Please try again.');
        }
    });
    
    addSkillBtn.addEventListener('click', function() {
        const skill = skillInput.value.trim();
        if (skill && (!userProfile.skills || !userProfile.skills.includes(skill))) {
            if (!userProfile.skills) userProfile.skills = [];
            userProfile.skills.push(skill);
            addSkillToUI(skill);
            skillInput.value = '';
        }
    });
    
    // Handle skill input with auto-suggestions
    skillInput.addEventListener('input', function() {
        const value = this.value.toLowerCase();
        if (value.length > 1) {
            const suggestions = commonSkills.filter(skill => 
                skill.toLowerCase().includes(value) && (!userProfile.skills || !userProfile.skills.includes(skill))
            );
            
            // In a real app, you would show a dropdown with suggestions
            console.log('Skill suggestions:', suggestions);
        }
    });
    
    // Handle file uploads
    document.getElementById('resumeUpload').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const newDoc = {
                id: Date.now().toString(),
                name: file.name,
                type: 'resume',
                url: URL.createObjectURL(file)
            };
            
            if (!userProfile.documents) userProfile.documents = [];
            userProfile.documents.push(newDoc);
            addDocumentToUI(newDoc);
            
            // In a real app, you would upload the file to the server
            // uploadDocument(file);
        }
    });
    
    document.getElementById('certUpload').addEventListener('change', function(e) {
        const files = e.target.files;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const newDoc = {
                id: Date.now().toString() + i,
                name: file.name,
                type: 'certificate',
                url: URL.createObjectURL(file)
            };
            
            if (!userProfile.documents) userProfile.documents = [];
            userProfile.documents.push(newDoc);
            addDocumentToUI(newDoc);
            
            // In a real app, you would upload the file to the server
            // uploadDocument(file);
        }
    });
    
    // Add this event listener for the profile image upload
    document.getElementById('profileImageUpload').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.match('image.*')) {
                showError('Please select an image file (JPG, PNG, or GIF)');
                return;
            }
            
            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                showError('Image size must be less than 5MB');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(event) {
                const imageDataUrl = event.target.result;
                
                // Update preview
                document.getElementById('editProfileImagePreview').src = imageDataUrl;
                
                // Store in temporary variable until form is saved
                window.tempProfileImage = imageDataUrl;
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Add this event listener for the change profile image button
    document.getElementById('changeProfileImageBtn')?.addEventListener('click', function() {
        populateEditForm();
        editProfileModal.show();
        
        // Scroll to the profile image section in the modal
        setTimeout(() => {
            const profileImageSection = document.querySelector('#editProfileModal .modal-body');
            const imageSection = profileImageSection.querySelector('label[for="profileImageUpload"]').parentNode;
            imageSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Highlight the section briefly
            imageSection.style.backgroundColor = 'rgba(37, 99, 235, 0.1)';
            setTimeout(() => {
                imageSection.style.backgroundColor = '';
            }, 1000);
        }, 300);
    });
    
    // Initialize all components
    darkMode.init();
    mobileMenu.init();
    notifications.init();
    chatbot.init();
    
    // Load user profile
    loadUserProfile();
});