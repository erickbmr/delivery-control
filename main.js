const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain, webContents } = electron;
const { send } = webContents;

// to set devtools, change for 'development'
process.env.NODE_ENV = 'production';

let mainWindow;
let addWindow;

// open main window
app.on('ready', () => {

    mainWindow = new BrowserWindow({
        width: 900,
        height: 580,
        webPreferences:{
            nodeIntegration: true,
        }
    });
    
    // load main html
    mainWindow.loadFile('mainWindow.html');

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file', 
        slashes: true
    }));

    //when press 'x', all quit
    mainWindow.on('closed', () => {
        app.quit();
    });

    // build menu
    const mainMenu = Menu.buildFromTemplate(mainMenuTemp);

    Menu.setApplicationMenu(mainMenu);

});

function createOutputWindow()
{
    //TODO
}

// create window for input 
function createInputWindow()
{
    addWindow = new BrowserWindow({
        width: 250,
        height: 270,
        webPreferences:{
            nodeIntegration: true,
        },
        title: 'Entrada'
    });

    // load input window html
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    addWindow.on('close', () => {
        addWindow = null;
    });
}

// var for sum all sales
var total = 0;

// sale event
ipcMain.on('sale:add', function(e, sale)
{
   total = total + 1;
   sale.push(total);
   mainWindow.webContents.send('sale:add', sale);
   addWindow.close();
    //sale array
    //[0] => channel
    //[1] => payment type
    //[2] => payment value
    //[3] => sales number

});

// create main menu (top bar)
const mainMenuTemp = [
    {
        label: 'Registrar',
        submenu: [
            {
                label: 'Entrada',
                accelerator: process.platform == 'darwin' ? 'Command+E':
                'Ctrl+E',
                click(){
                    createInputWindow();
                }
            },
            {
                label: 'Sair',
                accelerator: process.platform == 'darwin' ? 'Command+Q':
                'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    }
];

//set settings for mac plataform
if(process.platform == 'darwin')
{
    mainMenuTemp.unshift({});
}

//activate devtools out of production
if(process.env.NODE_ENV !== 'production')
{
    mainMenuTemp.push({
        label: 'DevTools',
        submenu:[
            {
                label: 'Toggle Dev',
                click(item, focusedWindow)
                {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    });
}
