// Static self-test for AI Zero → Hero. No deps. Run: node test.mjs
// Catches the bug classes we've actually hit:
//   1. runtime/template-literal errors in app.js at init (e.g. stray ${ident})
//   2. syntax errors in the legacy course's inline script
//   3. a <script src>/<link href>/SW-critical/manifest-icon pointing at a missing file
//   4. malformed manifest JSON
import { readFileSync, existsSync } from 'node:fs';
import vm from 'node:vm';

const fail = [];
const ok = (m) => console.log('  ok  ' + m);
const bad = (m) => { fail.push(m); console.log('  FAIL ' + m); };
let appCtx = null;

// ---- 1. Execute app.js top-to-bottom with stubbed browser globals ----
console.log('app.js full init:');
try {
  const code = readFileSync(new URL('./app.js', import.meta.url), 'utf8');
  const ctx2d = new Proxy({}, { get: (t, p) => {
    if (p === 'canvas') return { width: 300, height: 150, clientWidth: 300, clientHeight: 150 };
    if (p === 'createLinearGradient' || p === 'createRadialGradient') return () => ({ addColorStop() {} });
    return () => {};
  }});
  const elem = () => new Proxy({
    style: {}, dataset: {}, classList: { add() {}, remove() {}, toggle() { return false; }, contains() { return false; } },
    getContext: () => ctx2d, addEventListener() {}, removeEventListener() {}, appendChild() {}, setAttribute() {},
    removeAttribute() {}, querySelector: () => elem(), querySelectorAll: () => [], scrollIntoView() {}, focus() {},
    getBoundingClientRect: () => ({ top: 0, left: 0, bottom: 0, right: 0, width: 300, height: 150 }),
    value: '', textContent: '', innerHTML: '', clientWidth: 300, clientHeight: 150, offsetHeight: 150,
    width: 300, height: 150, parentElement: null, parentNode: { replaceChild() {} },
  }, { get(t, p) { return p in t ? t[p] : undefined; } });
  const doc = {
    getElementById: () => elem(), querySelector: () => elem(), querySelectorAll: () => [], addEventListener() {},
    createElement: () => elem(), createDocumentFragment: () => elem(),
    createTreeWalker: () => ({ nextNode: () => null, currentNode: null }),
    body: elem(), documentElement: elem(), title: '', activeElement: elem(),
  };
  const stub = new Proxy(function () {}, { get: () => stub, apply: () => stub, construct: () => stub });
  const ctx = {
    document: doc, console, innerWidth: 1280, innerHeight: 800, devicePixelRatio: 1,
    addEventListener() {}, removeEventListener() {}, dispatchEvent() {}, scrollTo() {}, scrollY: 0,
    localStorage: { getItem: () => null, setItem() {}, removeItem() {}, key: () => null, length: 0 },
    sessionStorage: { getItem: () => null, setItem() {}, removeItem() {} },
    IntersectionObserver: function () { return { observe() {}, unobserve() {}, disconnect() {} }; },
    URLSearchParams: function () { return { get: () => null }; },
    requestAnimationFrame: () => 0, setTimeout: () => 0, setInterval: () => 0, clearTimeout() {},
    AbortController: function () { this.signal = { addEventListener() {} }; this.abort = () => {}; },
    performance: { now: () => 0 },
    navigator: { serviceWorker: { register: () => ({ catch() {} }) }, clipboard: { writeText: () => ({ then() {} }) } },
    location: { search: '', protocol: 'https:', href: '', reload() {} },
    matchMedia: () => ({ matches: false, addEventListener() {} }),
    fetch: () => ({ then: () => ({ catch() {} }) }),
    AudioContext: stub, webkitAudioContext: stub, Event: function () {},
    Float32Array, Math, Date, JSON, Object, Array, String, Number, RegExp, parseInt, parseFloat, isFinite, Blob: stub, FileReader: stub, Proxy, Map, Set, Promise, isNaN,
  };
  ctx.window = ctx;
  vm.createContext(ctx);
  vm.runInContext(code, ctx, { filename: 'app.js' });
  appCtx = ctx;
  ok('runs to completion, no runtime/template errors');
} catch (e) {
  bad(`app.js threw at init: ${e.constructor.name} - ${e.message}`);
}

// ---- 1b. transactionalRestore: rollback leaves prior progress intact ----
console.log('progress import is transactional:');
if (appCtx && typeof appCtx.transactionalRestore === 'function') {
  // Fake store that throws on the 3rd setItem (simulates QuotaExceededError mid-import)
  const data = { aizh_progress_v1: 'OLD', aizh_fc_v1: 'OLDFC' };
  let order = [];
  const store = {
    _d: { ...data },
    get length() { return Object.keys(this._d).length; },
    key(i) { return Object.keys(this._d)[i] ?? null; },
    getItem(k) { return k in this._d ? this._d[k] : null; },
    setItem(k, v) { order.push(k); if (order.length === 3) throw new Error('QuotaExceededError'); this._d[k] = v; },
    removeItem(k) { delete this._d[k]; },
  };
  const entries = [['aizh_progress_v1','NEW'],['aizh_activity_v1','NEWACT'],['aizh_fc_v1','NEWFC']];
  const res = appCtx.transactionalRestore(entries, store);
  const intact = res.ok === false
    && store._d.aizh_progress_v1 === 'OLD'   // rolled back
    && store._d.aizh_fc_v1 === 'OLDFC'       // rolled back
    && !('aizh_activity_v1' in store._d);     // new key removed, not left partial
  intact ? ok('quota error mid-import rolls back fully (no partial state)')
         : bad('transactionalRestore left partial/mixed state: ' + JSON.stringify(store._d));
  // happy path
  const store2 = { _d: {}, get length(){return Object.keys(this._d).length;}, key(i){return Object.keys(this._d)[i]??null;}, getItem(k){return this._d[k]??null;}, setItem(k,v){this._d[k]=v;}, removeItem(k){delete this._d[k];} };
  const r2 = appCtx.transactionalRestore([['aizh_x','1'],['aizh_y','2']], store2);
  (r2.ok && store2._d.aizh_x === '1' && store2._d.aizh_y === '2') ? ok('clean restore writes all keys') : bad('clean restore failed');
} else {
  bad('transactionalRestore not exported from app.js');
}

// ---- 2. Legacy inline script parses ----
console.log('ai_master_course.html inline script:');
try {
  const h = readFileSync(new URL('./ai_master_course.html', import.meta.url), 'utf8');
  const scripts = h.match(/<script[^>]*>([\s\S]*?)<\/script>/g) || [];
  scripts.forEach((s) => new Function(s.replace(/<\/?script[^>]*>/g, '')));
  ok(`${scripts.length} inline script block(s) parse`);
} catch (e) {
  bad(`legacy script parse error: ${e.message}`);
}

// ---- 3. Referenced local assets exist ----
console.log('referenced assets exist:');
const index = readFileSync(new URL('./index.html', import.meta.url), 'utf8');
const refs = [...index.matchAll(/(?:src|href)="([^":?#]+\.(?:js|css|png|webmanifest))"/g)].map(m => m[1]);
[...new Set(refs)].forEach((r) => {
  existsSync(new URL('./' + r, import.meta.url)) ? ok(r) : bad(`missing referenced asset: ${r}`);
});

// ---- 4. Service-worker critical assets exist ----
console.log('service-worker CRITICAL assets exist:');
const sw = readFileSync(new URL('./sw.js', import.meta.url), 'utf8');
const critBlock = (sw.match(/const CRITICAL = \[([\s\S]*?)\];/) || [, ''])[1];
[...critBlock.matchAll(/'\.\/([^']*)'/g)].map(m => m[1]).filter(Boolean).forEach((f) => {
  existsSync(new URL('./' + f, import.meta.url)) ? ok('SW ' + (f || './')) : bad(`SW critical asset missing: ${f}`);
});

// ---- 5. Manifest is valid JSON + icons exist ----
console.log('manifest:');
try {
  const man = JSON.parse(readFileSync(new URL('./manifest.webmanifest', import.meta.url), 'utf8'));
  ok('valid JSON');
  (man.icons || []).forEach((ic) => {
    existsSync(new URL('./' + ic.src, import.meta.url)) ? ok('icon ' + ic.src) : bad(`manifest icon missing: ${ic.src}`);
  });
} catch (e) {
  bad(`manifest invalid: ${e.message}`);
}

console.log('');
if (fail.length) { console.error(`✗ ${fail.length} failure(s)`); process.exit(1); }
console.log('✓ all checks passed');
