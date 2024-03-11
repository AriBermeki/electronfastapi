const electron = require("electron");
const utils =  require('@electron-toolkit/utils')
const path = require('node:path')
const { spawn, execFile } = require("child_process");

electron.app.allowRendererProcessReuse = true;
const icon = path.join(__dirname, './favicon.ico')
let mainWindow = null;
let pythonProcess = null;

const PY_HOST = "127.0.0.1";
const PY_PORT = 8000;
const PY_LOG_LEVEL = "info";


// Generate a random a SECRET_TOKEN used for communication with Python server
function generateHexString(length) {
  return [...Array(length)]
    .map(() => (~~(Math.random() * 36)).toString(36))
    .join("");
}
const SECRET_TOKEN_LENGTH = 64;
const SECRET_TOKEN = generateHexString(SECRET_TOKEN_LENGTH);

// Conditionally include the dev tools installer to load React Dev Tools
let installExtension, REACT_DEVELOPER_TOOLS;


if (utils.is.dev) {
  const devTools = require("electron-devtools-installer");
  installExtension = devTools.default;
  REACT_DEVELOPER_TOOLS = devTools.REACT_DEVELOPER_TOOLS;
}


function launchPython() {
  if (utils.is.dev) {
    pythonProcess = spawn("python", [
      ".\\py\\main.py",
      "--host",
      PY_HOST,
      "--port",
      PY_PORT,
      "--log-level",
      PY_LOG_LEVEL,
      "--secret",
      SECRET_TOKEN,
    ]);
    console.log("Python process started in dev mode");
  } else {
    pythonProcess = execFile(
      path.join(__dirname, "..\\..\\..\\py_dist\\main\\main.exe"),
      [
        "--host",
        PY_HOST,
        "--port",
        PY_PORT,
        "--log-level",
        PY_LOG_LEVEL,
        "--secret",
        SECRET_TOKEN,
      ]
    );
    console.log("Python process started in built mode");
  }
  return pythonProcess;
}

const createWindow = () => {
  mainWindow = new electron.BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    //frame:false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: path.join(__dirname, './preload.js'),
      sandbox: false
    }
  });

  mainWindow.on('ready-to-show', () => mainWindow.show());

  mainWindow.webContents.setWindowOpenHandler((details) => {
    electron.shell.openExternal(details.url);
    return { action: 'deny' };
  });

  if (utils.is.dev) {
    mainWindow.loadURL("http://127.0.0.1:3000")
  } else {
    mainWindow.loadFile(path.join(__dirname, "../build/index.html"))
  }

  if (utils.is.dev) {
    mainWindow.webContents.openDevTools({ mode: "detach" });
  }
};

electron.app.whenReady().then(() => {
  if (utils.is.dev) {
    installExtension(REACT_DEVELOPER_TOOLS)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((error) => console.log(`An error occurred: , ${error}`));
  }

    utils.electronApp.setAppUserModelId('com.electron');
  
    electron.app.on('browser-window-created', (_, window) => utils.optimizer.watchWindowShortcuts(window));
  
    electron.ipcMain.on('ping', () => console.log('pong'));
    launchPython()
    createWindow();
    electron.app.on('activate', () => {
      if (electron.BrowserWindow.getAllWindows().length === 0) createWindow();
      launchPython()
      createWindow();
    });
  });

  electron.app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    electron.app.quit();
  }
});

electron.ipcMain.on('minimize', () => mainWindow.minimize());

electron.ipcMain.on('maximize', () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});

electron.ipcMain.on('close', () => {
  console.log('Close window event received');
  mainWindow.destroy();
});
