/* Altrace Console — Auth Module
   Session management and authenticated fetch wrapper.
   Token stored in sessionStorage (cleared on tab close). */

const AUTH_KEY = 'altrace_session';

function getSession() {
  try {
    const raw = sessionStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function setSession(org, token, role) {
  sessionStorage.setItem(AUTH_KEY, JSON.stringify({ org, token, role: role || 'operator' }));
}

function clearSession() {
  sessionStorage.removeItem(AUTH_KEY);
  if (window.location.pathname !== '/login' && window.location.pathname !== '/login.html') {
    window.location.href = '/login.html';
  }
}

function requireAuth() {
  const session = getSession();
  if (!session || !session.token) {
    clearSession();
    return null;
  }
  return session;
}

function getRole() {
  const s = getSession();
  return s ? s.role : '';
}

function isAdmin() {
  return getRole() === 'admin';
}

function canWrite() {
  const r = getRole();
  return r === 'admin' || r === 'operator';
}

async function authFetch(path, opts = {}) {
  const session = getSession();
  if (!session) { clearSession(); throw new Error('No session'); }

  const headers = {
    'Authorization': 'Bearer ' + session.token,
    'Content-Type': 'application/json',
    ...(opts.headers || {})
  };

  const resp = await fetch(path, { ...opts, headers });

  if (resp.status === 401 || resp.status === 403) {
    clearSession();
    throw new Error('Session expired');
  }

  return resp;
}
