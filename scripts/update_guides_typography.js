const fs = require('fs');
const path = require('path');

const guidesDir = path.join(__dirname, '..', 'src', 'app', 'guias');
const dirs = fs.readdirSync(guidesDir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

for (const slug of dirs) {
  const filePath = path.join(guidesDir, slug, 'page.tsx');
  if (!fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Import formatDateSpanish
  if (!content.includes('formatDateSpanish')) {
    content = content.replace(
      "import { getGuideBySlug } from '@/lib/guides';",
      "import { getGuideBySlug, formatDateSpanish } from '@/lib/guides';"
    );
  }

  // 2. Replace date display in visual template (without touching JSON-LD)
  content = content.replace(
    '<time dateTime={guide.publishDate}>{guide.publishDate}</time>',
    '<time dateTime={guide.publishDate}>{formatDateSpanish(guide.publishDate)}</time>'
  );

  // 3. Remove " →" in buttons/links
  content = content.replace(/\s*&rarr;\s*/g, ' ');
  content = content.replace(/Abrir (.*?) →/g, 'Abrir $1');
  content = content.replace(/Probar (.*?) →/g, 'Probar $1');
  content = content.replace(/Leer (.*?) →/g, 'Leer $1');

  // 4. Update article font and column width for reading
  content = content.replace(
    /className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-sm text-foreground\/90 leading-relaxed"/g,
    'className="font-serif max-w-[68ch] space-y-6 text-base sm:text-lg text-foreground/90 leading-relaxed"'
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated guide: ${slug}`);
}
