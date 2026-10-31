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

  // Import TableOfContents if not present
  if (!content.includes('TableOfContents')) {
    content = content.replace(
      "import Link from 'next/link';",
      "import Link from 'next/link';\nimport TableOfContents from '@/components/TableOfContents';"
    );
  }

  // Insert TableOfContents right before the content container
  if (!content.includes('<TableOfContents />')) {
    content = content.replace(
      /(<div className="font-serif max-w-\[68ch\])/,
      '<TableOfContents />\n\n        $1'
    );
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Added TOC to: ${slug}`);
}
