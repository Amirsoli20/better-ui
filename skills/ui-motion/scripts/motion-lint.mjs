#!/usr/bin/env node
// Motion lint: flags common motion mistakes found by pattern matching. Findings are hints; review each one.
// Usage: node motion-lint.mjs <file-or-folder> [...]
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname, basename } from 'node:path';

const EXT = new Set(['.css', '.scss', '.js', '.mjs', '.ts', '.tsx', '.jsx', '.html', '.vue', '.svelte', '.astro']);
const SKIP = new Set(['node_modules', '.git', 'dist', 'build', '.next', '.nuxt']);
const SELF = new Set(['motion-lint.mjs']);

// [severity, id, regex, message], applied per line
const LINE_RULES = [
  ['error', 'transition-all', /transition(-property)?\s*:\s*all\b/, 'name the exact properties; never `transition: all`'],
  ['error', 'layout-transition', /transition(-property)?\s*:[^;]*\b(width|height|top|left|right|bottom|margin|padding)\b/, 'animating a layout property; use transform/opacity/clip-path (grid-template-rows for accordions)'],
  ['error', 'ease-in', /(transition|animation)[^;{]*\bease-in\b(?!-out)/, '`ease-in` makes arrivals feel slow; use a strong ease-out (ease-in only for short exits)'],
  ['error', 'overshoot-ease', /\b(bounce|elastic)\.(in|out|inOut)\b|\bback\.(in|out|inOut)\b|CustomBounce|CustomWiggle/, 'bounce/elastic/back easing is banned on UI (declared playful moments only)'],
  ['error', 'devtools', /GSDevTools/, 'never ship animation dev tools'],
  ['error', 'markers', /markers\s*:\s*true/, 'ScrollTrigger markers must be off in production'],
  ['error', 'scrub-and-toggle', /scrub[^}\n]*toggleActions|toggleActions[^}\n]*scrub/, 'scrub and toggleActions are alternatives; use one'],
  ['error', 'snap-mandatory', /scroll-snap-type\s*:\s*[xy]?\s*mandatory|scroll-snap-type\s*:\s*both\s+mandatory/, 'no hard snap: use proximity plus the soft magnet'],
  ['warn', 'scale-zero', /scale\(\s*0\s*\)/, 'never animate from scale(0); start at 0.95-0.98 with opacity'],
  ['warn', 'autoalpha', /\bautoAlpha\b/, 'autoAlpha sets visibility:hidden; do not use it to hide focusable content until a scroll reveal'],
  ['warn', 'will-change', /will-change\s*:(?!\s*auto)/, 'will-change only on the one element about to animate, removed after'],
  ['warn', 'gsap-layout-prop', /gsap\.(to|from|fromTo|set)\([^)]*\b(width|height|top|left|margin|padding)\s*:/, 'GSAP tween on a layout property; use transform aliases'],
  ['warn', 'text-scramble', /ScrambleText|TextPlugin/, 'scramble/typewriter text: rare only, the label must stay readable'],
  ['warn', 'scroll-library', /ScrollSmoother|new\s+Lenis|Lenis\(|locomotive-scroll/i, 'scrolling library: do not combine with the eased wheel; keep the real window scroll'],
  ['warn', 'cursor-none', /cursor\s*:\s*none/, 'custom cursor: rare only; keep the system cursor on text and inputs'],
  ['warn', 'vh-height', /(min-)?height\s*:\s*100vh/, 'use svh or dvh, not vh, for screen-height sections'],
  ['warn', 'power-in', /["']power[1-4]\.in["']|["'](expo|circ|sine)\.in["']/, 'ease-in curve: legal only for short exits'],
  ['info', 'raw-duration', /(transition|animation)[^;{]*\b\d+(\.\d+)?m?s\b(?![^;{]*var\()/, 'raw duration; prefer a motion token (var(--dur-*))'],
];

// [severity, id, test(text) -> bool, message], applied per file
const FILE_RULES = [
  ['warn', 'hidden-start-ungated', (t) => /opacity\s*:\s*0\s*[;}]/.test(t) && !/\.js\b/.test(t) && !/no-preference/.test(t), 'opacity:0 start state without a `.js` or `no-preference` gate: content may stay hidden'],
  ['warn', 'infinite-no-reduced', (t) => /\binfinite\b|repeat\s*:\s*-1/.test(t) && !/prefers-reduced-motion|matchMedia/.test(t), 'looping animation with no reduced-motion handling in this file'],
  ['warn', 'smooth-no-reduced', (t) => /scroll-behavior\s*:\s*smooth/.test(t) && !/prefers-reduced-motion/.test(t), 'scroll-behavior: smooth without a reduced-motion rule'],
  ['warn', 'gsap-no-matchmedia', (t) => /gsap\.(to|from|fromTo|timeline)\(/.test(t) && !/matchMedia|prefers-reduced-motion/.test(t), 'GSAP used with no matchMedia / reduced-motion handling in this file'],
  ['warn', 'hover-no-media', (t) => /:hover\s*{[^}]*transform/.test(t) && !/hover\s*:\s*hover/.test(t), 'transform on :hover without an (hover: hover) media query'],
];

function walk(p, out) {
  const s = statSync(p);
  if (s.isDirectory()) { for (const f of readdirSync(p)) if (!SKIP.has(f)) walk(join(p, f), out); }
  else if (EXT.has(extname(p)) && !SELF.has(basename(p))) out.push(p);
  return out;
}

const targets = process.argv.slice(2);
if (!targets.length) { console.error('usage: node motion-lint.mjs <file-or-folder> [...]'); process.exit(2); }
const files = targets.flatMap((t) => walk(t, []));
const counts = { error: 0, warn: 0, info: 0 };
let defaultsSeen = false, gsapSeen = false;

for (const f of files) {
  const text = readFileSync(f, 'utf8');
  if (/gsap\.defaults\(/.test(text)) defaultsSeen = true;
  if (/gsap\.(to|from|fromTo|timeline)\(/.test(text)) gsapSeen = true;
  text.split('\n').forEach((line, i) => {
    for (const [sev, id, re, msg] of LINE_RULES) {
      if (re.test(line)) { counts[sev]++; console.log(`${f}:${i + 1}  ${sev.toUpperCase()}  ${id}: ${msg}`); }
    }
  });
  for (const [sev, id, test, msg] of FILE_RULES) {
    if (test(text)) { counts[sev]++; console.log(`${f}  ${sev.toUpperCase()}  ${id}: ${msg}`); }
  }
}
if (gsapSeen && !defaultsSeen) { counts.warn++; console.log('(project)  WARN  gsap-defaults: GSAP used but gsap.defaults() never set (library default 0.5s / power1.out)'); }
console.log(`\n${files.length} files, ${counts.error} errors, ${counts.warn} warnings, ${counts.info} info`);
process.exit(counts.error ? 1 : 0);
