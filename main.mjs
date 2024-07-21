import { app as electronApp, BrowserWindow } from "electron";
import path from "path";
import isDev from "electron-is-dev";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let mainWindow;
// let hiddenWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // hiddenWindow = new BrowserWindow({
  //   show: false,
  // });
  // hiddenWindow.loadURL(`file://${path.join(__dirname, "server/server.js")}`);
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "frontend/build/index.html")}`
  );

  mainWindow.on("closed", () => (mainWindow = null));
}

electronApp.on("ready", createWindow);

electronApp.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electronApp.quit();
  }
});

electronApp.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
