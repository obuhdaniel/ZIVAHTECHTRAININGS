/* ══════════════════════════════════════════════════════════
   FOGO · API SERVICE LAYER
   ──────────────────────────────────────────────────────────
   Single place where the UI talks to the backend.

   · DEMO MODE (default): returns bundled sample data and
     simulates latency, so the whole app works with no server.
   · LIVE MODE: set FOGO_CONFIG.demoMode = false and point
     FOGO_CONFIG.apiBaseUrl at the real API. Nothing else in
     the frontend needs to change.
   ══════════════════════════════════════════════════════════ */

const FOGO_CONFIG = window.FOGO_CONFIG = window.FOGO_CONFIG || {};

const API_BASE_URL = FOGO_CONFIG.apiBaseUrl || '/api/v1';
const DEMO_MODE = FOGO_CONFIG.demoMode !== undefined ? FOGO_CONFIG.demoMode : true;
const REQUEST_TIMEOUT = FOGO_CONFIG.timeout || 8000;

/* ── Storage keys ──────────────────────────────────────── */
const TOKEN_KEY = 'fogo_token';
const USER_KEY = 'fogo_user';
const USERS_KEY = 'fogo_demo_users';

/* ── Demo seed account (shown on the auth screen) ───────── */
const DEMO_CREDENTIALS = {
  email: 'demo@fogo.com',
  password: 'password',
  name: 'Dwayne Tatum',
  role: 'CEO Assistant',
  initials: 'DT',
};

/* ═══ Session helpers ═════════════════════════════════════ */
function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function getUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY)) || null;
  } catch (_) {
    return null;
  }
}

function setSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

function hasSession() {
  return Boolean(getToken());
}

/* ═══ Demo helpers ════════════════════════════════════════ */
function loadUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch (_) {
    return [];
  }
}

function saveUsers(list) {
  localStorage.setItem(USERS_KEY, JSON.stringify(list));
}

function seedUsers() {
  const list = loadUsers();
  if (!list.some(u => u.email.toLowerCase() === DEMO_CREDENTIALS.email)) {
    list.unshift(DEMO_CREDENTIALS);
    saveUsers(list);
  }
}

function initialsOf(name) {
  return String(name).trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

function generateToken() {
  return 'demo.' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function simulateNetwork(payload, ms = 500) {
  return new Promise(resolve => setTimeout(() => resolve(payload), ms));
}

function demoLogin(email, password) {
  seedUsers();
  const user = loadUsers().find(u => u.email.toLowerCase() === String(email).toLowerCase());
  if (!user) throw new Error('Account not found. Try demo@fogo.com / password');
  if (user.password !== password) throw new Error('Incorrect password. Try demo@fogo.com / password');
  const token = generateToken();
  const session = {
    name: user.name,
    role: user.role || 'Member',
    initials: user.initials || initialsOf(user.name),
    email: user.email,
  };
  setSession(token, session);
  return { token, user: session };
}

function demoSignup({ name, email, password, role }) {
  seedUsers();
  const list = loadUsers();
  if (list.some(u => u.email.toLowerCase() === String(email).toLowerCase())) {
    throw new Error('An account with this email already exists. Try logging in.');
  }
  const user = { name, email, role: role || 'Member', initials: initialsOf(name), password };
  list.push(user);
  saveUsers(list);
  const token = generateToken();
  const session = { name: user.name, role: user.role, initials: user.initials, email: user.email };
  setSession(token, session);
  return { token, user: session };
}

/* ═══ Request helper (live mode) ══════════════════════════ */
async function request(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (!res.ok) {
    let message = 'Request failed';
    try {
      const err = await res.json();
      message = err.message || message;
    } catch (_) {/* ignore */}
    const error = new Error(message);
    error.status = res.status;
    throw error;
  }

  return res.json();
}

/* ═══ Sample dashboard data (demo mode) ═══════════════════ */
const SAMPLE_METRICS = {
  totalRevenue: { value: '$689', change: 5, up: true, label: 'This month' },
  totalExpenses: { value: '$460', change: 5, up: false, label: 'This month' },
  newProfit: { value: '$840', change: 7, up: true, label: 'This month' },
  cashBalance: { value: '$568', change: 2, up: true, label: 'This month' },
};

const SAMPLE_APPOINTMENTS = [
  { name: 'Robert Fox', time: '10:00 AM', initials: 'RF', bg: '#e8f0fe', color: '#3478ed' },
  { name: 'Annette Black', time: '10:10 AM', initials: 'AB', bg: '#fde7ec', color: '#e74c4c' },
  { name: 'Ralph Edwards', time: '10:25 AM', initials: 'RE', bg: '#e8f7ee', color: '#18a957' },
  { name: 'Arlene McCoy', time: '10:45 AM', initials: 'AM', bg: '#fff4e5', color: '#f59e0b' },
  { name: 'Devon Lane', time: '11:00 AM', initials: 'DL', bg: '#e5f7fb', color: '#43c4d9' },
  { name: 'Savannah Nguyen', time: '11:10 AM', initials: 'SN', bg: '#f3ebff', color: '#8b5cf6' },
];

const SAMPLE_TRANSACTIONS = [
  { id: '#1588', name: 'Ralph Edwards', initials: 'RE', bg: '#e8f0fe', color: '#3478ed', date: '9/23/16', type: 'Payment', amount: 396.84 },
  { id: '#1588', name: 'Darrell Steward', initials: 'DS', bg: '#fde7ec', color: '#e74c4c', date: '5/7/16', type: 'Refund', amount: 169.43 },
  { id: '#1589', name: 'Savannah Nguyen', initials: 'SN', bg: '#f3ebff', color: '#8b5cf6', date: '8/14/16', type: 'Payment', amount: 512.20 },
  { id: '#1590', name: 'Cameron Williamson', initials: 'CW', bg: '#e5f7fb', color: '#43c4d9', date: '2/11/16', type: 'Refund', amount: 233.10 },
];

const SAMPLE_REVENUE = {
  'This week': { todayLabel: 'Today Revenue', todayValue: '$720' },
  'Last week': { todayLabel: 'Today Revenue', todayValue: '$648' },
  'This month': { todayLabel: 'Month Revenue', todayValue: '$2,140' },
};

/* ═══ Public API ══════════════════════════════════════════ */
const API = {
  isDemo: () => DEMO_MODE,
  getToken,
  getUser,
  hasSession,
  logoutLocal: clearSession,

  /* ── Auth endpoints ─────────────────────────────────── */
  async login(email, password) {
    const payload = { email, password };
    if (DEMO_MODE) return simulateNetwork(demoLogin(email, password));
    return request('/auth/login', { method: 'POST', body: payload });
  },

  async signup({ name, email, password, role }) {
    const payload = { name, email, password, role };
    if (DEMO_MODE) return simulateNetwork(demoSignup(payload));
    return request('/auth/signup', { method: 'POST', body: payload });
  },

  async forgotPassword(email) {
    if (DEMO_MODE) return simulateNetwork({ ok: true, message: 'Reset link sent to ' + email });
    return request('/auth/forgot-password', { method: 'POST', body: { email } });
  },

  async logout() {
    try {
      if (DEMO_MODE) {
        clearSession();
        return simulateNetwork({ ok: true });
      }
      return await request('/auth/logout', { method: 'POST' });
    } finally {
      clearSession();
    }
  },

  /* One-click demo entry from the landing page */
  loginDemo() {
    seedUsers();
    const name = DEMO_CREDENTIALS.name;
    const token = generateToken();
    const session = {
      name,
      role: DEMO_CREDENTIALS.role,
      initials: DEMO_CREDENTIALS.initials,
      email: DEMO_CREDENTIALS.email,
    };
    setSession(token, session);
    return { token, user: session };
  },

  /* ── Dashboard endpoints ────────────────────────────── */
  async getMetrics() {
    if (DEMO_MODE) return simulateNetwork(SAMPLE_METRICS);
    return request('/dashboard/metrics');
  },

  async getRevenue(period) {
    if (DEMO_MODE) {
      const data = SAMPLE_REVENUE[period] || SAMPLE_REVENUE['This week'];
      return simulateNetwork(data);
    }
    return request('/dashboard/revenue?period=' + encodeURIComponent(period));
  },

  async getAppointments() {
    if (DEMO_MODE) return simulateNetwork(SAMPLE_APPOINTMENTS);
    return request('/dashboard/appointments');
  },

  async getTransactions() {
    if (DEMO_MODE) return simulateNetwork(SAMPLE_TRANSACTIONS);
    return request('/dashboard/transactions');
  },
};

window.API = API;