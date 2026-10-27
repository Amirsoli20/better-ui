#!/usr/bin/env node
// Render a page at the six check sizes, screenshot every section, and measure layout facts.
// Needs Playwright:  npm i -D playwright && npx playwright install chromium
// Usage: node shoot.mjs <url> [--out shots] [--reduced] [--sizes 1440x900,390x844] [--chrome /path/to/chrome]
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2);
const url = args.find((a) => !a.startsWith('--'));
if (!url) { console.error('usage: node shoot.mjs <url> [--out dir] [--reduced] [--sizes WxH,...]'); process.exit(2); }
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const out = opt('--out', 'shots');
const reduced = args.includes('--reduced');
const SIZES = (opt('--sizes', '1440x900,1920x1080,1366x768,1280x720,820x1180,390x844'))
  .split(',').map((s) => { const [w, h] = s.split('x').map(Number); return { w, h }; });

let chromium;
try { ({ chromium } = await import('playwright')); }
catch { console.error('Playwright is not installed: npm i -D playwright && npx playwright install chromium'); process.exit(2); }

const browser = await chromium.launch(opt('--chrome') ? { executablePath: opt('--chrome') } : {});
const report = { url, reduced, sizes: [] };

for (const { w, h } of SIZES) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, reducedMotion: reduced ? 'reduce' : 'no-preference' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts && document.fonts.ready);
  const dir = join(out, `${w}x${h}${reduced ? '-reduced' : ''}`);
  mkdirSync(dir, { recursive: true });
  await page.screenshot({ path: join(dir, 'full.png'), fullPage: true });

  const facts = await page.evaluate(() => {
    const vh = innerHeight;
    let secs = [...document.querySelectorAll('[data-section]')];
    if (!secs.length) secs = [...document.querySelectorAll('main > section, body > section')];
    const docTop = (el) => el.getBoundingClientRect().top + scrollY;
    // smallest visible text
    let minFont = Infinity, minFontText = '';
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n; (n = walker.nextNode());) {
      const t = n.textContent.trim(); if (!t) continue;
      const el = n.parentElement; const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none' || el.closest('[aria-hidden="true"]')) continue;
      const fs = parseFloat(cs.fontSize); if (fs < minFont) { minFont = fs; minFontText = t.slice(0, 40); }
    }
    // text clipped by an overflow-hidden/clip ancestor
    const clipped = [];
    document.querySelectorAll('h1,h2,h3,p,li,a,button').forEach((el) => {
      const r = el.getBoundingClientRect(); if (!r.width) return;
      for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
        const o = getComputedStyle(a).overflow; if (!/hidden|clip/.test(o)) continue;
        const ar = a.getBoundingClientRect();
        if (r.bottom > ar.bottom + 1 || r.right > ar.right + 1) { clipped.push(el.tagName + ': ' + el.textContent.trim().slice(0, 40)); }
        break;
      }
    });
    // text placed on images, for the contrast check
    const onImage = [...document.querySelectorAll('[data-on-image]')].map((el) => {
      const r = el.getBoundingClientRect();
      return { text: el.textContent.trim().slice(0, 40), color: getComputedStyle(el).color, fontSize: parseFloat(getComputedStyle(el).fontSize),
        fontWeight: getComputedStyle(el).fontWeight, docX: r.left + scrollX, docY: r.top + scrollY, w: r.width, h: r.height };
    });
    const sections = secs.map((s, i) => {
      const top = docTop(s), height = s.getBoundingClientRect().height;
      const next = secs[i + 1];
      const peekPx = s.hasAttribute('data-peek') && next ? Math.max(0, vh - (docTop(next) - top)) : null;
      return { i, id: s.id || null, top, height, screens: +(height / vh).toFixed(2), peek: s.hasAttribute('data-peek'),
        peekPct: peekPx == null ? null : +(peekPx / vh * 100).toFixed(1) };
    });
    return { vh, vw: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth,
      horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      minFont, minFontText, clipped: clipped.slice(0, 20), onImage, sections };
  });

  if (facts.onImage.length) {   // the same page with on-image text hidden, so contrast is measured on the pixels behind it
    await page.addStyleTag({ content: '[data-on-image]{visibility:hidden !important}' });
    await page.screenshot({ path: join(dir, 'full-notext.png'), fullPage: true });
    await page.reload({ waitUntil: 'networkidle' });
  }
  for (const s of facts.sections) {
    await page.evaluate((y) => window.scrollTo(0, y), s.top);
    await page.waitForTimeout(450);
    await page.screenshot({ path: join(dir, `section-${String(s.i).padStart(2, '0')}.png`) });
  }
  report.sizes.push({ size: `${w}x${h}`, dir, errors, ...facts });
  await ctx.close();
}
await browser.close();
mkdirSync(out, { recursive: true });
writeFileSync(join(out, `report${reduced ? '-reduced' : ''}.json`), JSON.stringify(report, null, 2));

// Summary
for (const s of report.sizes) {
  const flags = [];
  if (s.horizontalOverflow) flags.push(`HORIZONTAL SCROLL (${s.scrollWidth} > ${s.vw})`);
  if (s.minFont < 12) flags.push(`text under 12px: ${s.minFont}px "${s.minFontText}"`);
  if (s.clipped.length) flags.push(`clipped text: ${s.clipped.length} (${s.clipped[0]})`);
  if (s.errors.length) flags.push(`console errors: ${s.errors.length}`);
  for (const sec of s.sections) {
    if (sec.peek && (sec.peekPct < 8 || sec.peekPct > 15)) flags.push(`section ${sec.i} peek ${sec.peekPct}% (target 8-15%)`);
    if (!sec.peek && sec.screens < 0.98 && sec.screens > 0.4) flags.push(`section ${sec.i} is ${sec.screens} screens: full-screen or deliberately short?`);
  }
  console.log(`${s.size}: ${s.sections.length} sections  ${flags.length ? '\n  - ' + flags.join('\n  - ') : 'no flags'}`);
}
console.log(`\nScreenshots and report in ${out}/. Now LOOK at every section screenshot.`);
