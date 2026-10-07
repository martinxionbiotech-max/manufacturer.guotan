#!/usr/bin/env node
/* ------------------------------------------------------------------ */
/* check-links.mjs — internal link integrity check against dist/.      */
/* Walks every built .html file, extracts href/src targets, resolves  */
/* same-origin and relative links, and reports any target that does   */
/* not exist in dist/. Exits non-zero on broken links.                */
/* ------------------------------------------------------------------ */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, resolve, dirname, extname } from 'node:path';

const DIST = join(process.cwd(), 'dist');
if (!existsSync(DIST)) {
  console.error('dist/ not found — run `npm run build` first.');
  process.exit(1);
}

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (extname(p) === '.html') out.push(p);
  }
  return out;
}

const files = walk(DIST);
const fileSet = new Set(files.map((f) => resolve(f)));

const HREF = /(?:href|src)=["']([^"']+)["']/g;
const broken = [];
let totalLinks = 0;

for (const file of files) {
  const html = readFileSync(file, 'utf8');
  let m;
  HREF.lastIndex = 0;
  while ((m = HREF.exec(html)) !== null) {
    const raw = m[1].trim();
    if (!raw) continue;
    if (raw.startsWith('#') || raw.startsWith('mailto:') || raw.startsWith('tel:')) continue;
    if (/^(https?:)?\/\//.test(raw)) continue; // external / cross-site: not checked here
    if (raw.startsWith('data:')) continue;
    totalLinks++;
    // strip query + hash
    const clean = raw.split(/[?#]/)[0];
    if (!clean) continue;
    const isDir = clean.endsWith('/') || extname(clean) === '';
    const base = resolve(dirname(file));
    let target = clean.startsWith('/')
      ? resolve(DIST, clean.replace(/^\//, ''))
      : resolve(base, clean);
    if (isDir) {
      target = resolve(target, 'index.html');
    } else if (extname(target) === '') {
      target = resolve(target, 'index.html');
    }
    if (!existsSync(target)) {
      broken.push({ page: file.replace(DIST + '/', ''), link: raw });
    }
  }
}

console.log(`Checked ${files.length} pages, ${totalLinks} internal links.`);
if (broken.length) {
  console.error(`\n${broken.length} broken internal link(s):`);
  for (const b of broken) console.error(`  ${b.page} -> ${b.link}`);
  process.exit(1);
}
console.log('No broken internal links. ✔');
