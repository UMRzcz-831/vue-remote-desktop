import electron, { app, BrowserWindow, shell } from 'electron';
import { release, hostname, platform, version, userInfo } from 'os';
import { join, resolve } from 'path';
import handleIPC from './ipc';
import Robot from './robot';
import { setTray } from './tray/win32';
// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.name);

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

let win: BrowserWindow | null = null;
let willQuit = false;
async function createWindow() {
  win = new BrowserWindow({
    title: 'Main window',
    width: 1024,
    height: 576,
    resizable: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.cjs'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (app.isPackaged) {
    win.loadFile(join(__dirname, '../renderer/index.html'));
  } else {
    // 🚧 Use ['ENV_NAME'] avoid vite:define plugin
    const url = `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}`;

    win.loadURL(url);
    win.webContents.openDevTools();

  }

  // Communicate with the Renderer-process.
  win.webContents.on('ipc-message', (_, channel, ...args) => {
    switch (channel) {
      case 'app.getPath':
        win?.webContents.send('app.getPath', app.getPath(args[0]));
        break;
      default:
        break;
    }
  });

  win.on('close', (e) => {
    console.log('close', willQuit);
    if (willQuit) {
      win = null;
    } else {
      e.preventDefault();
      win?.hide();
    }
  });

  // // Test active push message to Renderer-process
  // win.webContents.on('did-finish-load', () => {
  //   win?.webContents.send('main-process-message', new Date().toLocaleString());
  // });

  // // Make all links open with the browser, not with the application
  // win.webContents.setWindowOpenHandler(({ url }) => {
  //   if (url.startsWith('https:')) shell.openExternal(url);
  //   return { action: 'deny' };
  // });
}

app.applicationMenu = null;

app.on('ready', async () => {
  // let uri = resolve(process.cwd(), './devtools-6.1.4/shell-chrome');
  // try {
  //   await electron.session.defaultSession.loadExtension(uri, {
  //     allowFileAccess: true,
  //   });
  // } catch (e) {
  //   console.log('Failed to load chrome devtools');
  // }
  Robot();
  handleIPC();
  setTray();
  await createWindow();
});
// app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  win = null;
  if (process.platform !== 'darwin') app.quit();
});

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on('activate', () => {
  // const allWindows = BrowserWindow.getAllWindows();
  // if (allWindows.length) {
  //   allWindows[0].focus();
  // } else {
  //   createWindow();
  // }
  show();
});

app.on('before-quit', () => {
  close();
});

export const send = (channel: string, ...args: any[]) => {
  win?.webContents.send(channel, ...args);
};

const close = () => {
  willQuit = true;
  win?.close();
};

export const show = () => {
  if (win?.isMinimized()) win.restore();
  win?.show();
};
