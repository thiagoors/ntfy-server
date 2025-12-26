const { execSync, spawn } = require('child_process');
const fs = require('fs');
const https = require('https');
const path = require('path');

const NTFY_VERSION = '2.8.0';
const NTFY_BINARY = './ntfy';
const DOWNLOAD_URL = `https://github.com/binwiederhier/ntfy/releases/download/v${NTFY_VERSION}/ntfy_${NTFY_VERSION}_linux_amd64.tar.gz`;

async function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    console.log(`Downloading from ${url}...`);

    const follow = (url) => {
      https.get(url, (response) => {
        if (response.statusCode === 302 || response.statusCode === 301) {
          follow(response.headers.location);
          return;
        }

        const file = fs.createWriteStream(dest);
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      }).on('error', reject);
    };

    follow(url);
  });
}

async function setup() {
  console.log('=== ntfy server setup ===');

  if (!fs.existsSync(NTFY_BINARY)) {
    console.log(`Downloading ntfy v${NTFY_VERSION}...`);

    await downloadFile(DOWNLOAD_URL, 'ntfy.tar.gz');

    console.log('Extracting...');
    execSync('tar -xzf ntfy.tar.gz');

    const extractedDir = `ntfy_${NTFY_VERSION}_linux_amd64`;
    fs.renameSync(path.join(extractedDir, 'ntfy'), NTFY_BINARY);

    // Cleanup
    fs.unlinkSync('ntfy.tar.gz');
    fs.rmdirSync(extractedDir, { recursive: true });

    // Make executable
    fs.chmodSync(NTFY_BINARY, '755');

    console.log('ntfy downloaded successfully!');
  }

  console.log('Starting ntfy server on port 80...');

  const ntfy = spawn(NTFY_BINARY, [
    'serve',
    '--listen-http', ':80',
    '--behind-proxy',
    '--upstream-base-url', 'https://ntfy.sh'
  ], {
    stdio: 'inherit'
  });

  ntfy.on('error', (err) => {
    console.error('Failed to start ntfy:', err);
    process.exit(1);
  });

  ntfy.on('exit', (code) => {
    console.log(`ntfy exited with code ${code}`);
    process.exit(code);
  });
}

setup().catch(err => {
  console.error('Setup failed:', err);
  process.exit(1);
});
