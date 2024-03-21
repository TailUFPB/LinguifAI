const { app, BrowserWindow } = require("electron");
const childProcess = require("child_process");
const path = require("path");
const axios = require("axios");

let flaskServerProcess;

function installDependencies() {
  // Execute pip install command to install dependencies from requirements.txt
  childProcess.execSync("pip install -r ./resources/app/requirements.txt", { stdio: "inherit" });
}

function startFlaskServer() {
  installDependencies();

  flaskServerProcess = childProcess.spawn("python", ["./resources/app/api/app.py"], {
    detached: false,
    stdio: ["ignore", "pipe", "pipe"], // Capture stdout and stderr
  });

  // Capture stdout
  flaskServerProcess.stdout.on("data", (data) => {
    console.log(`Flask server stdout: ${data}`);
  });

  // Capture stderr
  flaskServerProcess.stderr.on("data", (data) => {
    console.error(`Flask server stderr: ${data}`);
  });

  flaskServerProcess.on("error", (err) => {
    console.error("Error starting Flask server:", err);
  });

  flaskServerProcess.on("close", (code) => {
    console.log("Flask server exited with code", code);
  });
}

function shutdownFlaskServer() {
  if (flaskServerProcess) {
    flaskServerProcess.kill();
    flaskServerProcess = null;
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
  });

  win.loadFile(path.join(__dirname, "./build/index.html"));

  win.once("ready-to-show", () => {
    win.maximize();
    win.show();
  });

  win.webContents.openDevTools();

  win.on("close", () => {
    shutdownFlaskServer();
  });
}

app.whenReady().then(() => {
  startFlaskServer();
  createWindow();
  
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("before-quit", () => {
  shutdownFlaskServer();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
