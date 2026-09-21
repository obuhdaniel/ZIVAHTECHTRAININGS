if (window.lucide) lucide.createIcons();

const $ = (s, c = document) => c.querySelector(s);

/* ── Mode from URL: ?mode=login | signup | forgot ──────── */
const params = new URLSearchParams(location.search);
const initialMode = ['login', 'signup', 'forgot'].includes(params.get('mode'))
  ? params.get('mode')
  : 'login';

let mode = initialMode;

/* ── Elements ──────────────────────────────────────────── */
const tabLogin = $('#tabLogin');
const tabSignup = $('#tabSignup');
const authTitle = $('#authTitle');
const authSub = $('#authSub');
const authForm = $('#authForm');
const forgotForm = $('#forgotForm');
const formAlert = $('#formAlert');
const forgotAlert = $('#forgotAlert');
const submitBtn = $('#submitBtn');
const submitText = $('#submitText');
const spinner = $('#spinner');
const forgotBtn = $('#forgotBtn');
const forgotText = $('#forgotText');
const forgotSpinner = $('#forgotSpinner');
const footLink = $('#footLink');

const fields = {
  name: $('#name'),
  email: $('#email'),
  password: $('#password'),
  confirm: $('#confirm'),
  forgotEmail: $('#forgotEmail'),
};

const errors = {
  name: $('#errorName'),
  email: $('#errorEmail'),
  password: $('#errorPassword'),
  confirm: $('#errorConfirm'),
  forgot: $('#errorForgot'),
};

/* ── Mode switching ────────────────────────────────────── */
function setMode(next) {
  mode = next;
  const isLogin = mode === 'login';
  const isForgot = mode === 'forgot';

  tabLogin.classList.toggle('active', isLogin);
  tabSignup.classList.toggle('active', mode === 'signup');

  $('#fieldName').classList.toggle('hidden', !(mode === 'signup'));
  $('#fieldConfirm').classList.toggle('hidden', !(mode === 'signup'));

  authForm.classList.toggle('hidden', isForgot);
  forgotForm.classList.toggle('hidden', !isForgot);

  formAlert.classList.add('hidden');
  forgotAlert.classList.add('hidden');

  if (isForgot) {
    authTitle.textContent = 'Reset password';
    authSub.textContent = 'Enter your email and we’ll send you a reset link.';
    footLink.classList.add('pointer-events-none', 'opacity-0');
  } else if (isLogin) {
    authTitle.textContent = 'Welcome back';
    authSub.textContent = 'Log in to your FOGO dashboard.';
    submitText.textContent = 'Log in';
    $('#forgotLink').classList.remove('hidden');
    footLink.textContent = 'Sign up';
    footLink.href = 'auth.html?mode=signup';
    footLink.classList.remove('pointer-events-none', 'opacity-0');
  } else {
    authTitle.textContent = 'Create your account';
    authSub.textContent = 'Start your free 14-day trial.';
    submitText.textContent = 'Create account';
    $('#forgotLink').classList.add('hidden');
    footLink.textContent = 'Log in';
    footLink.href = 'auth.html?mode=login';
    footLink.classList.remove('pointer-events-none', 'opacity-0');
  }
}

tabLogin?.addEventListener('click', () => setMode('login'));
tabSignup?.addEventListener('click', () => setMode('signup'));

$('#forgotLink')?.addEventListener('click', () => setMode('forgot'));
$('#backToLogin')?.addEventListener('click', () => setMode('login'));

/* ── Validation helpers ────────────────────────────────── */
function setFieldError(name, message) {
  const input = fields[name];
  if (!input) return;
  input.closest('.field').classList.toggle('invalid', Boolean(message));
  if (errors[name]) {
    errors[name].textContent = message || '';
    errors[name].classList.toggle('show', Boolean(message));
  }
}

function clearFormErrors() {
  Object.keys(fields).forEach(k => setFieldError(k, ''));
  formAlert.classList.add('hidden');
}

function showAlert(alertEl, type, message) {
  if (!alertEl) return;
  alertEl.classList.remove('hidden', 'error', 'success');
  alertEl.classList.add(type);
  alertEl.textContent = message;
}

function validate() {
  let ok = true;
  const name = fields.name.value.trim();
  const email = fields.email.value.trim();
  const password = fields.password.value;
  const confirm = fields.confirm.value;

  if (mode === 'signup') {
    if (name.length < 2) {
      setFieldError('name', 'Please enter your full name');
      ok = false;
    }
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    setFieldError('email', 'Enter a valid email address');
    ok = false;
  }

  if (password.length < 6) {
    setFieldError('password', 'Password must be at least 6 characters');
    ok = false;
  }

  if (mode === 'signup' && confirm !== password) {
    setFieldError('confirm', 'Passwords do not match');
    ok = false;
  }

  return ok;
}

/* ── Submit (login / signup) ───────────────────────────── */
function setLoading(loading) {
  submitBtn.disabled = loading;
  spinner.classList.toggle('hidden', !loading);
  submitText.style.opacity = loading ? 0 : 1;
}

async function handleAuthSubmit(e) {
  e.preventDefault();
  clearFormErrors();

  if (!validate()) return;

  setLoading(true);
  try {
    if (mode === 'login') {
      await API.login(fields.email.value.trim(), fields.password.value);
    } else {
      await API.signup({
        name: fields.name.value.trim(),
        email: fields.email.value.trim(),
        password: fields.password.value,
      });
    }
    window.location.href = 'dashboard.html';
  } catch (err) {
    showAlert(formAlert, 'error', err.message || 'Something went wrong. Please try again.');
    setLoading(false);
  }
}

authForm?.addEventListener('submit', handleAuthSubmit);

/* ── Forgot password ───────────────────────────────────── */
async function handleForgotSubmit(e) {
  e.preventDefault();
  const email = fields.forgotEmail.value.trim();
  forgotAlert.classList.add('hidden');
  setFieldError('forgot', '');

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    setFieldError('forgot', 'Enter a valid email address');
    return;
  }

  forgotBtn.disabled = true;
  forgotSpinner.classList.remove('hidden');
  forgotText.textContent = 'Sending…';

  try {
    await API.forgotPassword(email);
    showAlert(forgotAlert, 'success', 'If an account exists for that email, a reset link has been sent.');
  } catch (err) {
    showAlert(forgotAlert, 'error', err.message || 'Something went wrong. Please try again.');
  } finally {
    forgotBtn.disabled = false;
    forgotSpinner.classList.add('hidden');
    forgotText.textContent = 'Send reset link';
  }
}

forgotForm?.addEventListener('submit', handleForgotSubmit);

/* ── Password visibility ───────────────────────────────── */
let passwordVisible = false;
$('#togglePassword')?.addEventListener('click', () => {
  passwordVisible = !passwordVisible;
  fields.password.type = passwordVisible ? 'text' : 'password';
  const icon = $('#togglePassword i');
  if (icon) icon.setAttribute('data-lucide', passwordVisible ? 'eye-off' : 'eye');
  if (window.lucide) lucide.createIcons();
});

/* ── Demo account fill ─────────────────────────────────── */
$('#demoFill')?.addEventListener('click', () => {
  setMode('login');
  fields.email.value = 'demo@fogo.com';
  fields.password.value = 'password';
  $('#remember').checked = true;
  clearFormErrors();
  showAlert(formAlert, 'success', 'Demo credentials filled. Press “Log in”.');
});

/* ── Clear a field's error as the user types ───────────── */
Object.keys(fields).forEach(key => {
  fields[key]?.addEventListener('input', () => setFieldError(key, ''));
});

setMode(initialMode);