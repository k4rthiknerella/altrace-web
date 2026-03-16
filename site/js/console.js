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
    <div class="sidebar-section-label">Command</div>
    <a href="/dashboard.html" class="sidebar-link" data-page="dashboard">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
      Dashboard
    </a>
    <a href="/kill-switches.html" class="sidebar-link" data-page="kill-switches">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
      Kill Switches
    </a>
    <a href="/approvals.html" class="sidebar-link" data-page="approvals">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
      Approvals
      <span class="nav-badge" id="nav-approval-count" style="display:none"></span>
    </a>
    <div class="sidebar-section-label">Observe</div>
    <a href="/fleet.html" class="sidebar-link" data-page="fleet">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
      Fleet
    </a>
    <a href="/cost.html" class="sidebar-link" data-page="cost">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
      Cost & Budget
    </a>
    <a href="/audit.html" class="sidebar-link" data-page="audit">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
      Audit Log
    </a>
    <a href="/metrics.html" class="sidebar-link" data-page="metrics">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>
      Metrics
    </a>
    <div class="sidebar-section-label">Govern</div>
    <a href="/policies.html" class="sidebar-link" data-page="policies">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
      Policies
    </a>
    <a href="/virtualkeys.html" class="sidebar-link" data-page="virtualkeys">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
      Credentials
    </a>
    <a href="#" class="sidebar-link" data-page="teams">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
      Teams & RBAC
    </a>
    <div class="sidebar-section-label">Comply</div>
    <a href="/compliance.html" class="sidebar-link" data-page="compliance">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
      Compliance
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
  if (orgEl) {
    orgEl.textContent = session.org || '';
    // Show DEMO badge when in demo mode
    if (sessionStorage.getItem('altrace_demo') === 'true') {
      const badge = document.createElement('span');
      badge.textContent = 'DEMO';
      badge.style.cssText = 'display:inline-block;margin-left:8px;padding:1px 6px;font-size:0.65rem;font-weight:600;letter-spacing:0.05em;background:var(--accent);color:#fff;border-radius:3px;vertical-align:middle;';
      orgEl.appendChild(badge);
    }
  }
  const roleEl = document.getElementById('sidebar-role');
  if (roleEl) roleEl.textContent = session.role || 'viewer';

  // Apply dark mode from localStorage
  if (localStorage.getItem('altrace_dark_mode') === '1') {
    document.body.classList.add('dark');
    const toggle = document.getElementById('dark-mode-toggle');
    if (toggle) toggle.textContent = '\u2600';
  }

  // Inject Cmd+K hint into topbar (before SSE status)
  const sseStatus = document.getElementById('sse-status');
  if (sseStatus) {
    const cmdkHint = document.createElement('button');
    cmdkHint.className = 'topbar-cmdk';
    cmdkHint.onclick = openCommandPalette;
    cmdkHint.title = 'Command palette';
    const isMac = navigator.platform.indexOf('Mac') > -1;
    const k1 = document.createElement('kbd');
    k1.textContent = isMac ? '\u2318' : 'Ctrl';
    const k2 = document.createElement('kbd');
    k2.textContent = 'K';
    cmdkHint.appendChild(k1);
    cmdkHint.appendChild(k2);
    sseStatus.parentNode.insertBefore(cmdkHint, sseStatus);
  }

  // Mobile sidebar toggle
  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  overlay.addEventListener('click', () => toggleSidebar(false));
  document.body.appendChild(overlay);

  // Fetch approval badge count
  updateApprovalBadge();

  // Initialize command palette keyboard listener
  initCommandPalette();

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
  if (toggle) toggle.textContent = isDark ? '\u2600' : '\u263E';
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
  // In demo mode, skip real SSE and show connected status
  if (typeof isDemo === 'function' && isDemo()) {
    const el = document.getElementById('sse-status');
    if (el) {
      el.textContent = 'Demo';
      el.classList.add('connected');
    }
    return;
  }

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

// ── Approval badge ────────────────────────────────────────

async function updateApprovalBadge() {
  try {
    const resp = await authFetch('/api/v1/approvals');
    if (!resp.ok) return;
    const data = await resp.json();
    const pending = (data.approvals || data || []).filter(function(a) {
      return a.status === 'pending';
    });
    const badge = document.getElementById('nav-approval-count');
    if (!badge) return;
    if (pending.length > 0) {
      badge.textContent = pending.length > 99 ? '99+' : String(pending.length);
      badge.style.display = '';
    } else {
      badge.style.display = 'none';
    }
  } catch (e) {
    // Silently ignore — badge is non-critical
  }
}

// ── Command Palette ──────────────────────────────────────

const PALETTE_ITEMS = [
  { name: 'Dashboard', url: '/dashboard.html', section: 'Pages', icon: 'grid' },
  { name: 'Kill Switches', url: '/kill-switches.html', section: 'Pages', icon: 'zap' },
  { name: 'Approvals', url: '/approvals.html', section: 'Pages', icon: 'check' },
  { name: 'Fleet', url: '/fleet.html', section: 'Pages', icon: 'monitor' },
  { name: 'Cost & Budget', url: '/cost.html', section: 'Pages', icon: 'dollar' },
  { name: 'Audit Log', url: '/audit.html', section: 'Pages', icon: 'file' },
  { name: 'Metrics', url: '/metrics.html', section: 'Pages', icon: 'chart' },
  { name: 'Policies', url: '/policies.html', section: 'Pages', icon: 'shield' },
  { name: 'Credentials', url: '/virtualkeys.html', section: 'Pages', icon: 'key' },
  { name: 'Compliance', url: '/compliance.html', section: 'Pages', icon: 'check-square' },
  { name: 'Documentation', url: '/console-docs.html', section: 'Pages', icon: 'book' },
  { name: 'Activate Global Kill Switch', action: function() { window.location.href = '/kill-switches.html'; }, section: 'Actions', icon: 'zap' },
  { name: 'Issue Virtual Key', action: function() { window.location.href = '/virtualkeys.html'; }, section: 'Actions', icon: 'key' },
  { name: 'Deploy Policy', action: function() { window.location.href = '/policies.html'; }, section: 'Actions', icon: 'shield' },
  { name: 'Toggle Dark Mode', action: function() { toggleDarkMode(); }, section: 'Actions', icon: 'moon' },
  { name: 'Sign Out', action: function() { clearSession(); }, section: 'Actions', icon: 'logout' },
];

let _paletteOverlay = null;
let _paletteSelectedIdx = -1;
let _paletteResults = [];

function _getRecentPages() {
  try {
    return JSON.parse(localStorage.getItem('altrace_recent_pages') || '[]');
  } catch (e) {
    return [];
  }
}

function _addRecentPage(name) {
  var recent = _getRecentPages().filter(function(r) { return r !== name; });
  recent.unshift(name);
  if (recent.length > 5) recent = recent.slice(0, 5);
  try {
    localStorage.setItem('altrace_recent_pages', JSON.stringify(recent));
  } catch (e) {
    // localStorage full or unavailable
  }
}

function _fuzzyMatch(query, text) {
  return text.toLowerCase().indexOf(query.toLowerCase()) > -1;
}

function _buildPaletteResults(query) {
  var results = [];
  var recent = _getRecentPages();

  // If no query, show recent pages first
  if (!query) {
    var recentItems = [];
    recent.forEach(function(name) {
      var item = PALETTE_ITEMS.find(function(p) { return p.name === name; });
      if (item) recentItems.push({ item: item, section: 'Recent' });
    });
    if (recentItems.length > 0) {
      results = results.concat(recentItems);
    }
    // Then show all pages and actions
    PALETTE_ITEMS.forEach(function(item) {
      var alreadyRecent = recent.indexOf(item.name) > -1;
      if (!alreadyRecent) {
        results.push({ item: item, section: item.section });
      }
    });
  } else {
    PALETTE_ITEMS.forEach(function(item) {
      if (_fuzzyMatch(query, item.name)) {
        results.push({ item: item, section: item.section });
      }
    });
  }

  return results;
}

function _renderPaletteResults(listEl, results) {
  listEl.textContent = '';
  _paletteResults = results;
  _paletteSelectedIdx = results.length > 0 ? 0 : -1;

  if (results.length === 0) {
    var empty = document.createElement('div');
    empty.className = 'cmdk-empty';
    empty.textContent = 'No results found';
    listEl.appendChild(empty);
    return;
  }

  var lastSection = '';
  results.forEach(function(r, idx) {
    if (r.section !== lastSection) {
      lastSection = r.section;
      var header = document.createElement('div');
      header.className = 'cmdk-section-label';
      header.textContent = r.section;
      listEl.appendChild(header);
    }

    var row = document.createElement('div');
    row.className = 'cmdk-item' + (idx === _paletteSelectedIdx ? ' cmdk-item-active' : '');
    row.setAttribute('data-idx', String(idx));

    var label = document.createElement('span');
    label.className = 'cmdk-item-label';
    label.textContent = r.item.name;
    row.appendChild(label);

    if (r.item.url) {
      var hint = document.createElement('span');
      hint.className = 'cmdk-item-hint';
      hint.textContent = r.item.url;
      row.appendChild(hint);
    }

    row.addEventListener('click', function() {
      _selectPaletteItem(idx);
    });
    row.addEventListener('mouseenter', function() {
      _paletteSelectedIdx = idx;
      _highlightPaletteItem(listEl);
    });

    listEl.appendChild(row);
  });
}

function _highlightPaletteItem(listEl) {
  var items = listEl.querySelectorAll('.cmdk-item');
  items.forEach(function(el, i) {
    el.classList.toggle('cmdk-item-active', parseInt(el.getAttribute('data-idx')) === _paletteSelectedIdx);
  });
  // Scroll active item into view
  var active = listEl.querySelector('.cmdk-item-active');
  if (active) active.scrollIntoView({ block: 'nearest' });
}

function _selectPaletteItem(idx) {
  if (idx < 0 || idx >= _paletteResults.length) return;
  var r = _paletteResults[idx];
  _addRecentPage(r.item.name);
  closeCommandPalette();
  if (r.item.url) {
    window.location.href = r.item.url;
  } else if (r.item.action) {
    r.item.action();
  }
}

function openCommandPalette() {
  if (_paletteOverlay) return; // Already open

  var overlay = document.createElement('div');
  overlay.className = 'cmdk-overlay';
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) closeCommandPalette();
  });

  var dialog = document.createElement('div');
  dialog.className = 'cmdk-dialog';

  var inputWrap = document.createElement('div');
  inputWrap.className = 'cmdk-input-wrap';

  var searchIcon = document.createElement('span');
  searchIcon.className = 'cmdk-search-icon';
  searchIcon.textContent = '\u2315'; // search symbol
  inputWrap.appendChild(searchIcon);

  var input = document.createElement('input');
  input.className = 'cmdk-input';
  input.type = 'text';
  input.placeholder = 'Search pages and actions...';
  input.setAttribute('autocomplete', 'off');
  input.setAttribute('spellcheck', 'false');
  inputWrap.appendChild(input);

  dialog.appendChild(inputWrap);

  var list = document.createElement('div');
  list.className = 'cmdk-list';
  dialog.appendChild(list);

  overlay.appendChild(dialog);
  document.body.appendChild(overlay);
  _paletteOverlay = overlay;

  // Initial render (no query — show recent + all)
  var results = _buildPaletteResults('');
  _renderPaletteResults(list, results);

  input.focus();

  input.addEventListener('input', function() {
    var q = input.value.trim();
    var filtered = _buildPaletteResults(q);
    _renderPaletteResults(list, filtered);
  });

  input.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeCommandPalette();
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (_paletteResults.length > 0) {
        _paletteSelectedIdx = (_paletteSelectedIdx + 1) % _paletteResults.length;
        _highlightPaletteItem(list);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (_paletteResults.length > 0) {
        _paletteSelectedIdx = (_paletteSelectedIdx - 1 + _paletteResults.length) % _paletteResults.length;
        _highlightPaletteItem(list);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      _selectPaletteItem(_paletteSelectedIdx);
    }
  });
}

function closeCommandPalette() {
  if (_paletteOverlay) {
    _paletteOverlay.remove();
    _paletteOverlay = null;
    _paletteSelectedIdx = -1;
    _paletteResults = [];
  }
}

function initCommandPalette() {
  document.addEventListener('keydown', function(e) {
    var isMod = navigator.platform.indexOf('Mac') > -1 ? e.metaKey : e.ctrlKey;
    if (isMod && e.key === 'k') {
      e.preventDefault();
      if (_paletteOverlay) {
        closeCommandPalette();
      } else {
        openCommandPalette();
      }
    }
  });
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  disconnectSSE();
  stopAutoRefresh();
});
