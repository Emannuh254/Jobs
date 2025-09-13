// API base URL - replace with your actual API URL
const API_BASE = 'https://your-api-domain.com/api';

// DOM elements
const signinTab = document.getElementById('signin-tab');
const signupTab = document.getElementById('signup-tab');
const signinForm = document.getElementById('signin-form');
const signupForm = document.getElementById('signup-form');
const forgotForm = document.getElementById('forgot-form');

// Tab switching functions
function showSignIn() {
    signinTab.classList.add('tab-active');
    signupTab.classList.remove('tab-active');
    
    signinForm.classList.remove('inactive');
    signinForm.classList.add('active');
    
    signupForm.classList.remove('active');
    signupForm.classList.add('inactive');
    
    forgotForm.classList.remove('active');
    forgotForm.classList.add('inactive');
}

function showSignUp() {
    signupTab.classList.add('tab-active');
    signinTab.classList.remove('tab-active');
    
    signupForm.classList.remove('inactive');
    signupForm.classList.add('active');
    
    signinForm.classList.remove('active');
    signinForm.classList.add('inactive');
    
    forgotForm.classList.remove('active');
    forgotForm.classList.add('inactive');
}

function showForgotPassword() {
    signinForm.classList.remove('active');
    signinForm.classList.add('inactive');
    
    signupForm.classList.remove('active');
    signupForm.classList.add('inactive');
    
    forgotForm.classList.remove('inactive');
    forgotForm.classList.add('active');
}

// Password visibility toggle
function togglePassword(fieldId) {
    const passwordField = document.getElementById(fieldId);
    const toggleButton = passwordField.nextElementSibling;
    const icon = toggleButton.querySelector('i');
    
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

// Form submission handlers
async function handleSignIn(event) {
    event.preventDefault();
    
    const email = document.getElementById('signin-email').value;
    const password = document.getElementById('signin-password').value;
    
    try {
        const response = await fetch(`${API_BASE}/auth/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Save tokens and redirect
            saveAuthData(data);
            showToast('Login successful! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 1500);
        } else {
            showToast(data.error || 'Login failed', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showToast('An error occurred. Please try again.', 'error');
    }
}

async function handleSignUp(event) {
    event.preventDefault();
    
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm').value;
    
    // Validate passwords match
    if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/auth/register/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                username: email, 
                email, 
                password, 
                password2: confirmPassword 
            }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showToast('Account created successfully! Please sign in.', 'success');
            showSignIn();
        } else {
            // Display validation errors
            if (data.errors) {
                Object.keys(data.errors).forEach(field => {
                    const errorElement = document.getElementById(`signup-${field}-error`);
                    if (errorElement) {
                        errorElement.textContent = data.errors[field][0];
                        errorElement.classList.remove('hidden');
                    }
                });
            } else {
                showToast(data.error || 'Registration failed', 'error');
            }
        }
    } catch (error) {
        console.error('Registration error:', error);
        showToast('An error occurred. Please try again.', 'error');
    }
}

async function handleForgotPassword(event) {
    event.preventDefault();
    
    const email = document.getElementById('forgot-email').value;
    
    try {
        const response = await fetch(`${API_BASE}/auth/forgot-password/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showToast('Password reset link sent to your email', 'success');
            setTimeout(() => {
                showSignIn();
            }, 2000);
        } else {
            showToast(data.error || 'Failed to send reset link', 'error');
        }
    } catch (error) {
        console.error('Forgot password error:', error);
        showToast('An error occurred. Please try again.', 'error');
    }
}

// Google Sign-In
function handleGoogleSignIn() {
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
    }
}

// Handle Google Sign-In response
function handleGoogleSignInResponse(response) {
    try {
        // Parse JWT token to get user data
        const data = parseJwt(response.credential);
        if (!data || !data.email) {
            showToast("Invalid Google Sign-In response", "error");
            return;
        }
        
        const email = data.email;
        
        // Create a modal to set a password
        createPasswordModal(email)
            .then(password => {
                if (!password || password.length < 6) {
                    showToast("Password must be at least 6 characters", "error");
                    return;
                }
                
                // Show loading state
                showToast("Creating your account...", "info");
                
                // Send data to backend
                return fetch(`${API_BASE}/auth/google-login/`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ 
                        email, 
                        password,
                        google_token: response.credential
                    })
                });
            })
            .then(res => {
                if (!res.ok) throw new Error(`Server responded with ${res.status}`);
                return res.json();
            })
            .then(result => {
                if (result.access) {
                    // Save tokens and user data
                    saveAuthData(result);
                    
                    showToast("Account created successfully! Signing you in...", "success");
                    
                    // Redirect to dashboard
                    setTimeout(() => {
                        window.location.href = '/dashboard';
                    }, 1500);
                } else {
                    showToast(result.error || "Google Sign-In failed", "error");
                }
            })
            .catch(err => {
                console.error("Google Sign-In error:", err);
                showToast(err.message || "Google Sign-In failed. Please try again.", "error");
            });
    } catch (error) {
        console.error("Error processing Google Sign-In:", error);
        showToast("An unexpected error occurred. Please try again.", "error");
    }
}

// Helper function to parse JWT token
function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

// Helper function to create a password modal
function createPasswordModal(email) {
    return new Promise((resolve, reject) => {
        // Create modal elements
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.style.display = 'flex';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'bg-white p-8 rounded-lg shadow-lg w-full max-w-md';
        
        const title = document.createElement('h3');
        title.className = 'text-xl font-bold mb-4 text-gray-800';
        title.textContent = 'Create Your Account';
        
        const emailInfo = document.createElement('p');
        emailInfo.className = 'mb-6 text-gray-600';
        emailInfo.textContent = `You're signing in with Google as: ${email}`;
        
        const passwordLabel = document.createElement('label');
        passwordLabel.className = 'block text-gray-700 text-sm font-medium mb-2';
        passwordLabel.textContent = 'Set a password for your account:';
        
        const passwordInput = document.createElement('input');
        passwordInput.type = 'password';
        passwordInput.className = 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4';
        passwordInput.placeholder = 'Enter password (min 6 characters)';
        
        const passwordError = document.createElement('div');
        passwordError.className = 'text-red-500 text-sm mb-4 hidden';
        
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'flex justify-end space-x-3';
        
        const cancelButton = document.createElement('button');
        cancelButton.className = 'px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100';
        cancelButton.textContent = 'Cancel';
        
        const submitButton = document.createElement('button');
        submitButton.className = 'px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700';
        submitButton.textContent = 'Create Account';
        
        // Assemble modal
        buttonContainer.appendChild(cancelButton);
        buttonContainer.appendChild(submitButton);
        
        modalContent.appendChild(title);
        modalContent.appendChild(emailInfo);
        modalContent.appendChild(passwordLabel);
        modalContent.appendChild(passwordInput);
        modalContent.appendChild(passwordError);
        modalContent.appendChild(buttonContainer);
        
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        // Focus on password input
        passwordInput.focus();
        
        // Event handlers
        cancelButton.addEventListener('click', () => {
            document.body.removeChild(modal);
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
            
            document.body.removeChild(modal);
            resolve(password);
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
    });
}

// Helper function to save authentication data
function saveAuthData(result) {
    try {
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
    } catch (error) {
        console.error("Error saving authentication data:", error);
        showToast("Error saving your session. Please try signing in again.", "error");
    }
}

// Toast notification function
function showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
        type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 
        'bg-blue-500'
    } text-white`;
    toast.textContent = message;
    
    // Add to DOM
    document.body.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
        document.body.removeChild(toast);
    }, 3000);
}

// Load Google Sign-In library
function loadGoogleSignIn() {
    const script = document.createElement('script');
    script.src = "https://accounts.google.com/gsi/client";
    script.onload = () => {
        // Initialize Google Sign-In
        google.accounts.id.initialize({
            client_id: "52686426344-omno2e3l9h31dvcgs3c4ghl49n7i36o4.apps.googleusercontent.com",
            callback: handleGoogleSignInResponse
        });
    };
    document.head.appendChild(script);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Load Google Sign-In
    loadGoogleSignIn();
});