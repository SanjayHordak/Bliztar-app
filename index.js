// Fallback entrypoint for Render: ensure backend deps are installed
// and then run the backend when Render invokes `node index.js` at repo root.
const { spawn, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const backendDir = path.join(__dirname, 'backend');
const expressMarker = path.join(backendDir, 'node_modules', 'express');

if (!fs.existsSync(expressMarker)) {
  console.log('Backend dependencies not found — installing (this may take a while)...');
  const install = spawnSync('npm', ['ci', '--prefix', backendDir], { stdio: 'inherit' });
  if (install.error) {
    console.error('Failed to run npm:', install.error);
    process.exit(1);
  }
  if (install.status !== 0) {
    console.error('`npm ci` failed with exit code', install.status);
    process.exit(install.status || 1);
  }
}

const serverPath = path.join(backendDir, 'src', 'server.js');
const child = spawn(process.execPath, [serverPath], { stdio: 'inherit' });

child.on('close', (code) => process.exit(code));
child.on('error', (err) => {
  console.error('Failed to start backend sub-process:', err);
  process.exit(1);
});
