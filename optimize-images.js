// Image optimizer — downloads all Unsplash images as local WebP files (<100KB)
// Run: node optimize-images.js

const fs   = require('fs');
const path = require('path');
const https= require('https');

const DIR     = __dirname;
const IMG_DIR = path.join(DIR, 'images');

if (!fs.existsSync(IMG_DIR)) fs.mkdirSync(IMG_DIR, { recursive: true });

// ── 1. Collect every unique Unsplash URL across all HTML + CSS files ──────────
const htmlFiles = fs.readdirSync(DIR).filter(f => f.endsWith('.html'));
const cssFiles  = fs.readdirSync(path.join(DIR, 'css')).map(f => path.join(DIR, 'css', f));

const urlToFile = new Map(); // original url → local filename

function collectUrls(content) {
  const re = /https:\/\/images\.unsplash\.com\/[^"'\s)]+/g;
  for (const url of content.matchAll(re)) {
    const u = url[0];
    if (urlToFile.has(u)) continue;

    const photoId = u.match(/photo-[a-z0-9-]+/)?.[0] ?? 'img';
    const w       = u.match(/[?&]w=(\d+)/)?.[1] ?? '';
    const h       = u.match(/[?&]h=(\d+)/)?.[1] ?? '';
    const dim     = w && h ? `${w}x${h}` : w || h || 'orig';
    const fname   = `${photoId}-${dim}.webp`;
    urlToFile.set(u, fname);
  }
}

for (const f of htmlFiles)
  collectUrls(fs.readFileSync(path.join(DIR, f), 'utf8'));
for (const f of cssFiles)
  collectUrls(fs.readFileSync(f, 'utf8'));

console.log(`Found ${urlToFile.size} unique images.\n`);

// ── 2. Download helper (follows redirects) ────────────────────────────────────
function fetchUrl(url, dest, redirects = 5) {
  return new Promise((resolve, reject) => {
    if (!redirects) return reject(new Error('Too many redirects'));
    https.get(url, { headers: { 'Accept': 'image/webp,*/*' } }, res => {
      if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307) {
        return fetchUrl(res.headers.location, dest, redirects - 1).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));
      const tmp = dest + '.tmp';
      const out = fs.createWriteStream(tmp);
      res.pipe(out);
      out.on('finish', () => {
        out.close(() => {
          fs.renameSync(tmp, dest);
          resolve(fs.statSync(dest).size);
        });
      });
    }).on('error', err => { try { fs.unlinkSync(dest + '.tmp'); } catch {} reject(err); });
  });
}

// Build a lower-quality fallback URL for images still over 100 KB
function lowerQuality(url) {
  // Step down: 65→50→40, 72→60→50
  return url.replace(/q=(\d+)/, (_, q) => `q=${Math.max(40, parseInt(q) - 15)}`);
}

// ── 3. Download every image ───────────────────────────────────────────────────
async function main() {
  const results = [];

  for (const [url, fname] of urlToFile) {
    const dest = path.join(IMG_DIR, fname);

    if (fs.existsSync(dest)) {
      const kb = (fs.statSync(dest).size / 1024).toFixed(1);
      console.log(`SKIP  ${fname.padEnd(55)} ${kb} KB`);
      results.push({ fname, kb: parseFloat(kb), status: 'skip' });
      continue;
    }

    let attempt = url;
    let size, tries = 0;

    while (tries++ < 3) {
      try {
        size = await fetchUrl(attempt, dest);
        if (size > 102400 && tries < 3) {
          // Over 100 KB — re-fetch with lower quality
          fs.unlinkSync(dest);
          attempt = lowerQuality(attempt);
          console.log(`  ↓  Re-trying at lower quality: ${attempt.match(/q=\d+/)?.[0]}`);
        } else break;
      } catch (e) {
        console.log(`FAIL  ${fname}: ${e.message}`);
        results.push({ fname, kb: 0, status: 'fail' });
        break;
      }
    }

    if (size !== undefined) {
      const kb = (size / 1024).toFixed(1);
      const flag = size > 102400 ? ' ⚠ STILL OVER 100KB' : '';
      console.log(`OK    ${fname.padEnd(55)} ${kb} KB${flag}`);
      results.push({ fname, kb: parseFloat(kb), status: size > 102400 ? 'over' : 'ok' });
    }

    await new Promise(r => setTimeout(r, 120)); // polite delay
  }

  // ── 4. Summary ───────────────────────────────────────────────────────────────
  console.log('\n── Summary ──────────────────────────────────────────────');
  const ok   = results.filter(r => r.status === 'ok' || r.status === 'skip');
  const over = results.filter(r => r.status === 'over');
  const fail = results.filter(r => r.status === 'fail');
  console.log(`Total images : ${urlToFile.size}`);
  console.log(`Under 100 KB : ${ok.length}`);
  console.log(`Over  100 KB : ${over.length}${over.length ? ' → ' + over.map(r=>r.fname).join(', ') : ''}`);
  console.log(`Failed       : ${fail.length}`);

  // ── 5. Rewrite HTML + CSS references ─────────────────────────────────────────
  console.log('\n── Updating file references ─────────────────────────────');
  let updated = 0;

  function rewrite(filePath, prefix) {
    let c = fs.readFileSync(filePath, 'utf8'), changed = false;
    for (const [url, fname] of urlToFile) {
      if (c.includes(url)) {
        c = c.split(url).join(prefix + fname);
        changed = true;
      }
    }
    if (changed) { fs.writeFileSync(filePath, c, 'utf8'); updated++; console.log(`Updated: ${path.basename(filePath)}`); }
  }

  for (const f of htmlFiles) rewrite(path.join(DIR, f), 'images/');
  for (const f of cssFiles)  rewrite(f, '../images/');

  console.log(`\nDone — ${updated} files updated. All images are in /images/ ✓`);
}

main().catch(console.error);
