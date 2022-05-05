// YoyakuLister
// Copyright © 2022 Twist
// Licensed under MIT (https://opensource.org/licenses/mit-license.php)

const { app, Menu, BrowserWindow } = require('electron');

const isMac = (process.platform === 'darwin');
let mainWindow;

const menu = Menu.buildFromTemplate([
    ...(isMac ? [{
        label: app.name,
        submenu: [
            { role: 'about', label: `${app.name}について` },
            { type: 'separator' },
            { role: 'services', label: 'サービス' },
            { type: 'separator' },
            { role: 'hide', label: `${app.name}を隠す` },
            { role: 'hideothers', label: 'ほかを隠す' },
            { role: 'unhide', label: 'すべて表示' },
            { type: 'separator' },
            { role: 'quit', label: `${app.name}を終了` }
        ]
    }] : []),
    {
        label: 'ファイル',
        submenu: [
            isMac ? { role: 'quit', label: '終了' } : { role: 'quit', label: '終了' }
        ]
    },
    {
        label: "編集",
        submenu: [
            { label: "カット", accelerator: "CmdOrCtrl+X", selector: "cut:" },
            { label: "コピー", accelerator: "CmdOrCtrl+C", selector: "copy:" },
            { label: "ペースト", accelerator: "CmdOrCtrl+V", selector: "paste:" },
            { label: "すべて選択", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
        ]
    }
])

Menu.setApplicationMenu(menu);

function createWindow() {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        width: 680,
        height: 700,
        resizable: false,
        fullscreenable: false,
    });

    mainWindow.loadFile('index.html');

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    app.quit();
});