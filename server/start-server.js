const { spawn } = require('child_process');
const path = require('path');

let serverProcess = null;
let restartCount = 0;
const MAX_RESTARTS = 5;
const RESTART_DELAY = 2000; // 2 секунди

function startServer() {
    console.log('\n Starting server...\n');
    
    serverProcess = spawn('node', [path.join(__dirname, 'server.js')], {
        stdio: 'inherit',
        cwd: __dirname
    });
    
    serverProcess.on('error', (error) => {
        console.error('Failed to start server:', error.message);
        attemptRestart();
    });
    
    serverProcess.on('exit', (code, signal) => {
        if (code !== 0 && code !== null) {
            console.error(`\n Server crashed with code ${code}`);
            attemptRestart();
        } else if (signal) {
            console.log(`\n  Server stopped by signal: ${signal}`);
        }
    });
}

function attemptRestart() {
    if (restartCount < MAX_RESTARTS) {
        restartCount++;
        console.log(`\n Attempting to restart server (${restartCount}/${MAX_RESTARTS})...`);
        setTimeout(() => {
            startServer();
        }, RESTART_DELAY);
    } else {
        console.error('\n Max restart attempts reached. Please check the logs.');
        process.exit(1);
    }
}

// Обробка сигналів завершення
process.on('SIGINT', () => {
    console.log('\n\n Shutting down server gracefully...');
    if (serverProcess) {
        serverProcess.kill('SIGTERM');
    }
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n\n Shutting down server gracefully...');
    if (serverProcess) {
        serverProcess.kill('SIGTERM');
    }
    process.exit(0);
});

// Запуск сервера
startServer();

// Скидання лічильника перезапусків кожні 5 хвилин
setInterval(() => {
    if (restartCount > 0) {
        console.log('Server stable, resetting restart counter');
        restartCount = 0;
    }
}, 5 * 60 * 1000);
