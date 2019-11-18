// Basic init
const electron = require( 'electron' );
const path = require( 'path' );
const {PythonShell} =  require('python-shell');

const { app, BrowserWindow, crashReporter, Menu } = electron;

const isDevelopment = ( process.env.NODE_ENV === 'development' );

if ( isDevelopment ) {
  // Let electron reload by itself when webpack watches changes in ./app/
  require( 'electron-reload' )( __dirname, {
    electron: require( '${__dirname}/../../node_modules/electron' )
  } );
}

// console.log('start main process');

const userDataPath = ( electron.app || electron.remote.app ).getPath( 'userData' );

const contentPath = path.join( userDataPath, '/productions' );

global.contentPath = contentPath;


// To avoid being garbage collected
let mainWindow;
let forceQuit = false;

/**
 * Install react and redux devtools
 */
const installExtensions = async () => {
  const installer = require( 'electron-devtools-installer' );
  const extensions = [
    'REACT_DEVELOPER_TOOLS',
    'REDUX_DEVTOOLS'
  ];
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  for ( const name of extensions ) {
    try {
      await installer.default( installer[name], forceDownload );
    }
 catch ( e ) {
      console.log( `Error installing ${name} extension: ${e.message}` );
    }
  }
};

app.on( 'ready', async () => {

    // console.log('ready');
    /**
     * install devtools extensions in dev mode
     */
    if ( isDevelopment ) {
      // console.log('start installing extensions');
      await installExtensions();
      // console.log('done installing extensions');
    }

    const mainScreen = electron.screen.getPrimaryDisplay();

    mainWindow = new BrowserWindow( {
      width: mainScreen.bounds.width,
      height: mainScreen.bounds.height,
      icon: path.join( __dirname, 'assets/android-chrome-96x96.png' ),
      // Disable some stuff we don't want or need.
      webPreferences: {
        webgl: false,
        webaudio: false,
        webSecurity: false,
        nodeIntegration: true,
        nodeIntegrationInWorker: true,
        allowDisplayingInsecureContent: true,
        allowRunningInsecureContent: true,
        // preload: './app/electronBuild/bundle.js'
      }
    } );

    // console.log('start:load index');
    if ( isDevelopment ) {
      mainWindow.loadURL( `file://${__dirname}/app/electronIndex.dev.html` );
    }
    else {
      mainWindow.loadURL( `file://${__dirname}/app/electronIndex.html` );
    }
    /**
     * In development, launch directly script with python shell
     */
    // if (inDevelopment) {
    //   PythonShell.run('python_scripts/entry.py', null, function (err) {
    //     if (err) throw err;
    //     console.log('python script is finished');
    //   });
    // }
    // /**
    //  * In production, run related executable
    //  */
    // else {
      const PY_DIST_FOLDER = 'python_build'
      const PY_FOLDER = 'entry'
      const PY_MODULE = 'entry' // without .py suffix

      const getScriptPath = () => {
        if (process.platform === 'win32') {
          return path.join(__dirname, PY_DIST_FOLDER, PY_MODULE, PY_MODULE + '.exe')
        }
        return path.join(__dirname, PY_DIST_FOLDER, PY_MODULE, PY_MODULE)
      }
      let script = getScriptPath()
      let port = 5000
      let pyProc
      console.log('exec', script)
      pyProc = require('child_process').execFile(script, [port])


      if (pyProc != null) {
        console.log(script)
        console.log('child process success on port ' + port)
      }
    // }

     
    // console.log('done:load index');

    // show window once on first load
    mainWindow.webContents.once( 'did-finish-load', () => {
    // console.log('start:show main window');
      mainWindow.show();
    } );

    let loaded;

    mainWindow.webContents.on( 'did-finish-load', () => {
      // console.log('on did finish load');
      if ( !loaded ) {
        loaded = true;
      }
 else return;
      /*
       * Handle window logic properly on macOS:
       * 1. App should not terminate if window has been closed
       * 2. Click on icon in dock should re-open the window
       * 3. ⌘+Q should close the window and quit the app
       */
      if ( process.platform === 'darwin' ) {
        mainWindow.on( 'close', function ( e ) {
          if ( !forceQuit ) {
            e.preventDefault();
            mainWindow.hide();
          }
        } );

        app.on( 'activate', () => {
          /*
           * console.log('on activate');
           * console.log('start:show main window for mac');
           */
          mainWindow.show();
        } );

        app.on( 'before-quit', () => {
          // console.log('on before quit');
          forceQuit = true;
        } );
      }
 else {
        mainWindow.on( 'closed', () => {
          mainWindow = null;
        } );
      }
    } );

    if ( isDevelopment ) {
      // auto-open dev tools
      mainWindow.webContents.openDevTools();

      // add inspect element on right click menu
      mainWindow.webContents.on( 'context-menu', ( e, props ) => {
      // console.log('on context menu');

        Menu.buildFromTemplate( [ {
          label: 'Inspect element',
          click() {
            mainWindow.inspectElement( props.x, props.y );
          }
        } ] ).popup( mainWindow );
      } );
    }
 else {
      Menu.setApplicationMenu(
        Menu.buildFromTemplate(
          [
            {
              label: 'Edit',
              submenu: [
                  { label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
                  { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
                  { type: 'separator' },
                  { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
                  { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
                  { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
                  { label: 'Select All', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' }
              ]
            }
          ]
          )
        );
    }
} );

app.on( 'window-all-closed', () => {
  app.quit();
  /*
   * On OS X it is common for applications and their menu bar
   * to stay active until the user quits explicitly with Cmd + Q
   * if (process.platform !== 'darwin') {
   *   app.quit();
   * }
   */
} );

crashReporter.start( {
  productName: 'kaa',
  companyName: 'medialab',
  submitURL: 'https://github.com/medialab/kaa/issues',
  uploadToServer: false
} );

