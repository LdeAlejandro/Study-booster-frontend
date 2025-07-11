const { Notification, app, BrowserWindow, screen } = require("electron");
const path = require("path");

const axios = require("axios");

//
function createWindow() {
  const win = new BrowserWindow({
    useContentSize: true,
    autoHideMenuBar: true,
    title: "QBit",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadURL("http://localhost:5173");
}

// notification popup
function showNotificationWindow(data) {
  //get current screen dimensions
  const {
    x: screenX,
    y: screenY,
    width: screenWidth,
    height: screenHeight,
  } = screen.getPrimaryDisplay().workArea;

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
    title: "QBit",

    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  notifWin.loadURL(
    `http://localhost:5173/notification?data=${encodeURIComponent(
      JSON.stringify(data)
    )}`
  );

  setTimeout(() => notifWin.close(), 10000);
}

// 🔁 Background loop
function startBackgroundLoop() {
  const INTERVAL = 0.05 * 60 * 1000; //

  setInterval(async () => {
    try {
      const prefs = await axios.get("http://localhost:8080/preferences"); // get all preferences

      if (!prefs.data || prefs.data.length === 0) {
        console.log("[BackgroundLoop] No preferences found.");
        return;
      }

      for (const pref of prefs.data) {

        // store last notified time and interval
        const last = pref.lastNotifiedAt || 0;
        const next = last + pref.interval;
        const currentDate = Date.now();

        if (currentDate >= next) {
          console.log("FIRE POPUP ");

          // get random question for the preference
          const question = await axios.get(
            `http://localhost:8080/preferences/${pref.id}/random-question`
          );

          //update interval
          await axios.put("http://localhost:8080/preferences", {
            id: pref.id,
            label: pref.label,
            interval: pref.stringInterval, // enum esperado pelo backend
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

app.whenReady().then(() => {
  createWindow();
  startBackgroundLoop();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
