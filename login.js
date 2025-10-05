// ===============================
// Particle Background (Optimized)
// ===============================
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    // Reduce particle count for better performance on mobile
    const particleCount = window.innerWidth < 768 ? 15 : 30;
    
    // Clear existing particles
    particlesContainer.innerHTML = '';
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random size between 3px and 8px
        const size = Math.random() * 5 + 3;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random position
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // Random animation delay and duration for more natural movement
        particle.style.animationDelay = `${Math.random() * 5}s`;
        particle.style.animationDuration = `${15 + Math.random() * 15}s`;
        
        particlesContainer.appendChild(particle);
    }
}
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

// ===============================
// Loader Utility (Enhanced)
// ===============================
let loaderStartTime = 0;
const MIN_LOADER_TIME = 500; // Increased minimum time for better UX
let loaderTimeout;
let activeRequests = 0;

function showLoader(message = "Loading...") {
    // Prevent multiple loaders
    if (document.getElementById('global-loader')) {
        activeRequests++;
        return;
    }
    
    loaderStartTime = Date.now();
    activeRequests = 1;
    
    // Auto-hide loader after 10 seconds max (increased timeout)
    loaderTimeout = setTimeout(() => {
        hideLoader();
        showToast('Request is taking longer than expected. Please check your connection.', 'warning');
    }, 10000);
    
    // Get theme colors from CSS variables
    const style = getComputedStyle(document.documentElement);
    const primaryColor = style.getPropertyValue('--primary').trim() || '#ff5e3a';
    const secondaryColor = style.getPropertyValue('--secondary').trim() || '#6c5ce7';
    const accentColor = style.getPropertyValue('--accent').trim() || '#00d9ff';
    
    const loader = document.createElement('div');
    loader.id = 'global-loader';
    loader.className = 'global-loader';
    
    // Modern animated loader with gradient
    const loaderContainer = document.createElement('div');
    loaderContainer.className = 'loader-container';
    
    // Main spinner
    const spinner = document.createElement('div');
    spinner.className = 'spinner-main';
    
    // Inner spinner
    const innerSpinner = document.createElement('div');
    innerSpinner.className = 'spinner-inner';
    
    // Pulsing dot in center
    const dot = document.createElement('div');
    dot.className = 'pulse-dot';
    
    loaderContainer.appendChild(spinner);
    loaderContainer.appendChild(innerSpinner);
    loaderContainer.appendChild(dot);
    
    const text = document.createElement('span');
    text.className = 'loader-text';
    text.textContent = message;
    
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
            .global-loader {
                position: fixed;
                inset: 0;
                background: rgba(10, 14, 39, 0.85);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                flex-direction: column;
                backdrop-filter: blur(8px);
                animation: fadeIn 0.3s ease-out;
            }
            .loader-container {
                position: relative;
                width: 80px;
                height: 80px;
            }
            .spinner-main {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border-radius: 50%;
                border: 4px solid transparent;
                border-top: 4px solid ${primaryColor};
                border-right: 4px solid ${secondaryColor};
                animation: spin 1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
            }
            .spinner-inner {
                position: absolute;
                top: 10px;
                left: 10px;
                width: calc(100% - 20px);
                height: calc(100% - 20px);
                border-radius: 50%;
                border: 3px solid transparent;
                border-bottom: 3px solid ${accentColor};
                border-left: 3px solid ${secondaryColor};
                animation: spin 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite reverse;
            }
            .pulse-dot {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 12px;
                height: 12px;
                background: ${primaryColor};
                border-radius: 50%;
                transform: translate(-50%, -50%);
                animation: pulse 1.5s ease-in-out infinite;
            }
            .loader-text {
                color: white;
                margin-top: 24px;
                font-weight: 600;
                font-family: 'Poppins', sans-serif;
                font-size: 16px;
                text-align: center;
                max-width: 80%;
                animation: fadeIn 0.5s ease-in-out;
            }
        `;
        document.head.appendChild(style);
    }
}

function hideLoader() {
    activeRequests--;
    
    if (activeRequests > 0) return; // Still have active requests
    
    const loader = document.getElementById('global-loader');
    if (loader) {
        clearTimeout(loaderTimeout);
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
// const API_BASE = "https://jobs-backend-2-c16a.onrender.com";
   const API_BASE = "http://127.0.0.1:8000";

// ===============================
// DOM Elements
// ===============================
const signinTab = document.getElementById('signin-tab');
const signupTab = document.getElementById('signup-tab');
const signinForm = document.getElementById('signin-form');
const signupForm = document.getElementById('signup-form');
const forgotForm = document.getElementById('forgot-form');

// ===============================
// Tab Switching Functions (Enhanced)
// ===============================
function showSignIn() {
    if (signinTab) signinTab.classList.add('tab-active');
    if (signupTab) signupTab.classList.remove('tab-active');
    
    // Animate form transition
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
    
    // Animate form transition
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
    // Animate form transition
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
// Utility Functions (Enhanced)
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
        // Handle nested errors (e.g., password validation)
        const errorElement = document.getElementById(`signup-${field}-error`) || 
                            document.getElementById(`${field}-error`);
        if (errorElement) {
            // Join multiple error messages with line breaks
            const errorMessage = Array.isArray(errors[field]) 
                ? errors[field].join('<br>') 
                : errors[field];
            errorElement.innerHTML = errorMessage;
            errorElement.classList.remove('hidden');
        }
    });
    
    // Also show a toast with the first error
    const firstError = Object.values(errors)[0];
    if (firstError) {
        const errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
        showToast(errorMessage, 'error');
    }
}

// Email validation helper
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Password strength checker (Enhanced)
function checkPasswordStrength(password) {
    const strengthMeter = document.getElementById('password-strength-meter-fill');
    if (!strengthMeter) return;
    
    // Reset classes
    strengthMeter.classList.remove('strength-weak', 'strength-medium', 'strength-strong');
    
    if (password.length === 0) {
        strengthMeter.style.width = '0';
        return;
    }
    
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    
    // Complexity checks
    if (password.match(/[a-z]+/)) strength += 1;
    if (password.match(/[A-Z]+/)) strength += 1;
    if (password.match(/[0-9]+/)) strength += 1;
    if (password.match(/[$@#&!]+/)) strength += 1;
    
    // Set strength meter with smooth transition
    strengthMeter.style.transition = 'width 0.3s ease, background-color 0.3s ease';
    
    if (strength <= 2) {
        strengthMeter.classList.add('strength-weak');
        strengthMeter.style.width = '33%';
    } else if (strength === 3) {
        strengthMeter.classList.add('strength-medium');
        strengthMeter.style.width = '66%';
    } else {
        strengthMeter.classList.add('strength-strong');
        strengthMeter.style.width = '100%';
    }
}

// ===============================
// Authentication Functions (Enhanced)
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
// Toast Notification (Enhanced)
// ===============================
function showToast(message, type = 'info') {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.toast-notification');
    existingToasts.forEach(toast => toast.remove());
    
    // Get theme colors
    const style = getComputedStyle(document.documentElement);
    const primaryColor = style.getPropertyValue('--primary').trim() || '#ff5e3a';
    const secondaryColor = style.getPropertyValue('--secondary').trim() || '#6c5ce7';
    const accentColor = style.getPropertyValue('--accent').trim() || '#00d9ff';
    
    // Determine background color based on type
    let bgColor;
    switch(type) {
        case 'success':
            bgColor = '#10b981'; // Green
            break;
        case 'error':
            bgColor = '#ef4444'; // Red
            break;
        case 'warning':
            bgColor = '#f59e0b'; // Amber
            break;
        default:
            bgColor = primaryColor; // Use theme primary
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    
    // Create message container
    const messageContainer = document.createElement('div');
    messageContainer.className = 'toast-message';
    messageContainer.textContent = message;
    
    // Add close button
    const closeButton = document.createElement('button');
    closeButton.className = 'toast-close';
    closeButton.innerHTML = '&times;';
    closeButton.setAttribute('aria-label', 'Close notification');
    
    closeButton.addEventListener('click', () => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 300);
    });
    
    toast.appendChild(messageContainer);
    toast.appendChild(closeButton);
    
    // Add to DOM
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 5000);
    
    // Add styles if not already present
    if (!document.getElementById('toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            .toast-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                left: 20px;
                background-color: ${bgColor};
                color: white;
                padding: 16px 20px;
                border-radius: 8px;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                z-index: 1000;
                transform: translateY(-20px);
                opacity: 0;
                transition: transform 0.3s ease, opacity 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: space-between;
                max-width: 100%;
            }
            .toast-notification.show {
                transform: translateY(0);
                opacity: 1;
            }
            .toast-message {
                flex-grow: 1;
            }
            .toast-close {
                background: none;
                border: none;
                color: white;
                font-size: 20px;
                cursor: pointer;
                margin-left: 10px;
                padding: 0;
                line-height: 1;
                opacity: 0.8;
                transition: opacity 0.2s;
            }
            .toast-close:hover {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }
}

// ===============================
// API Request Helper (Enhanced)
// ===============================
async function apiRequest(endpoint, data, timeout = 10000) { // Increased timeout
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
            let errorData;
            try {
                errorData = await response.json();
            } catch (e) {
                errorData = { error: `Request failed with status ${response.status}` };
            }
            throw errorData;
        }
        
        return await response.json();
    } catch (error) {
        clearTimeout(timeoutId);
        
        if (error.name === 'AbortError') {
            throw { error: 'Request timeout. Please check your connection and try again.' };
        }
        
        // Handle CORS errors specifically
        if (error.message === 'Failed to fetch' || error.message === 'NetworkError') {
            throw { error: 'Network error. Please check your connection and try again.' };
        }
        
        throw error;
    }
}

// ===============================
// Form Submission Handlers (Enhanced)
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
            throw { error: data.error || 'Login failed' };
        }
    } catch (error) {
        console.error('Login error:', error);
        showToast(error.error || 'Login failed', 'error');
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
            showToast(error.error || 'Registration failed', 'error');
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
        const result = await apiRequest('/auth/forgot-password/', { email });
        showToast(result.message || 'Password reset link sent to your email', 'success');
        setTimeout(() => {
            showSignIn();
        }, 2000);
    } catch (error) {
        console.error('Forgot password error:', error);
        showToast(error.error || 'Failed to send reset link', 'error');
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
// Google Sign-In Functions (Enhanced)
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
        const firstName = data.given_name || '';
        const lastName = data.family_name || '';
        
        showLoader("Creating your account...");
        
        // Send data to backend
        const apiResponse = await fetch(`${API_BASE}/auth/google-login/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                email,
                first_name: firstName,
                last_name: lastName,
                token: response.credential
            })
        });
        
        if (!apiResponse.ok) {
            const errorData = await apiResponse.json();
            throw { error: errorData.error || "Google Sign-In failed" };
        }
        
        const result = await apiResponse.json();
        
        if (result.access) {
            // Save tokens and user data
            saveAuthData(result);
            
            showToast("Account created successfully! Signing you in...", "success");
            
            // Preload dashboard
            preloadDashboard();
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = '/Jobs/home.html';
            }, 800);
        } else {
            showToast(result.error || "Google Sign-In failed", "error");
        }
    } catch (error) {
        console.error("Google Sign-In error:", error);
        showToast(error.error || "Google Sign-In failed. Please try again.", "error");
    } finally {
        hideLoader();
    }
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
// Initialize on DOM Ready (Enhanced)
// ===============================
document.addEventListener('DOMContentLoaded', function() {
    // Create particle background
    createParticles();
    
    // Initialize Google Sign-In
    loadGoogleSignIn();
    
    // Add event listeners to forms
    if (signinForm) {
        signinForm.addEventListener('submit', handleSignIn);
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignUp);
    }
    
    if (forgotForm) {
        forgotForm.addEventListener('submit', handleForgotPassword);
    }
    
    // Add event listeners to tabs
    if (signinTab) {
        signinTab.addEventListener('click', showSignIn);
    }
    
    if (signupTab) {
        signupTab.addEventListener('click', showSignUp);
    }
    
    // Add event listeners to password toggle buttons
    document.querySelectorAll('.password-toggle').forEach(button => {
        button.addEventListener('click', function() {
            const fieldId = this.getAttribute('data-field');
            togglePassword(fieldId);
        });
    });
    
    // Add event listener to password field for strength checker
    const passwordField = document.getElementById('signup-password');
    if (passwordField) {
        passwordField.addEventListener('input', function() {
            checkPasswordStrength(this.value);
        });
    }
    
    // Add event listener to Google Sign-In button
    const googleSignInButton = document.getElementById('google-signin-button');
    if (googleSignInButton) {
        googleSignInButton.addEventListener('click', handleGoogleSignIn);
    }
    
    // Add touch feedback for mobile
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        button.addEventListener('touchend', function() {
            this.style.transform = '';
        });
    });
    
    // Handle window resize for particles
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            createParticles();
        }, 250);
    });
});
