const { app, WebContents, BrowserWindow } = require("electron");



//just for development, remove when build
const env = process.env.NODE_ENV || "development";
if (env === "development") {
  require("electron-reload")(__dirname, {
    electron: require(`../node_modules/electron`),
  });
}

let mainWindow;
app.on("ready", () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,
      },
  });
  mainWindow.loadFile(__dirname + "/views/index.html");
});
