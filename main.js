const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain, webContents } = electron;
const { send } = webContents;

let mainWindow;
let addWindow;
let outWindow;

var cardAmount = 0;
var cashAmmount  = 0; 
var onlineAmount  = 0;
var appAmount  = 0; 
var wppAmount  = 0;
var presAmount  = 0; 
var salesQuantity  = 0;

app.on('ready', () => {

    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
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
        height: 350,
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

function handleTotalAmount(channel, type, value)
{
    if(channel == 1)
    {
        appAmount += value;

        if(type == 3)
        {
            onlineAmount += value;
            salesQuantity++;
            return;
        }

    }
    else if(channel == 2)
    {
        wppAmount += value;
    }
    else
    {
        presAmount += value;
    }

    if(type == 1)
    {
        cardAmount += value;
        salesQuantity++;
    }
    else
    {
        cashAmmount += value;
        salesQuantity++;
    }
   
    return;
}

ipcMain.on('sale:add', function(e, sale)
{
    console.log(sale);
   handleTotalAmount(sale[0], sale[1], sale[2]);
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
                label: 'Saída',
                accelerator: process.platform == 'darwin' ? 'Command+S':
                'Ctrl+S'
            },
            {
                label: 'Fechar caixa',
                accelerator: process.platform == 'darwin' ? 'Command+F':
                'Ctrl+F'
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