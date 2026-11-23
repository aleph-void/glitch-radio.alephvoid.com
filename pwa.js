/*
 * PWA launch handler.
 *
 * When the site is opened from an installed app icon (standalone display mode,
 * or the manifest's start_url `?source=pwa`), hand the user straight off to the
 * Aleph Void YouTube channel — in the native YouTube app where possible.
 * In a normal browser tab this script only registers the service worker.
 *
 * Loaded synchronously in <head> so it can hide the page before it paints.
 */
(function () {
  'use strict';

  var CHANNEL_HANDLE = '@alephvoid-u1e';
  var WEB_URL = 'https://www.youtube.com/' + CHANNEL_HANDLE;
  var ANDROID_URL =
    'intent://www.youtube.com/' + CHANNEL_HANDLE +
    '#Intent;scheme=https;package=com.google.android.youtube;' +
    'S.browser_fallback_url=' + encodeURIComponent(WEB_URL) + ';end';
  var IOS_URL = 'youtube://www.youtube.com/' + CHANNEL_HANDLE;

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/sw.js').catch(function () {});
    });
  }

  var params = new URLSearchParams(window.location.search);
  // `?stay` lets the installed app show the site instead of redirecting.
  if (params.has('stay')) return;

  var standalone =
    params.get('source') === 'pwa' ||
    window.navigator.standalone === true ||
    ['standalone', 'fullscreen', 'minimal-ui'].some(function (mode) {
      return window.matchMedia('(display-mode: ' + mode + ')').matches;
    });
  if (!standalone) return;

  var ua = navigator.userAgent;
  var isAndroid = /Android/i.test(ua);
  var isIOS = /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  // Flag the document so the embeds are skipped and the page stays hidden.
  document.documentElement.classList.add('pwa-launch');

  var style = document.createElement('style');
  style.textContent =
    'html.pwa-launch body > :not(#pwa-launch){display:none!important}' +
    '#pwa-launch{position:fixed;inset:0;display:flex;flex-direction:column;' +
    'align-items:center;justify-content:center;gap:1.25rem;padding:1.5rem;' +
    'text-align:center;background:var(--bg-primary,#0a0a0f);' +
    'color:var(--text-primary,#f4f4f5);font-family:var(--font-body,system-ui,sans-serif)}' +
    '#pwa-launch img{width:112px;height:112px;' +
    'filter:drop-shadow(0 8px 32px rgba(139,92,246,0.35))}' +
    '#pwa-launch p{margin:0;color:var(--text-secondary,#a1a1aa);max-width:22rem;line-height:1.5}' +
    '#pwa-launch a.pwa-open{display:inline-block;padding:0.85rem 1.75rem;border-radius:999px;' +
    'background:var(--accent,#6d28d9);color:#fff;font-weight:600;text-decoration:none}' +
    '#pwa-launch a.pwa-stay{color:var(--text-secondary,#a1a1aa);font-size:0.9rem}';
  document.head.appendChild(style);

  function open() {
    if (isAndroid) {
      window.location.href = ANDROID_URL;
    } else if (isIOS) {
      // youtube:// fails silently if the app isn't installed; fall back to the web.
      var start = Date.now();
      window.location.href = IOS_URL;
      setTimeout(function () {
        if (!document.hidden && Date.now() - start < 2500) window.location.href = WEB_URL;
      }, 1500);
    } else {
      window.location.href = WEB_URL;
    }
  }

  function render() {
    var el = document.createElement('div');
    el.id = 'pwa-launch';
    el.innerHTML =
      '<img src="/assets/icons/icon-512.png" alt="">' +
      '<p>Opening the Aleph Void channel on YouTube&hellip;</p>' +
      '<a class="pwa-open" href="' + WEB_URL + '">Open YouTube</a>' +
      '<a class="pwa-stay" href="/?stay">Stay on this site</a>';
    el.querySelector('.pwa-open').addEventListener('click', function (e) {
      e.preventDefault();
      open();
    });
    document.body.appendChild(el);
  }

  // Show the launch screen first, then try the redirect. If the platform blocks
  // a redirect without a user gesture, the "Open YouTube" button is still there.
  function launch() {
    render();
    setTimeout(open, 50);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', launch);
  } else {
    launch();
  }
})();
