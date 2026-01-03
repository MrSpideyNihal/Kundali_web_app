/**
 * Postinstall script to patch swisseph-wasm library
 * Fixes memory access bug in calc_ut by commenting out premature _free calls
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.join(__dirname, '..', 'node_modules', 'swisseph-wasm', 'src', 'swisseph.js');

try {
    if (!fs.existsSync(filePath)) {
        console.log('swisseph-wasm not installed yet, skipping patch');
        process.exit(0);
    }

    let content = fs.readFileSync(filePath, 'utf8');

    const oldCode = 'this.SweModule._free(buffer);';

    if (content.includes(oldCode) && !content.includes('// PATCHED:')) {
        console.log('Patching swisseph-wasm to fix memory access bug...');
        const newContent = content.replace(
            /this\.SweModule\._free\(buffer\);/g,
            '// PATCHED: this.SweModule._free(buffer);'
        );
        fs.writeFileSync(filePath, newContent);
        console.log('✓ Patch applied successfully!');
    } else {
        console.log('swisseph-wasm already patched or patch not needed');
    }

} catch (e) {
    console.error('Patch warning:', e.message);
    // Don't fail the build
    process.exit(0);
}
