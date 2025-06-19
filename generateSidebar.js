const fs = require('fs');
const path = require('path');

const DOCS_DIR = 'docs';
const ROOT_FOLDER = 'Աստվածաշունչ';

function toSidebarPath(filePath) {
  return filePath.replace(/\.md$/, '').replace(/\\/g, '/');
}

function walkDir(dir) {
  const result = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  // ✅ Natural number sort (e.g., 1, 2, 10 instead of 1, 10, 2)
  entries.sort((a, b) =>
    a.name.localeCompare(b.name, 'hy', { numeric: true, sensitivity: 'base' })
  );

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      const children = walkDir(fullPath);
      result.push({
        type: 'category',
        label: entry.name,
        items: children
      });
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      result.push(toSidebarPath(path.relative(DOCS_DIR, fullPath)));
    }
  }

  return result;
}

function generateSidebar() {
  const rootPath = path.join(DOCS_DIR, ROOT_FOLDER);
  const sidebar = [
    {
      type: 'category',
      label: ROOT_FOLDER,
      items: walkDir(rootPath),
    }
  ];

  const output = `export default {
  sidebar: ${JSON.stringify(sidebar, null, 2)}
};\n`;

  fs.writeFileSync('sidebars.js', output, 'utf-8');
  console.log('✅ sidebars.js generated successfully.');
}

generateSidebar();
