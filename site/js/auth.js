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
  // Dashboard
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

  // Fleet
  '/api/v1/fleet': {
    total: 14,
    active: 12,
    offline: 2,
    sidecars: [
      { id: 'sc-001', namespace: 'ml-research', status: 'active', version: 'v0.1.4', last_heartbeat: new Date(Date.now() - 15000).toISOString(), team: 'ml-research', agent: 'claude-coder', policy_version: 3, invariant_summary: { budget: 'ok', kill_switch: 'clear', iptables: 'configured' }, causal_checkpoint: { record_count: 1847, last_hash: 'a3f2c1e8' } },
      { id: 'sc-002', namespace: 'product-ai', status: 'active', version: 'v0.1.4', last_heartbeat: new Date(Date.now() - 22000).toISOString(), team: 'product-ai', agent: 'gpt-assistant', policy_version: 3, invariant_summary: { budget: 'ok', kill_switch: 'clear', iptables: 'configured' }, causal_checkpoint: { record_count: 923, last_hash: 'b7d4e5f9' } },
      { id: 'sc-003', namespace: 'customer-support', status: 'active', version: 'v0.1.4', last_heartbeat: new Date(Date.now() - 8000).toISOString(), team: 'customer-support', agent: 'support-bot', policy_version: 3, invariant_summary: { budget: 'ok', kill_switch: 'clear', iptables: 'configured' }, causal_checkpoint: { record_count: 412, last_hash: 'c9e6f2a3' } },
      { id: 'sc-004', namespace: 'devops-agents', status: 'active', version: 'v0.1.3', last_heartbeat: new Date(Date.now() - 45000).toISOString(), team: 'devops-agents', agent: 'infra-agent', policy_version: 2, invariant_summary: { budget: 'ok', kill_switch: 'clear', iptables: 'configured' }, causal_checkpoint: { record_count: 89, last_hash: 'd1a8b3c4' } },
      { id: 'sc-012', namespace: 'ml-research', status: 'offline', version: 'v0.1.3', last_heartbeat: new Date(Date.now() - 300000).toISOString(), team: 'ml-research', agent: 'batch-processor', policy_version: 2, invariant_summary: { budget: 'ok', kill_switch: 'clear', iptables: 'configured' }, causal_checkpoint: { record_count: 56, last_hash: 'e2b9c4d5' } },
      { id: 'sc-013', namespace: 'staging', status: 'offline', version: 'v0.1.2', last_heartbeat: new Date(Date.now() - 600000).toISOString(), team: 'staging', agent: 'test-agent', policy_version: 1, invariant_summary: { budget: 'ok', kill_switch: 'clear', iptables: 'not_configured' }, causal_checkpoint: { record_count: 3, last_hash: 'f3c1d5e6' } }
    ]
  },

  // Kill switches
  '/api/v1/kill': {
    state: { global: false },
    entries: [
      { scope: 'team', target: 'staging', active: false, reason: 'Scheduled maintenance', activated_at: '2026-02-24T08:00:00Z', deactivated_at: '2026-02-24T12:00:00Z', activated_by: 'ops-admin' },
      { scope: 'agent', target: 'batch-processor', active: false, reason: 'Cost anomaly detected', activated_at: '2026-02-23T16:30:00Z', deactivated_at: '2026-02-23T17:15:00Z', activated_by: 'auto-graduated' }
    ]
  },

  // Budget
  '/api/v1/budget/status': {
    teams: [
      { team: 'ml-research', limit_usd: 500, used_usd: 215.30, remaining_usd: 284.70 },
      { team: 'product-ai', limit_usd: 200, used_usd: 87.60, remaining_usd: 112.40 },
      { team: 'customer-support', limit_usd: 100, used_usd: 43.20, remaining_usd: 56.80 },
      { team: 'devops-agents', limit_usd: 300, used_usd: 12.00, remaining_usd: 288.00 }
    ]
  },

  // Runs
  '/api/v1/runs': {
    runs: [
      { id: 'r-001', team: 'ml-research', agent: 'claude-coder', model: 'claude-sonnet-4-20250514', cost_usd: 0.032, tokens_in: 1200, tokens_out: 450, action: 'allow', timestamp: '2026-02-25T14:30:00Z' },
      { id: 'r-002', team: 'product-ai', agent: 'gpt-assistant', model: 'gpt-4o', cost_usd: 0.028, tokens_in: 890, tokens_out: 320, action: 'allow', timestamp: '2026-02-25T14:29:45Z' },
      { id: 'r-003', team: 'ml-research', agent: 'claude-coder', model: 'claude-sonnet-4-20250514', cost_usd: 0.0, tokens_in: 0, tokens_out: 0, action: 'block', reason: 'content_policy_violation', timestamp: '2026-02-25T14:29:30Z' },
      { id: 'r-004', team: 'customer-support', agent: 'support-bot', model: 'gpt-4o-mini', cost_usd: 0.004, tokens_in: 320, tokens_out: 180, action: 'allow', timestamp: '2026-02-25T14:28:12Z' },
      { id: 'r-005', team: 'devops-agents', agent: 'infra-agent', model: 'claude-haiku-20250514', cost_usd: 0.001, tokens_in: 150, tokens_out: 60, action: 'allow', timestamp: '2026-02-25T14:27:05Z' }
    ]
  },

  // Credentials / VirtualKeys
  '/api/v1/credentials': {
    credentials: [
      { id: 'vk-001', team: 'ml-research', label: 'Claude Production', provider: 'anthropic', budget_limit_usd: 100, budget_used_usd: 45.20, budget_interval: 'daily', status: 'active', created_at: '2026-02-01T10:00:00Z' },
      { id: 'vk-002', team: 'product-ai', label: 'GPT Staging', provider: 'openai', budget_limit_usd: 50, budget_used_usd: 12.80, budget_interval: 'weekly', status: 'active', created_at: '2026-02-05T14:30:00Z' },
      { id: 'vk-003', team: 'customer-support', label: 'Support Bot Key', provider: 'openai', budget_limit_usd: 25, budget_used_usd: 8.40, budget_interval: 'daily', status: 'active', created_at: '2026-02-10T09:00:00Z' }
    ]
  },
  '/api/v1/credentials/list': {
    credentials: [
      { id: 'vk-001', team: 'ml-research', label: 'Claude Production', provider: 'anthropic', budget_limit_usd: 100, budget_used_usd: 45.20, budget_interval: 'daily', status: 'active', created_at: '2026-02-01T10:00:00Z' },
      { id: 'vk-002', team: 'product-ai', label: 'GPT Staging', provider: 'openai', budget_limit_usd: 50, budget_used_usd: 12.80, budget_interval: 'weekly', status: 'active', created_at: '2026-02-05T14:30:00Z' },
      { id: 'vk-003', team: 'customer-support', label: 'Support Bot Key', provider: 'openai', budget_limit_usd: 25, budget_used_usd: 8.40, budget_interval: 'daily', status: 'active', created_at: '2026-02-10T09:00:00Z' }
    ]
  },

  // Kill switch global
  '/api/v1/kill/global': { active: false },

  // Compliance — AIUC-1 controls
  '/api/v1/verify/aiuc1': {
    controls: [
      { control_id: 'A002', domain: 'A', title: 'Human Override Mechanism', status: 'enforced', description: 'Kill switch hierarchy (global/team/agent) with SQLite persistence' },
      { control_id: 'A006', domain: 'A', title: 'Graduated Response Protocol', status: 'enforced', description: '5-level escalation with asymmetric de-escalation' },
      { control_id: 'B002', domain: 'B', title: 'Mandatory Proxy Transit', status: 'enforced', description: 'iptables NAT REDIRECT via init container' },
      { control_id: 'B006', domain: 'B', title: 'Budget Pre-Request Check', status: 'enforced', description: 'Atomic budget check before upstream call' },
      { control_id: 'B008', domain: 'B', title: 'Content Classification', status: 'enforced', description: 'RE2 regex classification, bool match only' },
      { control_id: 'C003', domain: 'C', title: 'Attribution Integrity', status: 'enforced', description: 'Trusted source overrides client headers' },
      { control_id: 'C009', domain: 'C', title: 'Tamper-Evident Audit', status: 'enforced', description: 'SHA-256 hash chain causal records' },
      { control_id: 'D003', domain: 'D', title: 'Fail-Closed Behavior', status: 'enforced', description: 'Budget errors block, unknown models use conservative pricing' },
      { control_id: 'D005', domain: 'D', title: 'Health Enforcement Probe', status: 'enforced', description: '/health/enforcement returns 503 when degraded' },
      { control_id: 'E003', domain: 'E', title: 'Decision Reason Codes', status: 'enforced', description: 'Machine-readable X-Altrace-Decision-Reason header' },
      { control_id: 'E008', domain: 'E', title: 'Evidence Bundle Generation', status: 'enforced', description: 'altrace verify --aiuc1 with SHA-256 self-hash' },
      { control_id: 'A004', domain: 'A', title: 'Delegation Depth Limits', status: 'configured', description: 'A2A delegation with chain depth enforcement' },
      { control_id: 'C006', domain: 'C', title: 'Credential Lifecycle', status: 'configured', description: 'VirtualKey issuance, rotation, revocation' },
      { control_id: 'E015', domain: 'E', title: 'Compliance Dashboard', status: 'configured', description: 'AIUC-1 Prometheus gauges + Grafana panel' }
    ]
  },

  // Policies
  '/api/v1/policies': {
    policies: [
      { version: 3, active: true, hash: 'a3f2c1e8d4b5a697c8e9f0a1b2c3d4e5', created_at: '2026-02-24T10:30:00Z', created_by: 'karthik', ack_count: 12, total_sidecars: 14, description: 'Enable RTL guard + tool permissions' },
      { version: 2, active: false, hash: 'b7d4e5f9a0c1b2d3e4f5a6b7c8d9e0f1', created_at: '2026-02-20T14:15:00Z', created_by: 'karthik', ack_count: 14, total_sidecars: 14, description: 'Add content governance rules' },
      { version: 1, active: false, hash: 'c9e6f2a3b4d5c6e7f8a9b0c1d2e3f4a5', created_at: '2026-02-15T09:00:00Z', created_by: 'karthik', ack_count: 14, total_sidecars: 14, description: 'Initial policy — budget + kill switch only' }
    ]
  },

  // Approvals
  '/api/v1/approvals': {
    approvals: [
      { id: 'apr-001', status: 'pending', team: 'ml-research', agent: 'claude-coder', tool_name: 'execute_sql', action_level: 'execute', created_at: '2026-02-25T14:25:00Z', metadata: { tool_name: 'execute_sql', database: 'production' } },
      { id: 'apr-002', status: 'approved', team: 'product-ai', agent: 'gpt-assistant', tool_name: 'send_email', action_level: 'write', created_at: '2026-02-25T13:50:00Z', resolved_at: '2026-02-25T13:52:00Z', resolved_by: 'ops-admin', metadata: { tool_name: 'send_email', recipient: 'customer@example.com' } }
    ]
  },

  // Workflows (audit)
  '/api/v1/workflows': {
    workflows: [
      { workflow_run_id: 'wf-a1b2c3', agent_id: 'claude-coder', team: 'ml-research', status: 'active', record_count: 47, started_at: '2026-02-25T14:20:00Z' },
      { workflow_run_id: 'wf-d4e5f6', agent_id: 'gpt-assistant', team: 'product-ai', status: 'closed', record_count: 23, started_at: '2026-02-25T13:45:00Z' },
      { workflow_run_id: 'wf-g7h8i9', agent_id: 'support-bot', team: 'customer-support', status: 'active', record_count: 12, started_at: '2026-02-25T14:10:00Z' },
      { workflow_run_id: 'wf-j0k1l2', agent_id: 'batch-processor', team: 'ml-research', status: 'killed', record_count: 89, started_at: '2026-02-25T12:00:00Z' }
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
