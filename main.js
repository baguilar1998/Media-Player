const electron = require('electron');
const app = electron.app;
const BroswerWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');

let window;

function createWindow() {
    window = new BroswerWindow({title:"Media Title"});
    window.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true
    }));
   // window.webContents.openDevTools();
    window.on('closed', () =>{
        window = null;
    });
}

app.on('ready', createWindow);