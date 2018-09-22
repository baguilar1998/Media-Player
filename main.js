const electron = require('electron');
const app = electron.app;
const BroswerWindow = electron.BrowserWindow;
//const path = require('path');
//const url = require('url');
const dialog = electron.dialog;
const fs = require('fs');
const mm = require('musicmetadata');
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
    // window.webContents.openDevTools();
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

// Opens up the file system
ipc.on('open-file-system', function(event){
  var songData;
  dialog.showOpenDialog({
    properties: [ 'openFile' ] }, function ( filename ) {
      if(filename === undefined) {
        event.returnValue = null;
        return;
      }

      // Reads the MP3 to obtain the following information
      var readableStream = fs.createReadStream(filename.toString());
      var parser = mm(readableStream, function (err, metadata) {
        if (err) throw err;
        console.log(metadata);
        readableStream.close();
        // Returns the path of the mp3 and the following information
        event.returnValue={filePath:filename, information:metadata};
      });

    }
  );
})

//Creates the window
app.on('ready', function(){
    createWindow();
});
