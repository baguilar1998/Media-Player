const electron = require('electron');
const app = electron.app;
const BroswerWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');
const Menu = electron.Menu;
const ipc = electron.ipcRenderer;

let window;

function createWindow() {
    window = new BroswerWindow({
        title:"Media Player",
        titleBarStyle:'hidden',
        width: 400,
        height:400,
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
    /**
     * Creating the menu after creating
     * the window
    const template = [
        {
            label: 'File',
            submenu:[
                {
                    label:'Add Song'
                },
                {
                    label:'Exit',
                    click: function(){
                        window.close();
                    }
                }
            ]
        },
        {
            label: 'Help'
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);*/

});
