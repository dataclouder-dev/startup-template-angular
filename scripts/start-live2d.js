const { spawn } = require('child_process');
const http = require('http');
const os = require('os');

// --- Configuration ---
const PORT = 4200;
const URL = `http://localhost:${PORT}`;
const CHROME_FLAGS = [
  `--app=${URL}`,
  '--enable-transparent-visuals',
  '--disable-gpu-sandbox',
  '--window-size=1280,720',
  '--app-window-size=1280,720'
];
// --- End Configuration ---

function getChromePath() {
  switch (os.platform()) {
    case 'darwin': // macOS
      return '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
    case 'win32': // Windows
      return 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    case 'linux': // Linux
      return '/usr/bin/google-chrome';
    default:
      throw new Error('Unsupported platform');
  }
}

function launchChrome() {
  try {
    const chromePath = getChromePath();
    console.log(`Attempting to launch Chrome from: ${chromePath}`);
    const chromeProcess = spawn(chromePath, CHROME_FLAGS, {
      detached: true,
      stdio: 'ignore'
    });
    chromeProcess.unref();
    console.log(`Chrome launched with flags: ${CHROME_FLAGS.join(' ')}`);
  } catch (error) {
    console.error('Error launching Chrome:', error.message);
    console.error('Please ensure Google Chrome is installed in the default location for your OS.');
  }
}

function checkServer(port, callback) {
  const checker = () => {
    const req = http.request({
      host: 'localhost',
      port: port,
      path: '/',
      method: 'GET'
    }, (res) => {
      if (res.statusCode >= 200 && res.statusCode < 400) {
        console.log(`Dev server is ready at ${URL}.`);
        callback();
      } else {
        setTimeout(checker, 1000);
      }
    });

    req.on('error', () => {
      setTimeout(checker, 1000);
    });

    req.end();
  };
  checker();
}

console.log('Starting Angular development server...');
const ngServe = spawn('ng', ['serve'], { stdio: 'inherit' });

ngServe.on('error', (err) => {
  console.error('Failed to start "ng serve". Make sure you are in an Angular project directory and have @angular/cli installed.', err);
  process.exit(1);
});

console.log('Waiting for the development server to be ready...');
checkServer(PORT, launchChrome);