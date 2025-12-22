// Fallback entrypoint for Render: runs backend server when Render invokes `node index.js` at repo root
const { spawn } = require('child_process');

const child = spawn(process.execPath, ['backend/src/server.js'], { stdio: 'inherit' });

child.on('close', (code) => {
  process.exit(code);
});

child.on('error', (err) => {
  console.error('Failed to start backend sub-process:', err);
  process.exit(1);
});
