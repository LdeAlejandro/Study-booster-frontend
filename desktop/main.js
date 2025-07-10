const { Notification, app, BrowserWindow, screen } = require('electron');
const path = require('path');

//
function createWindow() {
  const win = new BrowserWindow({
     useContentSize: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.loadURL('http://localhost:5173');
}

function showNotificationWindow(data) {

  //get current screen dimensions
  const { x: screenX, y: screenY, width:screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workArea;

 
   const notifWidth = 370;
  const notifHeight = 170;

  const notifWin = new BrowserWindow({
     useContentSize: true,
    width: 350,
    height: 150,
    frame: false,
    alwaysOnTop: true,
    transparent: false,
    autoHideMenuBar: true,
    skipTaskbar: true,
    resizable: false,
    x: screenX + screenWidth - notifWidth, 
    y: screenY + screenHeight - notifHeight,
    title: '',

    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

   notifWin.loadURL(`http://localhost:5173/notification?data=${encodeURIComponent(JSON.stringify(data))}`);

  //setTimeout(() => notifWin.close(), 10000);
}





app.whenReady().then(() => {

  createWindow();

  //notification
  const mockData = {
    question: "Qual é a capital da França?",
    options: [
      { option: "Paris" },
      { option: "Londres" },
      { option: "Berlim" }
    ],
    source_name: "Geografia 1"
  };

  showNotificationWindow(mockData); // <- isso renderiza a página
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});