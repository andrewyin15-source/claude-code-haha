// Enable core features only - skip problematic ones
// Run with: node enable-core.cjs

const fs = require('fs');
const path = require('path');

// Only enable: BUDDY, PROACTIVE, COORDINATOR_MODE
// Skip: KAIROS, ULTRAPLAN, VOICE_MODE (may have external dependencies)
const features = [
    "BUDDY",
    "PROACTIVE",
    "COORDINATOR_MODE",
];

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    for (const feature of features) {
        // Replace: if (feature('NAME')) -> if (true)
        let regex = new RegExp(`if\\s*\\(\\s*feature\\s*\\(\\s*['"]${feature}['"]\\s*\\)\\s*\\)`, 'g');
        if (regex.test(content)) {
            content = content.replace(regex, 'if (true)');
            modified = true;
        }

        // Replace: if (!feature('NAME')) -> if (false)
        regex = new RegExp(`if\\s*\\(\\s*!\\s*feature\\s*\\(\\s*['"]${feature}['"]\\s*\\)\\s*\\)`, 'g');
        if (regex.test(content)) {
            content = content.replace(regex, 'if (false)');
            modified = true;
        }
    }

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Patched: ${filePath}`);
    }
}

function walkDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory() && entry.name !== 'node_modules') {
            walkDir(fullPath);
        } else if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name)) {
            try {
                processFile(fullPath);
            } catch (e) {
                // Skip
            }
        }
    }
}

console.log('Enabling core features...\n');
walkDir('src');
console.log('\nDone! Now run: bun ./src/entrypoints/cli.tsx');
