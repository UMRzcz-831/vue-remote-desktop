import { app, Menu, Tray } from 'electron';
import { show as showMainWindow } from '../index';
import path from 'path';

let tray: Tray | null = null;
function setTray() {
  tray = new Tray(path.resolve(__dirname, './favicon.ico'));
  tray.on('click', () => {
    showMainWindow();
  });
  tray.on('right-click', () => {
    const contextMenu = Menu.buildFromTemplate([
      { label: '显示', click: showMainWindow },
      { label: '退出', click: app.quit },
    ]);
    tray?.popUpContextMenu(contextMenu);
  });
}

function setAppMenu() {
  let appMenu = Menu.buildFromTemplate([
    {
      label: app.name,
      submenu: [
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' },
      ],
    },
    { role: 'fileMenu' },
    { role: 'windowMenu' },
    { role: 'editMenu' },
  ]);
  app.applicationMenu = appMenu;
}

export { setTray, setAppMenu };
