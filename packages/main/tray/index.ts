if (process.platform === 'darwin') {
  require('./darwin');
} else if (process.platform === 'win32') {
  require('./win32.ts');
} else {
  // 不处理
}
