/* ══════════════════════════════════════════════════════════
   Route guard for protected pages (e.g. dashboard.html)
   ──────────────────────────────────────────────────────────
   · Already logged in  → allow
   · ?demo=1           → seed a demo session and allow
   · otherwise         → redirect to the auth screen
   ══════════════════════════════════════════════════════════ */
(function () {
  if (!window.API) return;
  if (API.hasSession()) return;

  const params = new URLSearchParams(location.search);
  if (params.get('demo') === '1') {
    API.loginDemo();
    history.replaceState(null, '', location.pathname);
    return;
  }

  location.replace('auth.html');
})();