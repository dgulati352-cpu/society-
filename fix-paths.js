import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const target = process.env.VITE_TARGET;
const distPath = path.resolve(__dirname, 'dist');

if (target === 'admin' || target === 'member') {
    const panelDir = target === 'admin' ? 'admin-panel' : 'member-panel';
    const sourceIndex = path.join(distPath, panelDir, 'index.html');
    const targetIndex = path.join(distPath, 'index.html');

    if (fs.existsSync(sourceIndex)) {
        fs.copyFileSync(sourceIndex, targetIndex);
        console.log(`Successfully moved ${panelDir}/index.html to root dist/index.html`);
        
        let html = fs.readFileSync(targetIndex, 'utf8');
        // Vite's build with base: './' in a subfolder uses '../assets/' to reach the root assets folder.
        // Since we moved the file to the root, we need to change '../assets/' to './assets/'.
        html = html.replace(/\.\.\/assets\//g, './assets/'); 
        fs.writeFileSync(targetIndex, html);
        console.log('Fixed asset paths for root deployment.');
    } else {
        console.error(`Source index not found at ${sourceIndex}`);
    }
}
