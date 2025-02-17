const { app, BrowserWindow } = require('electron');
const { exec } = require('child_process');
const path = require('path');

let mainWindow;
let backendProcess;
let frontendProcess;
let serverProcess;

app.on('ready', () => {
    // Start Backend (Python)
    backendProcess = exec('python ../Backend/app.py', (err, stdout, stderr) => {
        if (err) console.error(`Backend error: ${stderr}`);
        console.log(`Backend started: ${stdout}`);
    });

    // Start Server (Node.js)
    serverProcess = exec('node ../Server/StartServer.js', (err, stdout, stderr) => {
        if (err) console.error(`Server error: ${stderr}`);
        console.log(`Server started: ${stdout}`);
    });

    // Start React Frontend
    frontendProcess = exec('npm run react-start', { cwd: path.join(__dirname, '../Frontend') });

    setTimeout(() => {
        mainWindow = new BrowserWindow({
            width: 1200,
            height: 800,
            webPreferences: { nodeIntegration: true }
        });

        const startUrl = app.isPackaged
            ? `file://${path.join(__dirname, '../build/index.html')}`
            : 'http://localhost:3000';

        mainWindow.loadURL(startUrl);
    }, 5000); // Delay to allow React to start
});

app.on('window-all-closed', () => {
    if (backendProcess) backendProcess.kill();
    if (serverProcess) serverProcess.kill();
    if (frontendProcess) frontendProcess.kill();
    app.quit();
});
