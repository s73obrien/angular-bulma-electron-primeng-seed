import { app, BrowserWindow } from 'electron';
import { join } from 'path';
import { format } from 'url';

class ElectronApplication {

  // Singleton pattern per (in comments):
  // https://stackoverflow.com/questions/30174078/how-to-define-singleton-in-typescript
  private static instance: ElectronApplication;

  // Handle to main window
  public window: BrowserWindow;

  constructor() {
    // if we already have an object created, return that instead
    if (ElectronApplication.instance)
      return ElectronApplication.instance;

    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    app.on('ready', this.createWindow);

    // Quit when all windows are closed.
    app.on('window-all-closed', () => {
      // On OS X it is common for applications and their menu bar
      // to stay active until the user quits explicitly with Cmd + Q
      if (process.platform !== 'darwin') {
        app.quit();
      }
    })

    app.on('activate', () => {
      // On OS X it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (this.window === null) {
        this.createWindow();
      }
    })

    // Store the current instance in the static class instance
    ElectronApplication.instance = this;
  }

  createWindow() {
    // Create the browser window
    this.window = new BrowserWindow({
      width: 800,
      height: 800,
      show: false,
      center: false      
    });

    // Showing the window gracefully
    // https://github.com/electron/electron/blob/master/docs/api/browser-window.md
    this.window.once('ready-to-show', () => {
      this.window.show();
    })

    // Emitted when the window is closed
    this.window.on('closed', () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      this.window = null;
    })

    // Load the main index.html
    this.window.loadURL(
      format({
        pathname: join(process.cwd(), 'dist/index.html'),
        protocol: 'file',
        slashes: true
      })
    )

    // Open the DevTools.
    if (process.env.NODE_ENV !== 'production')
      this.window.webContents.openDevTools();
  }
}

const Application = new ElectronApplication();
export default Application;