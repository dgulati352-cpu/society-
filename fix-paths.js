import fs from 'fs';
import path from 'path';

function replaceInDir(dir, replacements) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath, replacements);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.html')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Apply exact replacements
      for (const [oldStr, newStr] of replacements) {
        content = content.split(oldStr).join(newStr);
      }
      
      fs.writeFileSync(fullPath, content);
    }
  }
}

// member-panel/src/components/*.jsx => need ../../../shared
replaceInDir('d:/society/member-panel/src/components', [
  ["from '../../shared/db'", "from '../../../shared/db'"],
  ["from '../../shared/firebase'", "from '../../../shared/firebase'"],
  ["from '../../src/db'", "from '../../../shared/db'"]
]);

// admin-panel/src/*.jsx => need ../../shared
replaceInDir('d:/society/admin-panel/src', [
  ["from '../shared/db'", "from '../../shared/db'"],
  ["from '../shared/firebase'", "from '../../shared/firebase'"],
  ["from '../../src/db'", "from '../../shared/db'"]
]);

// main.jsx
replaceInDir('d:/society/member-panel/src', [
  ["import '../shared/index.css'", "import '../../shared/index.css'"]
]);

// main-admin.jsx
replaceInDir('d:/society/admin-panel/src', [
  ["import '../shared/index.css'", "import '../../shared/index.css'"]
]);

// vite.config.js inputs
let vite = fs.readFileSync('d:/society/vite.config.js', 'utf8');
vite = vite.split("'index.html'").join("'member-panel/index.html'");
vite = vite.split("'admin/index.html'").join("'admin-panel/index.html'");
fs.writeFileSync('d:/society/vite.config.js', vite);

console.log("Done");
