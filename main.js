const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain, webContents } = electron;
const { send } = webContents;

// to set devtools, change for 'development'
process.env.NODE_ENV = 'production';

let mainWindow;
let addWindow;

app.on('ready', () => {

    mainWindow = new BrowserWindow({
        width: 900,
        height: 580,
        webPreferences:{
            nodeIntegration: true,
        }
    });

    mainWindow.loadFile('mainWindow.html');

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file', 
        slashes: true
    }));

    mainWindow.on('closed', () => {
        app.quit();
    });

    const mainMenu = Menu.buildFromTemplate(mainMenuTemp);

    Menu.setApplicationMenu(mainMenu);

});


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

    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    addWindow.on('close', () => {
        addWindow = null;
    });
}


var total = 0;

ipcMain.on('sale:add', function(e, sale)
{
    //0 => channel
    //1 => payment type
    //2 => payment value
   total = total + 1;
   sale.push(total);
   console.log(sale);
   //3 => sales number
   mainWindow.webContents.send('sale:add', sale);
   addWindow.close();
});

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
                //if some_condition ?  code
                //else : code
                accelerator: process.platform == 'darwin' ? 'Command+Q':
                'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    }
];

if(process.platform == 'darwin')
{
    mainMenuTemp.unshift({});
}

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
