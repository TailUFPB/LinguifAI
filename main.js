const { app, BrowserWindow } = require("electron");
const childProcess = require("child_process");
const path = require("path");
const axios = require("axios");
const url = require("url");

var processes = [];

/*
const child = childProcess.spawn("python", ["./api/app.py"], {
  detached: false,
  stdio: "ignore",
});

processes.push(child);
*/
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

  win.on("close", () => {});
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("before-quit", () => {});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    //console.log("Fechando")
    axios.get("http://127.0.0.1:5000/shutdown").then(response => {

    }).catch(error => {

    })
    setTimeout(() => {
      app.quit();
    }, 2000);

  }
});
