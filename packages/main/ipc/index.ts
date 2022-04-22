import { ipcMain } from 'electron';
import { send as sendMainWindow, send as sendControlWindow } from '../index';
import { createControlWindow } from '../control';
import signal from '../signal';

const handleIPC = () => {
  ipcMain.handle('registLocal', async () => {
    const { code } = await signal.invoke?.('registLocal', null, 'registed');
    return code.toString();
  });

  ipcMain.on('control', async (e, remoteCode) => {
    signal.send?.('control', { remote: remoteCode });
  });

  signal.on('controlled', (data) => {
    sendMainWindow('control-state-change', data.remote, 1);
    createControlWindow();
  });

  signal.on('beControlled', (data) => {
    sendMainWindow('control-state-change', data.remote, 2);
  });

  ipcMain.on('forward', async (e, event, data) => {
    signal.send?.('forward', { event, data });
  });

  signal.on('offer', (data) => {
    sendMainWindow('offer', data);
  });

  signal.on('answer', (data) => {
    sendControlWindow('answer', data);
  });

  signal.on('puppet-candidate', (data) => {
    sendControlWindow('candidate', data);
  });

  signal.on('control-candidate', (data) => {
    sendMainWindow('candidate', data);
  });
};

export default handleIPC;
