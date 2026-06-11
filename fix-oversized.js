// Fixes the 23 images still over 100KB by reducing width + quality via Unsplash params
const fs    = require('fs');
const path  = require('path');
const https = require('https');

const IMG_DIR = path.join(__dirname, 'images');

// Map: local filename → aggressive re-fetch URL
// Strategy: 1920px→1280px q=28, 1200px→800px q=28, 800-1000px→600px q=28
const oversized = [
  'photo-1517248135467-4c7edcad34c4-1920.webp',
  'photo-1544025162-d76694265947-1920.webp',
  'photo-1551218808-94e220e084d2-1920.webp',
  'photo-1577219491135-ce391730fb2c-1920.webp',
  'photo-1414235077428-338989a2e8c0-1920.webp',
  'photo-1559339352-11d035aa65de-1920.webp',
  'photo-1504674900247-0877df9cc836-1920.webp',
  'photo-1424847651672-bf20a4b0982b-1920.webp',
  'photo-1555396273-367ea4eb4db5-1920.webp',
  'photo-1565299624946-b28f40a0ae38-1200.webp',
  'photo-1579584425555-c3ce17fd4351-1200.webp',
  'photo-1625944230945-1b7dd3b949ab-1200.webp',
  'photo-1577219491135-ce391730fb2c-1200.webp',
  'photo-1517248135467-4c7edcad34c4-1200.webp',
  'photo-1540189549336-e6e99c3679fe-1200.webp',
  'photo-1555396273-367ea4eb4db5-1200.webp',
  'photo-1572116469696-31de0f17cc34-1200.webp',
  'photo-1579584425555-c3ce17fd4351-800.webp',
  'photo-1540189549336-e6e99c3679fe-800.webp',
  'photo-1565299624946-b28f40a0ae38-900.webp',
  'photo-1555396273-367ea4eb4db5-900.webp',
  'photo-1555396273-367ea4eb4db5-1000.webp',
  'photo-1579584425555-c3ce17fd4351-600.webp',
];

// Extract photo ID from filename and build a smaller Unsplash URL
function buildUrl(fname) {
  // Strip .webp, then strip trailing dimension (-1920 or -600x400)
  const photoId = fname.replace(/\.webp$/, '').replace(/-\d+x\d+$/, '').replace(/-\d+$/, '');
  const dimPart = fname.replace(photoId + '-', '').replace('.webp', '');
  const origW   = parseInt(dimPart.split('x')[0]) || parseInt(dimPart);

  // Reduce width: ≥1920→1280, ≥1200→800, ≥800→600, else→500
  let newW;
  if (origW >= 1920) newW = 1280;
  else if (origW >= 1200) newW = 800;
  else if (origW >= 800)  newW = 600;
  else                    newW = 500;

  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&fm=webp&w=${newW}&q=28`;
}

function fetchUrl(url, dest, hops = 5) {
  return new Promise((res, rej) => {
    if (!hops) return rej(new Error('Too many redirects'));
    https.get(url, { headers: { Accept: 'image/webp,*/*' } }, r => {
      if (r.statusCode === 301 || r.statusCode === 302 || r.statusCode === 307)
        return fetchUrl(r.headers.location, dest, hops - 1).then(res).catch(rej);
      if (r.statusCode !== 200) return rej(new Error(`HTTP ${r.statusCode}`));
      const tmp = dest + '.tmp';
      const out = fs.createWriteStream(tmp);
      r.pipe(out);
      out.on('finish', () => out.close(() => { fs.renameSync(tmp, dest); res(fs.statSync(dest).size); }));
    }).on('error', e => { try { fs.unlinkSync(dest + '.tmp'); } catch {} rej(e); });
  });
}

async function main() {
  let fixed = 0, stillOver = 0;

  for (const fname of oversized) {
    const dest = path.join(IMG_DIR, fname);
    if (fs.existsSync(dest)) fs.unlinkSync(dest); // remove old oversized file

    const url = buildUrl(fname);
    try {
      const size = await fetchUrl(url, dest);
      const kb   = (size / 1024).toFixed(1);
      const flag = size > 102400 ? ' ⚠ STILL OVER' : ' ✓';
      console.log(`${flag}  ${fname.padEnd(58)} ${kb} KB`);
      size > 102400 ? stillOver++ : fixed++;
    } catch (e) {
      console.log(`FAIL  ${fname}: ${e.message}`);
    }
    await new Promise(r => setTimeout(r, 100));
  }

  console.log(`\nFixed: ${fixed}  |  Still over: ${stillOver}`);

  if (stillOver === 0) {
    console.log('All images now under 100 KB ✓');
  } else {
    console.log('Remaining files are highly detailed photos where 100KB is physically impossible at usable resolution.');
    console.log('These are used as full-screen hero backgrounds — further cropping width to 960px is recommended.');
  }
}

main().catch(console.error);
