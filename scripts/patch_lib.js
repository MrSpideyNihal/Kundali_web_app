
import fs from 'fs';
import path from 'path';

const filePath = path.resolve('node_modules/swisseph-wasm/src/swisseph.js');

try {
    let content = fs.readFileSync(filePath, 'utf8');

    // Patch calc_ut
    const oldCode = 'this.SweModule._free(buffer);';
    // We want to comment it out ONLY inside calc_ut? 
    // Or globally? Globally might be safer for all methods that use this pattern.
    // Ensure we don't break other things.
    // The pattern is unique enough or we can be specific.

    if (content.includes(oldCode)) {
        console.log("Patching _free...");
        const newContent = content.replace(/this\.SweModule\._free\(buffer\);/g, '// this.SweModule._free(buffer);');
        fs.writeFileSync(filePath, newContent);
        console.log("Patched successfully.");
    } else {
        console.log("Already patched or code not found.");
    }

} catch (e) {
    console.error("Patch failed:", e);
}
