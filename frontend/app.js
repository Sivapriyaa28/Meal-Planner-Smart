/* SmartMeal — app.js  (shared across all pages) */
const API = 'http://localhost:5000/api';

/* ── token helpers ── */
const getToken = () => localStorage.getItem('sm_token');
const getUser  = () => JSON.parse(localStorage.getItem('sm_user') || 'null');

/* ── API wrapper ── */
async function api(path, opts = {}) {
  const token = getToken();
  const res = await fetch(API + path, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: 'Bearer ' + token } : {}),
      ...(opts.headers || {}),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

/* ── auth guard — call on every protected page ── */
async function requireLogin() {
  const token = getToken();
  if (!token) { location.href = 'login.html'; return null; }
  try {
    const data = await api('/auth/me');
    localStorage.setItem('sm_user', JSON.stringify(data.user));
    return data.user;
  } catch {
    localStorage.clear();
    location.href = 'login.html';
    return null;
  }
}

/* ── logout ── */
async function logout() {
  try { await api('/auth/logout', { method: 'POST' }); } catch {}
  localStorage.clear();
  location.href = 'login.html';
}

/* ── inject user badge into navbar ── */
function injectBadge(user) {
  const nav = document.getElementById('navInner');
  if (!nav || document.getElementById('userBadge')) return;
  const initials = ((user.firstName||'')[0]+(user.lastName||'')[0]).toUpperCase();
  const wrap = document.createElement('div');
  wrap.id = 'userBadge';
  wrap.style.cssText = 'display:flex;align-items:center;gap:8px;cursor:pointer;position:relative;';
  wrap.innerHTML = `
    <div style="width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#ea580c,#facc15);color:#fff;font-weight:700;font-size:.82rem;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(234,88,12,.28);">${initials}</div>
    <span style="font-size:.85rem;font-weight:600;color:#44403c;">${user.firstName}</span>
    <div id="uMenu" style="display:none;position:absolute;top:calc(100% + 10px);right:0;background:rgba(255,255,255,.95);backdrop-filter:blur(20px);border:1.5px solid rgba(255,255,255,.85);border-radius:18px;box-shadow:0 8px 32px rgba(234,88,12,.12);padding:8px;min-width:170px;z-index:999;">
      <a href="profile.html" style="display:flex;align-items:center;gap:8px;padding:9px 12px;border-radius:10px;font-size:.86rem;font-weight:600;color:#44403c;text-decoration:none;" onmouseenter="this.style.background='rgba(249,115,22,.06)'" onmouseleave="this.style.background='none'">👤 Profile</a>
      <button onclick="logout()" style="width:100%;text-align:left;background:none;border:none;padding:9px 12px;border-radius:10px;cursor:pointer;font-family:inherit;font-size:.86rem;font-weight:600;color:#ef4444;" onmouseenter="this.style.background='#fef2f2'" onmouseleave="this.style.background='none'">🚪 Sign out</button>
    </div>`;
  wrap.addEventListener('click', e => {
    e.stopPropagation();
    const m = document.getElementById('uMenu');
    m.style.display = m.style.display === 'none' ? 'block' : 'none';
  });
  document.addEventListener('click', () => { const m = document.getElementById('uMenu'); if(m) m.style.display='none'; });
  nav.appendChild(wrap);
}

/* ── toast ── */
function toast(msg, dur = 2500) {
  let el = document.getElementById('toast');
  if (!el) { el = document.createElement('div'); el.id = 'toast'; el.className = 'toast'; document.body.appendChild(el); }
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), dur);
}

/* ── navbar scroll shadow ── */
window.addEventListener('scroll', () => {
  document.querySelector('.navbar')?.classList.toggle('scrolled', scrollY > 20);
});

/* ── active nav ── */
function setActiveNav() {
  const page = location.pathname.split('/').pop() || '';
  document.querySelectorAll('.nav-link').forEach(l => l.classList.toggle('active', l.getAttribute('href') === page));
  document.querySelectorAll('.bnav-item').forEach(b => b.classList.toggle('active', b.dataset.page === page));
}
document.addEventListener('DOMContentLoaded', setActiveNav);

/* ── date helper ── */
const today = () => new Date().toISOString().split('T')[0];