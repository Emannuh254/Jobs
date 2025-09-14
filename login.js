// ===============================
// Loader Utility
// ===============================
let loaderStartTime = 0;
const MIN_LOADER_TIME = 500; // Minimum time to show loader in ms

function showLoader(message = "Loading...") {
    // Prevent multiple loaders
    if (document.getElementById('global-loader')) return;
    
    loaderStartTime = Date.now();
    
    const loader = document.createElement('div');
    loader.id = 'global-loader';
    loader.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        flex-direction: column;
        backdrop-filter: blur(5px);
    `;
    
    // Modern animated loader with gradient
    const loaderContainer = document.createElement('div');
    loaderContainer.style.cssText = `
        position: relative;
        width: 80px;
        height: 80px;
    `;
    
    // Main spinner
    const spinner = document.createElement('div');
    spinner.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        border: 4px solid transparent;
        border-top: 4px solid #4f46e5;
        border-right: 4px solid #818cf8;
        animation: spin 1s linear infinite;
    `;
    
    // Inner spinner
    const innerSpinner = document.createElement('div');
    innerSpinner.style.cssText = `
        position: absolute;
        top: 10px;
        left: 10px;
        width: calc(100% - 20px);
        height: calc(100% - 20px);
        border-radius: 50%;
        border: 3px solid transparent;
        border-bottom: 3px solid #c7d2fe;
        border-left: 3px solid #a5b4fc;
        animation: spin 1.5s linear infinite reverse;
    `;
    
    // Pulsing dot in center
    const dot = document.createElement('div');
    dot.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        width: 12px;
        height: 12px;
        background: #4f46e5;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        animation: pulse 1.5s ease-in-out infinite;
    `;
    
    loaderContainer.appendChild(spinner);
    loaderContainer.appendChild(innerSpinner);
    loaderContainer.appendChild(dot);
    
    const text = document.createElement('span');
    text.textContent = message;
    text.style.cssText = `
        color: white;
        margin-top: 24px;
        font-weight: 600;
        font-family: 'Poppins', sans-serif;
        font-size: 16px;
        text-align: center;
        max-width: 80%;
        animation: fadeIn 0.5s ease-in-out;
    `;
    
    loader.appendChild(loaderContainer);
    loader.appendChild(text);
    document.body.appendChild(loader);
    
    // Add keyframes dynamically if not already present
    if (!document.getElementById('loader-keyframes')) {
        const style = document.createElement('style');
        style.id = 'loader-keyframes';
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            @keyframes pulse {
                0%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                50% { opacity: 0.7; transform: translate(-50%, -50%) scale(1.2); }
            }
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);
    }
}

function hideLoader() {
    const loader = document.getElementById('global-loader');
    if (loader) {
        const elapsedTime = Date.now() - loaderStartTime;
        const remainingTime = Math.max(0, MIN_LOADER_TIME - elapsedTime);
        
        setTimeout(() => {
            loader.style.opacity = '0';
            loader.style.transition = 'opacity 0.3s ease';
            setTimeout(() => {
                if (document.body.contains(loader)) {
                    loader.remove();
                }
            }, 300);
        }, remainingTime);
    }
}

// ===============================
// API Configuration
// ===============================
const API_BASE = window.location.hostname === 'localhost' 
    ? 'http://127.0.0.1:8000/' 
    : 'https://jobs-backend-1-8pw2.onrender.com/';

// ===============================
// DOM Elements
// ===============================
const signinTab = document.getElementById('signin-tab');
const signupTab = document.getElementById('signup-tab');
const signinForm = document.getElementById('signin-form');
const signupForm = document.getElementById('signup-form');
const forgotForm = document.getElementById('forgot-form');

// ===============================
// Tab Switching Functions
// ===============================
function showSignIn() {
    if (signinTab) signinTab.classList.add('tab-active');
    if (signupTab) signupTab.classList.remove('tab-active');
    
    if (signinForm) {
        signinForm.classList.remove('inactive');
        signinForm.classList.add('active');
    }
    
    if (signupForm) {
        signupForm.classList.remove('active');
        signupForm.classList.add('inactive');
    }
    
    if (forgotForm) {
        forgotForm.classList.remove('active');
        forgotForm.classList.add('inactive');
    }
    
    // Clear any error messages
    clearErrorMessages();
}

function showSignUp() {
    if (signupTab) signupTab.classList.add('tab-active');
    if (signinTab) signinTab.classList.remove('tab-active');
    
    if (signupForm) {
        signupForm.classList.remove('inactive');
        signupForm.classList.add('active');
    }
    
    if (signinForm) {
        signinForm.classList.remove('active');
        signinForm.classList.add('inactive');
    }
    
    if (forgotForm) {
        forgotForm.classList.remove('active');
        forgotForm.classList.add('inactive');
    }
    
    // Clear any error messages
    clearErrorMessages();
}

function showForgotPassword() {
    if (signinForm) {
        signinForm.classList.remove('active');
        signinForm.classList.add('inactive');
    }
    
    if (signupForm) {
        signupForm.classList.remove('active');
        signupForm.classList.add('inactive');
    }
    
    if (forgotForm) {
        forgotForm.classList.remove('inactive');
        forgotForm.classList.add('active');
    }
    
    // Clear any error messages
    clearErrorMessages();
}

// ===============================
// Utility Functions
// ===============================
function togglePassword(fieldId) {
    const passwordField = document.getElementById(fieldId);
    if (!passwordField) return;
    
    const toggleButton = passwordField.nextElementSibling;
    if (!toggleButton) return;
    
    const icon = toggleButton.querySelector('i');
    if (!icon) return;
    
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordField.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

function clearErrorMessages() {
    // Clear all error messages
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
        element.classList.add('hidden');
    });
}

function displayErrors(errors) {
    // Display validation errors
    Object.keys(errors).forEach(field => {
        const errorElement = document.getElementById(`signup-${field}-error`);
        if (errorElement) {
            errorElement.textContent = errors[field][0];
            errorElement.classList.remove('hidden');
        }
    });
}

// Email validation helper
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ===============================
// Authentication Functions
// ===============================
function saveAuthData(result) {
    try {
        // Check if localStorage is available
        if (typeof localStorage !== 'undefined') {
            // Save JWT tokens
            localStorage.setItem("access", result.access);
            localStorage.setItem("refresh", result.refresh);
            
            // Save user information
            if (result.user) {
                localStorage.setItem("user_id", result.user.id);
                localStorage.setItem("username", result.user.username);
                localStorage.setItem("email", result.user.email);
                localStorage.setItem("first_name", result.user.first_name || "");
                localStorage.setItem("last_name", result.user.last_name || "");
                localStorage.setItem("referral_code", result.user.referral_code);
                localStorage.setItem("points", result.user.points);
                
                // Save Google-specific data
                if (result.user.google_id) {
                    localStorage.setItem("google_id", result.user.google_id);
                }
                if (result.user.google_name) {
                    localStorage.setItem("google_name", result.user.google_name);
                }
                if (result.user.google_picture) {
                    localStorage.setItem("google_picture", result.user.google_picture);
                }
            }
        } else {
            console.error("localStorage is not available");
            showToast("Error saving your session. Please try signing in again.", "error");
        }
    } catch (error) {
        console.error("Error saving authentication data:", error);
        showToast("Error saving your session. Please try signing in again.", "error");
    }
}

// ===============================
// Toast Notification
// ===============================
function showToast(message, type = 'info') {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.toast-notification');
    existingToasts.forEach(toast => toast.remove());
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast-notification fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
        type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 
        'bg-blue-500'
    } text-white transform transition-transform duration-300 translate-x-full`;
    toast.textContent = message;
    
    // Add progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'absolute bottom-0 left-0 h-1 bg-white bg-opacity-30';
    progressBar.style.cssText = 'width: 100%; transition: width 2s linear;';
    toast.style.position = 'relative';
    toast.style.overflow = 'hidden';
    toast.appendChild(progressBar);
    
    // Add to DOM
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.classList.remove('translate-x-full');
        // Start progress bar animation
        setTimeout(() => {
            progressBar.style.width = '0%';
        }, 10);
    }, 10);
    
    // Remove after 2 seconds
    setTimeout(() => {
        toast.classList.add('translate-x-full');
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 2000);
}

// ===============================
// API Request Helper
// ===============================
async function apiRequest(endpoint, data, timeout = 10000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Request failed with status ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new Error('Request timeout. Please try again.');
        }
        throw error;
    }
}

// ===============================
// Form Submission Handlers
// ===============================
async function handleSignIn(event) {
    event.preventDefault();
    
    const email = document.getElementById('signin-email')?.value || '';
    const password = document.getElementById('signin-password')?.value || '';
    
    // Client-side validation
    if (!email || !password) {
        showToast('Please enter both email and password', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showToast('Please enter a valid email address', 'error');
        return;
    }
    
    // Show loader immediately for better UX
    showLoader("Signing in...");
    
    try {
        const data = await apiRequest('/auth/login/', { email, password });
        
        if (data.access) {
            // Save auth data
            saveAuthData(data);
            
            // Show success message
            showToast('Login successful! Redirecting...', 'success');
            
            // Preload dashboard while showing success message
            preloadDashboard();
            
            // Redirect after a short delay
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 800);
        } else {
            throw new Error(data.error || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        showToast(error.message || 'Login failed', 'error');
    } finally {
        hideLoader();
    }
}

async function handleSignUp(event) {
    event.preventDefault();
    
    const name = document.getElementById('signup-name')?.value || '';
    const email = document.getElementById('signup-email')?.value || '';
    const password = document.getElementById('signup-password')?.value || '';
    const confirmPassword = document.getElementById('signup-confirm')?.value || '';
    
    // Client-side validation
    if (!name || !email || !password || !confirmPassword) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showToast('Please enter a valid email address', 'error');
        return;
    }
    
    // Split name into first and last names
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
    
    // Validate passwords match
    if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }
    
    if (password.length < 8) {
        showToast('Password must be at least 8 characters', 'error');
        return;
    }
    
    showLoader("Creating account...");
    
    try {
        const data = await apiRequest('/auth/register/', { 
            username: email, 
            email, 
            password, 
            password2: confirmPassword,
            first_name: firstName,
            last_name: lastName
        });
        
        showToast('Account created successfully! Please sign in.', 'success');
        setTimeout(() => {
            showSignIn();
        }, 1500);
    } catch (error) {
        console.error('Registration error:', error);
        if (error.errors) {
            displayErrors(error.errors);
        } else {
            showToast(error.message || 'Registration failed', 'error');
        }
    } finally {
        hideLoader();
    }
}

async function handleForgotPassword(event) {
    event.preventDefault();
    
    const email = document.getElementById('forgot-email')?.value || '';
    
    if (!email) {
        showToast('Please enter your email address', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showToast('Please enter a valid email address', 'error');
        return;
    }
    
    showLoader("Sending reset link...");
    
    try {
        await apiRequest('/auth/forgot-password/', { email });
        showToast('Password reset link sent to your email', 'success');
        setTimeout(() => {
            showSignIn();
        }, 2000);
    } catch (error) {
        console.error('Forgot password error:', error);
        showToast(error.message || 'Failed to send reset link', 'error');
    } finally {
        hideLoader();
    }
}

// ===============================
// Preload Dashboard
// ===============================
function preloadDashboard() {
    // Create a hidden iframe to preload the dashboard
    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'position: absolute; width: 0; height: 0; border: none; visibility: hidden;';
    iframe.src = '/dashboard';
    document.body.appendChild(iframe);
    
    // Remove the iframe after a short time to free resources
    setTimeout(() => {
        if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
        }
    }, 3000);
}

// ===============================
// Google Sign-In Functions
// ===============================
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Error parsing JWT token:", error);
        return null;
    }
}

function createPasswordModal(email) {
    return new Promise((resolve, reject) => {
        // Create modal elements
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm';
        modal.style.display = 'flex';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'bg-white p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-95';
        
        const title = document.createElement('h3');
        title.className = 'text-2xl font-bold mb-6 text-gray-800 text-center';
        title.textContent = 'Create Your Account';
        
        const emailInfo = document.createElement('p');
        emailInfo.className = 'mb-6 text-gray-600 text-center';
        emailInfo.textContent = `You're signing in with Google as: ${email}`;
        
        const passwordLabel = document.createElement('label');
        passwordLabel.className = 'block text-gray-700 text-sm font-medium mb-3';
        passwordLabel.textContent = 'Set a password for your account:';
        
        const passwordInput = document.createElement('input');
        passwordInput.type = 'password';
        passwordInput.className = 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4 transition-all duration-200';
        passwordInput.placeholder = 'Enter password (min 6 characters)';
        
        const passwordError = document.createElement('div');
        passwordError.className = 'text-red-500 text-sm mb-4 hidden';
        
        const requirements = document.createElement('div');
        requirements.className = 'text-xs text-gray-500 mb-6';
        requirements.innerHTML = `
            <p>Password must contain:</p>
            <ul class="list-disc pl-5 mt-1">
                <li>At least 6 characters</li>
                <li>At least one uppercase letter</li>
                <li>At least one number</li>
            </ul>
        `;
        
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'flex justify-end space-x-3';
        
        const cancelButton = document.createElement('button');
        cancelButton.className = 'px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200 font-medium';
        cancelButton.textContent = 'Cancel';
        
        const submitButton = document.createElement('button');
        submitButton.className = 'px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium';
        submitButton.textContent = 'Create Account';
        
        // Assemble modal
        buttonContainer.appendChild(cancelButton);
        buttonContainer.appendChild(submitButton);
        
        modalContent.appendChild(title);
        modalContent.appendChild(emailInfo);
        modalContent.appendChild(passwordLabel);
        modalContent.appendChild(passwordInput);
        modalContent.appendChild(passwordError);
        modalContent.appendChild(requirements);
        modalContent.appendChild(buttonContainer);
        
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        // Animate modal in
        setTimeout(() => {
            modalContent.classList.remove('scale-95');
            modalContent.classList.add('scale-100');
        }, 10);
        
        // Focus on password input
        passwordInput.focus();
        
        // Event handlers
        cancelButton.addEventListener('click', () => {
            modalContent.classList.add('scale-95');
            modalContent.classList.remove('scale-100');
            setTimeout(() => {
                if (document.body.contains(modal)) {
                    document.body.removeChild(modal);
                }
            }, 300);
            reject(new Error('User cancelled password creation'));
        });
        
        submitButton.addEventListener('click', () => {
            const password = passwordInput.value;
            
            if (!password) {
                passwordError.textContent = 'Password is required';
                passwordError.classList.remove('hidden');
                return;
            }
            
            if (password.length < 6) {
                passwordError.textContent = 'Password must be at least 6 characters';
                passwordError.classList.remove('hidden');
                return;
            }
            
            // Validate password strength
            const hasUpperCase = /[A-Z]/.test(password);
            const hasNumber = /[0-9]/.test(password);
            
            if (!hasUpperCase || !hasNumber) {
                passwordError.textContent = 'Password must contain at least one uppercase letter and one number';
                passwordError.classList.remove('hidden');
                return;
            }
            
            modalContent.classList.add('scale-95');
            modalContent.classList.remove('scale-100');
            setTimeout(() => {
                if (document.body.contains(modal)) {
                    document.body.removeChild(modal);
                }
                resolve(password);
            }, 300);
        });
        
        // Handle Enter key
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                submitButton.click();
            }
        });
        
        // Close modal on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                cancelButton.click();
            }
        });
        
        // Cleanup function to prevent memory leaks
        const cleanup = () => {
            if (document.body.contains(modal)) {
                document.body.removeChild(modal);
            }
        };
        
        // Add a timeout to ensure cleanup happens even if something goes wrong
        setTimeout(cleanup, 300000); // 5 minutes
    });
}

function handleGoogleSignIn() {
    showLoader("Connecting to Google...");
    
    try {
        // Initialize Google Sign-In
        if (typeof google !== 'undefined' && google.accounts) {
            google.accounts.id.initialize({
                client_id: "52686426344-omno2e3l9h31dvcgs3c4ghl49n7i36o4.apps.googleusercontent.com",
                callback: handleGoogleSignInResponse
            });
            
            // Prompt the user to sign in
            google.accounts.id.prompt();
        } else {
            showToast('Google Sign-In not available', 'error');
            hideLoader();
        }
    } catch (error) {
        console.error('Google Sign-In initialization error:', error);
        showToast('Failed to initialize Google Sign-In', 'error');
        hideLoader();
    }
}

async function handleGoogleSignInResponse(response) {
    try {
        // Parse JWT token to get user data
        const data = parseJwt(response.credential);
        if (!data || !data.email) {
            showToast("Invalid Google Sign-In response", "error");
            hideLoader();
            return;
        }
        
        const email = data.email;
        
        // Create a modal to set a password
        createPasswordModal(email)
            .then(password => {
                if (!password || password.length < 6) {
                    showToast("Password must be at least 6 characters", "error");
                    return Promise.reject("Invalid password");
                }
                
                showLoader("Creating your account...");
                
                // Send data to backend
                return apiRequest('/auth/google-login/', { 
                    email, 
                    password,
                    google_token: response.credential
                });
            })
            .then(result => {
                if (!result) return Promise.reject("No result from server");
                
                if (result.access) {
                    // Save tokens and user data
                    saveAuthData(result);
                    
                    showToast("Account created successfully! Signing you in...", "success");
                    
                    // Preload dashboard
                    preloadDashboard();
                    
                    // Redirect to dashboard
                    setTimeout(() => {
                        window.location.href = '/dashboard';
                    }, 800);
                } else {
                    showToast(result.error || "Google Sign-In failed", "error");
                }
            })
            .catch(err => {
                console.error("Google Sign-In error:", err);
                showToast(err.message || "Google Sign-In failed. Please try again.", "error");
            })
            .finally(() => {
                hideLoader();
            });
    } catch (error) {
        console.error("Error processing Google Sign-In:", error);
        showToast("An unexpected error occurred. Please try again.", "error");
        hideLoader();
    }
}

// ===============================
// Initialize Google Sign-In
// ===============================
function loadGoogleSignIn() {
    // Check if script is already loaded
    if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
        return;
    }
    
    const script = document.createElement('script');
    script.src = "https://accounts.google.com/gsi/client";
    script.onload = () => {
        // Initialize Google Sign-In
        if (typeof google !== 'undefined' && google.accounts) {
            google.accounts.id.initialize({
                client_id: "52686426344-omno2e3l9h31dvcgs3c4ghl49n7i36o4.apps.googleusercontent.com",
                callback: handleGoogleSignInResponse
            });
        }
    };
    script.onerror = () => {
        showToast('Failed to load Google Sign-In', 'error');
    };
    document.head.appendChild(script);
}

// ===============================
// Initialize when DOM is loaded
// ===============================
document.addEventListener('DOMContentLoaded', () => {
    // Load Google Sign-In
    loadGoogleSignIn();
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        // Enter key to submit forms
        if (e.key === 'Enter') {
            const activeForm = document.querySelector('.form-panel.active form');
            if (activeForm) {
                activeForm.dispatchEvent(new Event('submit', { cancelable: true }));
            }
        }
    });
    
    // Add event listeners to tabs if they exist
    if (signinTab) signinTab.addEventListener('click', showSignIn);
    if (signupTab) signupTab.addEventListener('click', showSignUp);
    
    // Add event listeners to forms if they exist
    if (signinForm) signinForm.addEventListener('submit', handleSignIn);
    if (signupForm) signupForm.addEventListener('submit', handleSignUp);
    if (forgotForm) forgotForm.addEventListener('submit', handleForgotPassword);
    
    // Prefetch dashboard for faster navigation
    const prefetchLink = document.createElement('link');
    prefetchLink.rel = 'prefetch';
    prefetchLink.href = '/dashboard';
    document.head.appendChild(prefetchLink);
});