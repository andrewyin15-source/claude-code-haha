// Enable ALL hidden features EXCEPT UDS_INBOX
const fs = require('fs');
const path = require('path');

const enabled = [
    "BUDDY", "KAIROS", "ULTRAPLAN", "VOICE_MODE", "PROACTIVE", "COORDINATOR_MODE", "BRIDGE_MODE",
    "DAEMON", "BG_SESSIONS", "TORCH", "WORKFLOW_SCRIPTS", "CCR_REMOTE_SETUP",
    "FORK_SUBAGENT", "VOICE", "CHICAGO_MCP", "BYOC_ENVIRONMENT_RUNNER", "SELF_HOSTED_RUNNER",
    "TEMPLATES", "KAIROS_BRIEF", "KAIROS_PUSH_NOTIFICATION", "KAIROS_GITHUB_WEBHOOKS",
    "KAIROS_CHANNELS", "HISTORY_SNIP", "EXPERIMENTAL_SKILL_SEARCH"
];

const allFeatures = [
    "BUDDY", "KAIROS", "ULTRAPLAN", "VOICE_MODE", "PROACTIVE", "COORDINATOR_MODE", "BRIDGE_MODE",
    "DAEMON", "BG_SESSIONS", "TORCH", "WORKFLOW_SCRIPTS", "CCR_REMOTE_SETUP", "UDS_INBOX",
    "FORK_SUBAGENT", "VOICE", "CHICAGO_MCP", "BYOC_ENVIRONMENT_RUNNER", "SELF_HOSTED_RUNNER",
    "TEMPLATES", "KAIROS_BRIEF", "KAIROS_PUSH_NOTIFICATION", "KAIROS_GITHUB_WEBHOOKS",
    "KAIROS_CHANNELS", "HISTORY_SNIP", "EXPERIMENTAL_SKILL_SEARCH"
];

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    for (const feature of allFeatures) {
        let r1 = new RegExp(`if\\s*\\(\\s*feature\\s*\\(\\s*['"]${feature}['"]\\s*\\)\\s*\\)`, 'g');
        let r2 = new RegExp(`if\\s*\\(\\s*!\\s*feature\\s*\\(\\s*['"]${feature}['"]\\s*\\)\\s*\\)`, 'g');
        if (r1.test(content)) { content = content.replace(r1, enabled.includes(feature) ? 'if (true)' : 'if (false)'); modified = true; }
        r1.lastIndex = 0;
        if (r2.test(content)) { content = content.replace(r2, enabled.includes(feature) ? 'if (false)' : 'if (true)'); modified = true; }
    }
    if (modified) fs.writeFileSync(filePath, content, 'utf8');
}

function walkDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
        const p = path.join(dir, e.name);
        if (e.isDirectory() && e.name !== 'node_modules') walkDir(p);
        else if (e.isFile() && /\.(ts|tsx)$/.test(e.name)) try { processFile(p); } catch (e) {}
    }
}

walkDir('src');
console.log('FULL version: 25 features enabled (UDS_INBOX excluded)');
console.log('Enabled: ' + enabled.join(', '));
