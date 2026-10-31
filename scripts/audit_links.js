const fs = require('fs');
const path = require('path');

// 1. Gather all existing routes in Next.js App Router
const appDir = path.join(__dirname, '../src/app');
const routes = new Set(['/']);

function scanRoutes(dir, currentRoute = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      scanRoutes(path.join(dir, entry.name), currentRoute + '/' + entry.name);
    } else if (entry.name === 'page.tsx' || entry.name === 'page.ts') {
      routes.add(currentRoute || '/');
    }
  }
}
scanRoutes(appDir);
console.log('=== APP ROUTER VALID ROUTES (' + routes.size + ') ===');
for (const r of Array.from(routes).sort()) {
  console.log('  ' + r);
}

// 2. Scan all .ts and .tsx files in src/ for href attributes
const srcDir = path.join(__dirname, '../src');
const internalLinks = [];

function scanHrefs(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanHrefs(fullPath);
    } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const relPath = path.relative(path.join(__dirname, '..'), fullPath).replace(/\\/g, '/');
      
      // Match href="/something..." or href={'/something...'} or href={`/something...`}
      const hrefRegex = /href=["'`](\/[^"'`$#?]+)/g;
      let match;
      while ((match = hrefRegex.exec(content)) !== null) {
        let link = match[1];
        if (link.endsWith('/') && link.length > 1) link = link.slice(0, -1);
        internalLinks.push({ file: relPath, link, raw: match[0] });
      }
    }
  }
}
scanHrefs(srcDir);

console.log('\n=== CHECKING STATIC INTERNAL HREF LINKS (' + internalLinks.length + ' found) ===');
let brokenCount = 0;
for (const item of internalLinks) {
  if (item.link) {
    if (!routes.has(item.link)) {
      brokenCount++;
      console.log('❌ BROKEN LINK: ' + item.file + ' -> ' + item.link + ' (' + item.raw + ')');
    }
  }
}
if (brokenCount === 0) {
  console.log('✅ No broken static internal links found.');
} else {
  console.log('Total broken links found: ' + brokenCount);
}

// 3. Check tools.ts relatedSlugs and route existence
console.log('\n=== CHECKING TOOLS.TS ===');
const { TOOLS } = require('../src/lib/tools.ts');
const toolSlugs = new Set(TOOLS.map(t => t.slug));
let brokenToolSlugs = 0;
for (const tool of TOOLS) {
  for (const rel of (tool.relatedSlugs || [])) {
    if (!toolSlugs.has(rel)) {
      brokenToolSlugs++;
      console.log('❌ BROKEN relatedSlug in tool "' + tool.slug + '": ' + rel);
    }
  }
  if (!routes.has('/herramientas/' + tool.slug)) {
    console.log('❌ Missing page for tool: /herramientas/' + tool.slug);
  }
}
if (brokenToolSlugs === 0) {
  console.log('✅ All relatedSlugs in tools.ts exist and match valid tools (' + TOOLS.length + ' tools).');
}

// 4. Check guides.ts relatedToolSlugs and route existence
console.log('\n=== CHECKING GUIDES.TS ===');
const { GUIDES } = require('../src/lib/guides.ts');
let brokenGuideToolSlugs = 0;
for (const guide of GUIDES) {
  for (const rel of (guide.relatedToolSlugs || [])) {
    if (!toolSlugs.has(rel)) {
      brokenGuideToolSlugs++;
      console.log('❌ BROKEN relatedToolSlug in guide "' + guide.slug + '": ' + rel);
    }
  }
  if (!routes.has('/guias/' + guide.slug)) {
    console.log('❌ Missing page for guide: /guias/' + guide.slug);
  }
}
if (brokenGuideToolSlugs === 0) {
  console.log('✅ All relatedToolSlugs in guides.ts exist and match valid tools (' + GUIDES.length + ' guides).');
}

// 5. Check Footer, Header, and other common components
console.log('\n=== AUDIT SUMMARY ===');
console.log('Tools audited:', TOOLS.length);
console.log('Guides audited:', GUIDES.length);
console.log('Routes in App Router:', routes.size);
console.log('Internal links tested:', internalLinks.length);
console.log('Broken links count:', brokenCount);
