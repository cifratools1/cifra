const fs = require('fs');
const path = require('path');

const guidesDir = path.join(__dirname, '..', 'src', 'app', 'guias');
const dirs = fs.readdirSync(guidesDir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

dirs.forEach(slug => {
  const filePath = path.join(guidesDir, slug, 'page.tsx');
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, 'utf8');
  const faqItemsMatch = content.match(/const faqItems = (\[[\s\S]*?\]);/);
  let faqText = '';
  if (faqItemsMatch) {
    try {
      // Safe eval or extraction for faqItems
      const arr = eval(faqItemsMatch[1]);
      faqText = arr.map(i => i.question + ' ' + i.answer).join(' ');
    } catch (e) {
      // Fallback regex extraction if eval fails
      const qMatches = [...content.matchAll(/question:\s*['"`](.*?)['"`]/g)].map(m => m[1]);
      const aMatches = [...content.matchAll(/answer:\s*['"`](.*?)['"`]/g)].map(m => m[1]);
      faqText = qMatches.concat(aMatches).join(' ');
    }
  }

  const articleMatch = content.match(/<article[\s\S]*?<\/article>/);
  let articleText = '';
  if (articleMatch) {
    articleText = articleMatch[0]
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/\{faqItems\.map[\s\S]*?\)\)\}/gi, ' ' + faqText + ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\{[^}]+\}/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
  const words = articleText.split(/\s+/).filter(Boolean);
  console.log(`${slug} : ${words.length} palabras`);
});
