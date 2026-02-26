/* Altrace Console — Shared Infrastructure
   Sidebar injection, SSE stream, toasts, auto-refresh, utilities.
   Loaded after auth.js on every console page. */

// ── Sidebar HTML (single source of truth) ────────────────

const SIDEBAR_HTML = `
  <div class="sidebar-logo">
    <a href="/dashboard.html">
      <svg viewBox="-72 -56 162 110" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M0,-52 L-45,48 L45,48 Z M0,-20 L-20,18 L20,18 Z" fill-rule="evenodd"/><polygon points="-68,50 -60,28 85,-32"/></svg>
      Altrace
    </a>
  </div>
  <div class="sidebar-org" id="sidebar-org"></div>
  <nav class="sidebar-nav">
    <div class="sidebar-section-label">Overview</div>
    <a href="/dashboard.html" class="sidebar-link" data-page="dashboard">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
      Dashboard
    </a>
    <div class="sidebar-section-label">Operations</div>
    <a href="/fleet.html" class="sidebar-link" data-page="fleet">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
      Fleet
    </a>
    <a href="/kill-switches.html" class="sidebar-link" data-page="kill-switches">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
      Kill Switches
    </a>
    <a href="/cost.html" class="sidebar-link" data-page="cost">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
      Cost
    </a>
    <a href="/audit.html" class="sidebar-link" data-page="audit">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
      Audit
    </a>
    <a href="/policies.html" class="sidebar-link" data-page="policies">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
      Policies
    </a>
    <div class="sidebar-section-label">Compliance</div>
    <a href="/compliance.html" class="sidebar-link" data-page="compliance">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
      Compliance
    </a>
    <div class="sidebar-section-label">Security</div>
    <a href="/virtualkeys.html" class="sidebar-link" data-page="virtualkeys">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
      VirtualKeys
    </a>
    <a href="/approvals.html" class="sidebar-link" data-page="approvals">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
      Approvals
    </a>
    <div class="sidebar-section-label">Docs</div>
    <a href="/console-docs.html#quickstart" class="sidebar-link" data-page="console-docs">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
      Documentation
    </a>
  </nav>
  <div class="sidebar-footer">
    <span class="sidebar-role" id="sidebar-role"></span>
    <button class="dark-mode-toggle" id="dark-mode-toggle" onclick="toggleDarkMode()" title="Toggle dark mode">&#9790;</button>
    <button class="sidebar-logout" onclick="clearSession()">Sign out</button>
  </div>
`;

// ── Console initialization ───────────────────────────────

function initConsole(pageName) {
  const session = requireAuth();
  if (!session) return null;

  // Inject sidebar
  const sidebar = document.getElementById('console-sidebar');
  if (sidebar) sidebar.innerHTML = SIDEBAR_HTML;

  // Set active link
  const links = document.querySelectorAll('.sidebar-link');
  links.forEach(link => {
    if (link.dataset.page === pageName) link.classList.add('active');
  });

  // Set role class on body
  document.body.classList.add('role-' + (session.role || 'viewer'));

  // Fill org name and role
  const orgEl = document.getElementById('sidebar-org');
  if (orgEl) orgEl.textContent = session.org || '';
  const roleEl = document.getElementById('sidebar-role');
  if (roleEl) roleEl.textContent = session.role || 'viewer';

  // Apply dark mode from localStorage
  if (localStorage.getItem('altrace_dark_mode') === '1') {
    document.body.classList.add('dark');
    const toggle = document.getElementById('dark-mode-toggle');
    if (toggle) toggle.innerHTML = '&#9788;';
  }

  // Mobile sidebar toggle
  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  overlay.addEventListener('click', () => toggleSidebar(false));
  document.body.appendChild(overlay);

  return session;
}

function toggleSidebar(force) {
  const sidebar = document.getElementById('console-sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  const open = force !== undefined ? force : !sidebar.classList.contains('open');
  sidebar.classList.toggle('open', open);
  if (overlay) overlay.classList.toggle('open', open);
}

// ── Dark mode toggle ─────────────────────────────────────

function toggleDarkMode() {
  const isDark = document.body.classList.toggle('dark');
  localStorage.setItem('altrace_dark_mode', isDark ? '1' : '0');
  const toggle = document.getElementById('dark-mode-toggle');
  if (toggle) toggle.innerHTML = isDark ? '&#9788;' : '&#9790;';
}

// ── SSE via fetch + ReadableStream ───────────────────────

let sseController = null;
let sseReconnectTimer = null;
let sseReconnectDelay = 1000;
const SSE_MAX_DELAY = 30000;

// Page-specific SSE handlers — each page can register callbacks
const sseHandlers = {};

function onSSE(eventType, callback) {
  if (!sseHandlers[eventType]) sseHandlers[eventType] = [];
  sseHandlers[eventType].push(callback);
}

async function connectSSE() {
  if (sseController) sseController.abort();
  sseController = new AbortController();

  const session = getSession();
  if (!session) return;

  try {
    const resp = await fetch('/api/v1alpha1/events', {
      headers: { 'Authorization': 'Bearer ' + session.token },
      signal: sseController.signal
    });

    if (!resp.ok || !resp.body) {
      scheduleReconnect();
      return;
    }

    // Connected — reset delay
    sseReconnectDelay = 1000;
    updateSSEStatus(true);

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split('\n\n');
      buffer = parts.pop();

      for (const raw of parts) {
        if (!raw.trim()) continue;
        const lines = raw.split('\n');
        let type = '', data = '';
        for (const line of lines) {
          if (line.startsWith('event:')) type = line.slice(6).trim();
          else if (line.startsWith('data:')) data = line.slice(5).trim();
        }
        if (type && data) {
          try {
            const parsed = JSON.parse(data);
            dispatchSSE(type, parsed);
          } catch {}
        }
      }
    }
  } catch (err) {
    if (err.name === 'AbortError') return;
  }

  updateSSEStatus(false);
  scheduleReconnect();
}

function dispatchSSE(type, data) {
  const handlers = sseHandlers[type] || [];
  handlers.forEach(fn => { try { fn(data); } catch {} });

  // Default behavior for common events
  if (type === 'kill_switch') {
    showToast('Kill switch ' + (data.action || 'updated') + ': ' + (data.entry?.scope || '') + '/' + (data.entry?.target || ''), 'error');
  } else if (type === 'policy_update') {
    showToast('Policy v' + (data.version || '?') + ' deployed', 'info');
  } else if (type === 'approval_required') {
    showToast('New approval request: ' + (data.metadata?.tool_name || 'unknown'), 'info');
  }
}

function scheduleReconnect() {
  if (sseReconnectTimer) return;
  sseReconnectTimer = setTimeout(() => {
    sseReconnectTimer = null;
    sseReconnectDelay = Math.min(sseReconnectDelay * 2, SSE_MAX_DELAY);
    connectSSE();
  }, sseReconnectDelay);
}

function disconnectSSE() {
  if (sseController) sseController.abort();
  if (sseReconnectTimer) { clearTimeout(sseReconnectTimer); sseReconnectTimer = null; }
}

function updateSSEStatus(connected) {
  const el = document.getElementById('sse-status');
  if (!el) return;
  el.textContent = connected ? 'Connected' : 'Reconnecting...';
  el.classList.toggle('connected', connected);
}

// ── Toast notifications ──────────────────────────────────

function showToast(message, type, duration) {
  type = type || 'info';
  duration = duration || 5000;
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast toast-' + type;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'toast-out 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ── Auto-refresh ─────────────────────────────────────────

let _refreshInterval = null;

function startAutoRefresh(callback, intervalMs) {
  stopAutoRefresh();
  _refreshInterval = setInterval(callback, intervalMs || 30000);
}

function stopAutoRefresh() {
  if (_refreshInterval) { clearInterval(_refreshInterval); _refreshInterval = null; }
}

// ── Confirm dialog ───────────────────────────────────────

function showConfirmDialog(title, message, confirmLabel, onConfirm) {
  const overlay = document.createElement('div');
  overlay.className = 'dialog-overlay';
  overlay.innerHTML = `
    <div class="dialog">
      <div class="dialog-title">${escapeHtml(title)}</div>
      <div class="dialog-body">${escapeHtml(message)}</div>
      <div class="dialog-actions">
        <button class="btn-cancel" id="dialog-cancel">Cancel</button>
        <button class="btn-danger" id="dialog-confirm">${escapeHtml(confirmLabel)}</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  overlay.querySelector('#dialog-cancel').addEventListener('click', () => overlay.remove());
  overlay.querySelector('#dialog-confirm').addEventListener('click', () => {
    overlay.remove();
    onConfirm();
  });
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
}

// ── Utility functions ────────────────────────────────────

function formatUSD(amount) {
  if (amount == null) return '--';
  return '$' + Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function relativeTime(isoString) {
  if (!isoString) return '--';
  const now = Date.now();
  const then = new Date(isoString).getTime();
  const diff = Math.floor((now - then) / 1000);

  if (diff < 0) return 'just now';
  if (diff < 60) return diff + 's ago';
  if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
  return Math.floor(diff / 86400) + 'd ago';
}

function formatTimestamp(isoString) {
  if (!isoString) return '--';
  const d = new Date(isoString);
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

function formatTime(isoString) {
  if (!isoString) return '--';
  const d = new Date(isoString);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
}

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML.replace(/'/g, '&#39;').replace(/"/g, '&quot;');
}

function setLoading(elementId, isLoading) {
  const el = document.getElementById(elementId);
  if (!el) return;
  if (isLoading) {
    el.setAttribute('data-prev', el.innerHTML);
    el.innerHTML = '<div class="skeleton skeleton-value"></div>';
  } else {
    const prev = el.getAttribute('data-prev');
    if (prev) el.innerHTML = prev;
  }
}

function renderBarChart(container, data, color) {
  if (!container) return;
  color = color || 'bar-fill-accent';
  const entries = Object.entries(data || {}).sort((a, b) => b[1] - a[1]);
  const max = entries.length ? entries[0][1] : 0;

  container.innerHTML = entries.map(([label, value]) => {
    const pct = max > 0 ? (value / max * 100) : 0;
    return `
      <div class="bar-row">
        <span class="bar-label">${escapeHtml(label)}</span>
        <div class="bar-track"><div class="bar-fill ${color}" style="width:${pct}%"></div></div>
        <span class="bar-value">${formatUSD(value)}</span>
      </div>
    `;
  }).join('');
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  disconnectSSE();
  stopAutoRefresh();
});
