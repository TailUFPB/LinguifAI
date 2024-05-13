const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const child_process = require('child_process');

let flaskProcess;

const path = require('path');
const fs = require('fs');

function searchForAppExe(directory) {
    const files = fs.readdirSync(directory);

    for (const file of files) {
        const filePath = path.join(directory, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
            const found = searchForAppExe(filePath);
            if (found) {
                return found; // Return the filepath if found
            }
        } else if (file === 'app.exe') {
            return filePath; // Return the filepath if it matches 'app.exe'
        }
    }

    return null; // Return null if 'app.exe' is not found in the directory or its subdirectories
}

// Function to start the Flask process
function startFlaskProcess() {
    try {
        // Attempt to spawn the process using the original path
        const filepath = searchForAppExe(path.join(__dirname, '..', '..', '..'));

        if (filepath) {
            console.log("Path to app.exe:", filepath);
        } else {
            console.error("app.exe file not found!");
            process.exit(21);
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


