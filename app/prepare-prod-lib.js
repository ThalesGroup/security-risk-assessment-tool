const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const libDir = path.resolve(__dirname, '../lib');
const prodDir = path.resolve(__dirname, '../.lib-prod');

fs.rmSync(prodDir, { recursive: true, force: true });
fs.mkdirSync(prodDir, { recursive: true });

for (const file of ['package.json', 'package-lock.json']) {
  fs.copyFileSync(
    path.join(libDir, file),
    path.join(prodDir, file)
  );
}

execSync('npm ci --omit=dev', {
  cwd: prodDir,
  stdio: 'inherit'
});