const { spawn } = require('child_process');
const path = require('path');
let serverProcess = null;
let restartCount = 0;
const MAX_RESTARTS = 5;
const RESTART_DELAY = 2000; // 2 секунди
function startServer() {
    serverProcess = spawn('node', [path.join(__dirname, 'server.js')], {
        stdio: 'inherit',
        cwd: __dirname
    });
    serverProcess.on('error', (error) => {
        attemptRestart();
    });
    serverProcess.on('exit', (code, signal) => {
        if (code !== 0 && code !== null) {
            attemptRestart();
        } else if (signal) {
        }
    });
}
function attemptRestart() {
    if (restartCount < MAX_RESTARTS) {
        restartCount++;
        setTimeout(() => {
            startServer();
        }, RESTART_DELAY);
    } else {
        process.exit(1);
    }
}
process.on('SIGINT', () => {
    if (serverProcess) {
        serverProcess.kill('SIGTERM');
    }
    process.exit(0);
});
process.on('SIGTERM', () => {
    if (serverProcess) {
        serverProcess.kill('SIGTERM');
    }
    process.exit(0);
});
startServer();
setInterval(() => {
    if (restartCount > 0) {
        restartCount = 0;
    }
}, 5 * 60 * 1000);
