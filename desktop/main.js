const { ipcMain, Notification, app, BrowserWindow, screen } = require("electron");
const path = require("path");
const axios = require("axios");
const { Menu, Tray } = require("electron");
let mainWindow;
let tray = null;

function createWindow() {

    // check if a window is already open
    if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.show();
    return;
    }
  mainWindow = new BrowserWindow({
    icon: path.join(__dirname, 'icon.ico'), // app icon
    useContentSize: true,
    autoHideMenuBar: true,
    title: "QBit",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadURL("http://localhost:5173");

  //when user tries to close the app
// Quando o usuário tenta fechar a janela
  mainWindow.on('close', (event) => {
    event.preventDefault(); // prevent closing the window
    mainWindow.hide();      // hide the window app
  });
}

//create hidden tray icon
function createTray() {
  tray = new Tray(path.join(__dirname, 'icon.png')); // coloque um ícone seu
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Mostrar QBit',
      click: () => {
        mainWindow.show();
      },
    },
    {
      label: 'Sair',
      click: () => {
        tray.destroy(); // limpa a tray
        app.quit();     // encerra o app
      },
    },
  ]);

  tray.setToolTip('QBit está em segundo plano');
  tray.setContextMenu(contextMenu);

  // Clique duplo reabre a janela
  tray.on('double-click', () => {
    mainWindow.show();
  });
}


// //pop-up notification
function showNotificationWindow(data) {
  const { x: screenX, y: screenY, width: screenWidth, height: screenHeight } =
    screen.getPrimaryDisplay().workArea;

  const notifWidth = 370;
  const notifHeight = 170;

  const notifWin = new BrowserWindow({
    useContentSize: true,
    icon: path.join(__dirname, 'icon.png'), // app icon
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
    title: "QBit",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  notifWin.loadURL(
    `http://localhost:5173/notification?data=${encodeURIComponent(JSON.stringify(data))}`
  );

  // ⏱️ Fechamento com segurança
  const timeout = setTimeout(() => {
    if (!notifWin.isDestroyed()) notifWin.close();
  }, 10000);

  notifWin.on("closed", () => {
    clearTimeout(timeout);
  });
}

// 🔁 Background loop
function startBackgroundLoop() {
  const INTERVAL = 0.05 * 60 * 1000; // 3 segundos para testes

  setInterval(async () => {
    try {
      const prefs = await axios.get("http://localhost:8080/preferences");

      if (!prefs.data || prefs.data.length === 0) {
        console.log("[BackgroundLoop] No preferences found.");
        return;
      }

      for (const pref of prefs.data) {
        const last = pref.lastNotifiedAt || 0;
        const next = last + pref.interval;
        const currentDate = Date.now();

        if (currentDate >= next) {
          console.log("FIRE POPUP");

          const question = await axios.get(
            `http://localhost:8080/preferences/${pref.id}/random-question`
          );

          await axios.put("http://localhost:8080/preferences", {
            id: pref.id,
            moduleName: pref.moduleName,
            interval: pref.stringInterval,
            subjectId: pref.subjectId,
            moduleId: pref.moduleId,
            lastNotifiedAt: currentDate,
          });

          showNotificationWindow(question.data);
        }
      }
    } catch (err) {
      console.error("[BackgroundLoop]", err.message);
    }
  }, INTERVAL);
}

// 🔄 Redirecionamento da notificação para o app
ipcMain.on("navigate-to", (event, url) => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.show();
    mainWindow.focus();
    mainWindow.webContents.send("navigate-to", url);
  }
});

app.whenReady().then(() => {
  createWindow();
  startBackgroundLoop();
  createTray();
});


// if there are no windows, create one to open the app
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});