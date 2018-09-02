const electron = require('electron');
const app = electron.app;
const BroswerWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');
const dialog = electron.dialog;
const fs = require('fs');
const ipc = electron.ipcMain;

let window;

function createWindow() {
    window = new BroswerWindow({
        title:"Media Player",
        titleBarStyle:'hidden',
        width: 450,
        height:450,
        frame:false,
        backgroundColor: '#222222',
        resizable:false,
        icon: `file://${__dirname}/dist/media-player/assets/main_icon.PNG`
    });

    window.loadURL(`file://${__dirname}/dist/media-player/index.html`);
    //window.webContents.openDevTools();
    window.on('closed', () =>{
        window = null;
    });
}

// Closes the window
ipc.on('close_window',function(event){
  window.close();
});

// Minmizes the window
ipc.on('minimize', function(event){
  window.minimize();
});

ipc.on('open-file-system', function(event){
  dialog.showOpenDialog({
    properties: [ 'openFile' ] }, function ( filename ) {
      console.log( filename.toString() );
      event.returnValue=filename;
    }
  );
})
/**
 * ipc.on('event_name', function(event){
 *  Have a function arguement to tell the main
 *  process what to do when the render process
 *  sends for a request
 *
 *  To send back a response you write
 *  the event name must be the same
 *  event.sender.send('event_name', response);
 * })
 */

 /**
  * To active ipc on the render process you write this code
  *
  * import electron and the ipc
  *
  * HTML.addEventListener('click',function(){
  *     ipc.send('event_name');
  * });
  *
  * ipc.on('event_name',function(event,arg){
  *     the argument is the response
  *     console.log(arg);
  * });
  */

app.on('ready', function(){
    createWindow();
});
