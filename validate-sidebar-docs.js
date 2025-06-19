const fs = require('fs');
const path = require('path');

// 👇 Modify if your docs folder has a different name
const DOCS_DIR = path.join(__dirname, 'docs');
const sidebar = require('./sidebars');

function collectDocIds(items) {
  const docIds = [];

  for (const item of items) {
    if (typeof item === 'string') {
      docIds.push(item);
    } else if (item.type === 'category' && Array.isArray(item.items)) {
      docIds.push(...collectDocIds(item.items));
    }
  }

  return docIds;
}

function getAllDocIds(sidebarObj) {
  const allDocIds = [];

  for (const key in sidebarObj) {
    const section = sidebarObj[key];
    if (Array.isArray(section)) {
      allDocIds.push(...collectDocIds(section));
    }
  }

  return allDocIds;
}

function validateDocIds(docIds) {
  let allGood = true;

  for (const docId of docIds) {
    const docPath = path.join(DOCS_DIR, `${docId}.md`);

    if (!fs.existsSync(docPath)) {
      allGood = false;
      console.warn(`❌ Missing: ${docPath}`);
    }
  }

  if (allGood) {
    console.log('✅ All sidebar doc IDs point to existing .md files.');
  }
}

const docIds = getAllDocIds(sidebar);
validateDocIds(docIds);
