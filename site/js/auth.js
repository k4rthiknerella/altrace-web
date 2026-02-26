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
  sessionStorage.removeItem('altrace_demo');
  if (window.location.pathname !== '/login' && window.location.pathname !== '/login.html') {
    window.location.href = '/login.html';
  }
}

function isDemo() {
  return sessionStorage.getItem('altrace_demo') === 'true';
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

// ── Demo mode mock data ──────────────────────────────────

const DEMO_MOCK_DATA = {
  '/api/v1/dashboard': {
    fleet: { active: 12, total_sidecars: 14 },
    kill_switch: { global: false, active_team_kills: [], active_agent_kills: [] },
    policy: { current_version: 3, rollout: { acknowledged: 12, total: 14 } },
    cost_24h: { total_usd: 127.50 },
    budget: {
      teams: [
        { team: 'ml-research', allocated_usd: 500, used_usd: 215.30 },
        { team: 'product-ai', allocated_usd: 200, used_usd: 87.60 },
        { team: 'customer-support', allocated_usd: 100, used_usd: 43.20 },
        { team: 'devops-agents', allocated_usd: 300, used_usd: 12.00 }
      ]
    },
    decisions_24h: { allow: 8102, block: 287, kill: 0, warn: 43 }
  },
  '/api/v1/budget/status': {
    teams: [
      { team: 'ml-research', limit_usd: 500, used_usd: 215.30, remaining_usd: 284.70 },
      { team: 'product-ai', limit_usd: 200, used_usd: 87.60, remaining_usd: 112.40 },
      { team: 'customer-support', limit_usd: 100, used_usd: 43.20, remaining_usd: 56.80 },
      { team: 'devops-agents', limit_usd: 300, used_usd: 12.00, remaining_usd: 288.00 }
    ]
  },
  '/api/v1/kill/global': { active: false },
  '/api/v1/runs': {
    runs: [
      { id: 'r-001', team: 'ml-research', agent: 'claude-coder', model: 'claude-sonnet-4-20250514', cost_usd: 0.032, tokens_in: 1200, tokens_out: 450, action: 'allow', timestamp: '2026-02-25T14:30:00Z' },
      { id: 'r-002', team: 'product-ai', agent: 'gpt-assistant', model: 'gpt-4o', cost_usd: 0.028, tokens_in: 890, tokens_out: 320, action: 'allow', timestamp: '2026-02-25T14:29:45Z' },
      { id: 'r-003', team: 'ml-research', agent: 'claude-coder', model: 'claude-sonnet-4-20250514', cost_usd: 0.0, tokens_in: 0, tokens_out: 0, action: 'block', reason: 'content_policy_violation', timestamp: '2026-02-25T14:29:30Z' }
    ]
  },
  '/api/v1/credentials': {
    credentials: [
      { id: 'vk-001', team: 'ml-research', label: 'Claude Production', budget_limit_usd: 100, budget_used_usd: 45.20, budget_interval: 'daily' },
      { id: 'vk-002', team: 'product-ai', label: 'GPT Staging', budget_limit_usd: 50, budget_used_usd: 12.80, budget_interval: 'weekly' }
    ]
  }
};

function demoResponse(data) {
  return {
    ok: true,
    status: 200,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data))
  };
}

async function authFetch(path, opts = {}) {
  const session = getSession();
  if (!session) { clearSession(); throw new Error('No session'); }

  // Demo mode: return mock data without hitting the hub
  if (isDemo()) {
    // Strip query string for lookup
    const cleanPath = path.split('?')[0];
    const mockData = DEMO_MOCK_DATA[cleanPath];
    if (mockData) {
      return demoResponse(mockData);
    }
    // Fallback for any unrecognized API path
    if (cleanPath.startsWith('/api/')) {
      return demoResponse({ status: 'demo', message: 'Demo mode \u2014 connect a hub for live data' });
    }
  }

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
