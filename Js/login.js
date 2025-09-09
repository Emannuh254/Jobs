// Utility: Show a specific form by ID
function switchForm(activeId) {
  const forms = ['signin-form', 'signup-form', 'forgot-form'];
  const tabs = ['signin-tab', 'signup-tab'];

  forms.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.toggle('active', id === activeId);
    el.classList.toggle('inactive', id !== activeId);
  });

  tabs.forEach(id => {
    const tab = document.getElementById(id);
    if (!tab) return;
    tab.classList.toggle('tab-active', `${id}-form` === activeId);
  });
}

function showSignIn() { switchForm('signin-form'); }
function showSignUp() { switchForm('signup-form'); }
function showForgotPassword() { switchForm('forgot-form'); }

// Toggle password visibility
function togglePassword(fieldId) {
  const field = document.getElementById(fieldId);
  const icon = field.parentElement.querySelector('button i');
  const isPassword = field.type === 'password';
  field.type = isPassword ? 'text' : 'password';
  icon.classList.toggle('fa-eye', !isPassword);
  icon.classList.toggle('fa-eye-slash', isPassword);
}

// Validators
const validateEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validateFullName = name => /^[A-Za-z]+(?:\s+[A-Za-z]+)+$/.test(name.trim());
const validatePassword = pass => {
  return {
    valid: pass.length >= 8 && /[A-Z]/.test(pass) && /[0-9]/.test(pass) && /[^A-Za-z0-9]/.test(pass),
    strength: getPasswordStrength(pass)
  };
};

// Password Strength Helper
function getPasswordStrength(pass) {
  let score = 0;
  if (pass.length >= 8) score++;
  if (/[A-Z]/.test(pass)) score++;
  if (/[0-9]/.test(pass)) score++;
  if (/[^A-Za-z0-9]/.test(pass)) score++;
  if (score <= 1) return 'Weak';
  if (score === 2) return 'Medium';
  return 'Strong';
}

// Show Password Strength Live
function showPasswordStrength(inputId, strengthId) {
  const pass = document.getElementById(inputId).value;
  const strengthText = document.getElementById(strengthId);
  const { strength } = validatePassword(pass);
  strengthText.textContent = pass ? `Strength: ${strength}` : '';
  strengthText.className = strength === 'Weak' ? 'text-red-500 text-sm'
                      : strength === 'Medium' ? 'text-yellow-500 text-sm'
                      : 'text-green-500 text-sm';
}

// Error Handling
function showError(fieldId, message) {
  const errorElement = document.getElementById(`${fieldId}-error`);
  if (!errorElement) return false;
  errorElement.textContent = message;
  errorElement.classList.remove('hidden');
  return false;
}

function clearErrors(formId) {
  const form = document.getElementById(formId);
  form.querySelectorAll('p[id$="-error"]').forEach(el => {
    el.textContent = '';
    el.classList.add('hidden');
  });
}

// Async Simulation
function handleSubmit(event, action, onSuccess) {
  event.preventDefault();
  const btn = event.target.querySelector('button[type="submit"]');
  const original = btn.innerHTML;
  btn.innerHTML = '<div class="spinner mx-auto"></div>';
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = original;
    btn.disabled = false;
    showToast(action, 'success');
    if (onSuccess) setTimeout(onSuccess, 1000);
  }, 1000);
}

// Sign In
function handleSignIn(event) {
  clearErrors('signin-form');
  const email = document.getElementById('signin-email').value;
  const password = document.getElementById('signin-password').value;
  if (!validateEmail(email)) return showError('signin-email', 'Invalid email address');
  if (!password.trim()) return showError('signin-password', 'Password is required');
  handleSubmit(event, 'Sign in successful! Redirecting...', () => console.log('Redirecting...'));
}

// Sign Up
function handleSignUp(event) {
  clearErrors('signup-form');
  const name = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  const confirm = document.getElementById('signup-confirm').value;

  if (!validateFullName(name)) return showError('signup-name', 'Enter first and last name');
  if (!validateEmail(email)) return showError('signup-email', 'Invalid email address');

  const { valid } = validatePassword(password);
  if (!valid) return showError('signup-password', 'Password must have 8+ chars, uppercase, number, symbol');
  if (password !== confirm) return showError('signup-confirm', 'Passwords do not match');

  handleSubmit(event, 'Account created! Please sign in.', showSignIn);
}

// Forgot Password
function handleForgotPassword(event) {
  clearErrors('forgot-form');
  const email = document.getElementById('forgot-email').value;
  if (!validateEmail(email)) return showError('forgot-email', 'Invalid email address');
  handleSubmit(event, 'Password reset link sent!', showSignIn);
}

// Google Sign-In (Mock)
function handleGoogleSignIn() {
  document.querySelectorAll('button[onclick="handleGoogleSignIn()"]').forEach(btn => {
    const original = btn.innerHTML;
    btn.innerHTML = '<div class="spinner mx-auto"></div>';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = original;
      btn.disabled = false;
      showToast('Google Sign-In successful!', 'success');
    }, 1000);
  });
}

// Toasts
function showToast(message, type) {
  document.querySelectorAll('.toast').forEach(t => t.remove());
  const toast = document.createElement('div');
  toast.className = `toast toast-${type} animate-fade-in`;
  toast.innerHTML = `
    <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
    <span>${message}</span>
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('Google Sign-In initialized (mock client ID)');
});
