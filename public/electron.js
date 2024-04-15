const { app, BrowserWindow } = require("electron");
const childProcess = require("child_process");
const path = require("path");
const url = require("url");
const axios = require("axios");

let flaskServerProcess;

function installDependencies() {
  // Execute pip install command to install dependencies from requirements.txt
  const requirementsPath = process.env.ELECTRON_START_URL
    ? "./api/requirements.txt"
    : "./api/requirements.txt";
  childProcess.execSync(`pip install -r ${requirementsPath}`, {
    stdio: "inherit",
  });
}

function startFlaskServer() {
  installDependencies();

  const pythonPath = process.env.ELECTRON_START_URL
    ? "./api/app.py"
    : "./api/app.py";

  flaskServerProcess = childProcess.spawn("python", [pythonPath], {
    detached: false,
    stdio: ["ignore", "pipe", "pipe"],
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
  // flaskServerProcess
  win.webContents.executeJavaScript(
    `console.log("startUrl: ${flaskServerProcess.pid}")`
  );

  const startUrl =
    process.env.ELECTRON_START_URL ||
    url.format({
      pathname: path.join(__dirname, "./index.html"),
      protocol: "file:",
      slashes: true,
    });

  win.loadURL(startUrl);

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
