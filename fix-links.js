const fs = require('fs');
const path = require('path');

function processDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.git') {
                processDir(fullPath);
            }
        } else if (file.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            // Replace href="file.html" with href="/file" (or href="/" if index.html)
            content = content.replace(/href=["']([a-zA-Z0-9-]+)\.html([#"'])/g, (match, p1, p2) => {
                if (p1 === 'index') return `href="/${p2 === '"' || p2 === "'" ? '' : p2.substring(1)}"`.replace('""', '"').replace("''", "'");
                let extension = p2;
                if(p2.startsWith('#')) return `href="/${p1}${p2}`;
                return `href="/${p1}${p2}`;
            });
            fs.writeFileSync(fullPath, content);
        }
    }
}

// Fix root HTML files
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/href=["']([a-zA-Z0-9-]+)\.html(["'])/g, (match, p1, p2) => {
        if (p1 === 'index') return `href="/${p2}`;
        return `href="/${p1}${p2}`;
    });
    fs.writeFileSync(file, content);
});

// Fix views HTML files
const viewFiles = fs.readdirSync('views').filter(f => f.endsWith('.html'));
viewFiles.forEach(file => {
    let content = fs.readFileSync('views/' + file, 'utf8');
    content = content.replace(/href=["']([a-zA-Z0-9-]+)\.html(["'])/g, (match, p1, p2) => {
        if (p1 === 'index') return `href="/${p2}`;
        return `href="/${p1}${p2}`;
    });
    fs.writeFileSync('views/' + file, content);
});

console.log('Fixed HTML links');
