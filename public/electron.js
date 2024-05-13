const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const child_process = require('child_process');

let flaskProcess;

// Function to start the Flask process
function startFlaskProcess() {
    try {
        // Attempt to spawn the process using the original path
        let filepath = path.join(__dirname, '..', '..', '..', 'dist', 'app', 'app.exe');
        if (!fs.existsSync(filepath)) {
          filepath = path.join(__dirname, '..', 'dist', 'app', 'app.exe');
        }

        flaskProcess = child_process.spawn(filepath);

        // Listen for process events, handle as needed
        flaskProcess.on('exit', (code, signal) => {
            console.log(`Flask process exited with code ${code} and signal ${signal}`);
        });

        flaskProcess.stdout.on('data', (data) => {
            console.log(`Flask process stdout: ${data}`);
        });

        flaskProcess.stderr.on('data', (data) => {
            console.error(`Flask process stderr: ${data}`);
        });
    } catch (error) {
        console.error(`Flask process error: ${error}`);
    }
}

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  startFlaskProcess();


  // Load React frontend
  mainWindow.loadFile(path.join(__dirname, '..', 'build', 'index.html'));

  mainWindow.on('closed', function () {
    mainWindow = null;
    // Kill Flask server when the window is closed
    flaskProcess.kill();
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});


