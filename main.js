const { app, BrowserWindow } = require("electron");
const childProcess = require("child_process");
const path = require("path");
const url = require("url");

var processes = [];

const child = childProcess.spawn("python", ["./backend/app.py"], {
  detached: false,
  stdio: "ignore",
});

processes.push(child);

function createWindow() {
  // cria a janela
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    show: false, // Ocultar a janela até que esteja pronta
    //fullscreen: true,
  });
  //win.loadURL("http://localhost:3000/"); // carrega a página hospedada localmente
  win.loadFile(path.join(__dirname, "./build/index.html")); // carrega a build do react

  /* 
  win.loadURL(
    url.format({
      pathname: path.join(__dirname, "./build/index.html"), // relative path to the HTML-file
      protocol: "file:",
      slashes: true,
    })
  );

  */

  // Quando a janela estiver pronta, maximize-a
  win.once("ready-to-show", () => {
    win.maximize();
    win.show();
  });

  win.webContents.openDevTools();

  win.on("close", () => {
    processes.forEach(function (proc) {
      // TENTA fechar o processo do python
      proc.kill();
    });
  });
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("before-quit", () => {
  // TENTA fechar o processo do python
  processes.forEach(function (proc) {
    proc.kill();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    // TENTA fechar o processo do python
    processes.forEach(function (proc) {
      proc.kill();
    });

    app.quit();
  }
});
