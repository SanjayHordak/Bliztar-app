const { spawn, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');
const express = require('express');

const root = __dirname;
const adminDir = path.join(root, 'admin');
const adminDist = path.join(adminDir, 'dist');
const backendDir = path.join(root, 'backend');

const FRONTEND_PORT = process.env.PORT || 10000; // Render provides PORT for the service
const BACKEND_PORT = process.env.BACKEND_PORT || 5000; // internal backend port

function runCommandSync(cmd, args, cwd) {
  const r = spawnSync(cmd, args, { cwd, stdio: 'inherit' });
  if (r.error) {
    console.error(`Failed to run ${cmd} ${args.join(' ')}:`, r.error);
    process.exit(1);
  }
  if (r.status !== 0) {
    console.error(`${cmd} ${args.join(' ')} exited with ${r.status}`);
    process.exit(r.status || 1);
  }
}

// Ensure admin build exists
if (!fs.existsSync(path.join(adminDist, 'index.html'))) {
  console.log('Admin build not found — installing and building admin...');
  runCommandSync('npm', ['ci'], adminDir);
  runCommandSync('npm', ['run', 'build'], adminDir);
}

// Ensure backend deps exist
if (!fs.existsSync(path.join(backendDir, 'node_modules'))) {
  console.log('Backend deps not found — installing backend deps...');
  runCommandSync('npm', ['ci'], backendDir);
}

// Start backend as a child process on BACKEND_PORT
const backendEnv = Object.assign({}, process.env, { PORT: String(BACKEND_PORT) });
const backend = spawn(process.execPath, [path.join(backendDir, 'src', 'server.js')], {
  env: backendEnv,
  stdio: 'inherit',
});

backend.on('exit', (code) => {
  console.error('Backend process exited with', code);
  process.exit(code || 0);
});

// Start frontend server that serves admin/dist and proxies /api to backend
const app = express();

// Proxy /api to backend
app.use('/api', (req, res) => {
  const options = {
    hostname: '127.0.0.1',
    port: BACKEND_PORT,
    path: req.originalUrl,
    method: req.method,
    headers: req.headers,
  };

  const proxy = http.request(options, (pres) => {
    res.writeHead(pres.statusCode, pres.headers);
    pres.pipe(res, { end: true });
  });

  proxy.on('error', (err) => {
    console.error('Proxy error:', err);
    res.statusCode = 502;
    res.end('Bad gateway');
  });

  req.pipe(proxy, { end: true });
});

// Serve static admin files
app.use(express.static(adminDist));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(adminDist, 'index.html'));
});

app.listen(FRONTEND_PORT, () => {
  console.log(`Frontend server listening on ${FRONTEND_PORT}, proxying /api to ${BACKEND_PORT}`);
});
// Fallback entrypoint for Render: ensure backend deps are installed
// and then run the backend when Render invokes `node index.js` at repo root.
const { spawn, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// const backendDir = path.join(__dirname, 'backend'); // Removed duplicate declaration
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
