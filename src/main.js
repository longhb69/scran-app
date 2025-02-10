import { app, BrowserWindow, ipcMain, nativeTheme, dialog }  from "electron"
const fs = require('fs')
import path from 'node:path';
import started from 'electron-squirrel-startup';
import FileManager from "./services/fileManager"
import ExcelProcessor from "./services/excelProcessor";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      contextIsolation: true, // Ensures renderer cannot directly access Node.js APIs
      enableRemoteModule: false,
      nodeIntegration: false,
    },
    autoHideMenuBar: true
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  ipcMain.handle('upload-file', async (_, options) => {
    const result = await FileManager.uploadFile(mainWindow, options)
    console.log("Call")
    const filePath = result[0]
    const data = ExcelProcessor.extractExcelData(filePath)
    //const extractData = ExcelProcessor.extractStudent(data)
    return extractDSThiA1(data)
  })

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

function extractDSThiA1(data) {
  const extractData = ExcelProcessor.extractDSThiA1(data)
  return extractData
}

function loadStudents() {
  if(!fs.existsSync(studentsFilePath)) {
      fs.writeFileSync(studentsFilePath, JSON.stringify([]))
      return []
  }
  const data = fs.readFileSync(studentsFilePath)
  return JSON.parse(data)
}

function saveStudents(students) {
  fs.writeFileSync(studentsFilePath, JSON.stringify(students))
}

ipcMain.handle('get-students', () => {
  return loadStudents()
})

ipcMain.handle('add-student', (evnet, student) => {
  console.log("Add studnet")
  const students = loadStudents()
  students.push(student)
  saveStudents(students);
  return students
})

ipcMain.handle('delete-student', (event, id) => {
  let students = loadStudents();
  students = students.filter((student) => student.id !== id);
  saveStudents(students);
  return students;
});

ipcMain.handle('update-student', (event, updatedStudent) => {
  let students = loadStudents();
  students = students.map((student) =>
    student.id === updatedStudent.id ? updatedStudent : student
  );
  saveStudents(students);
  return students; 
});


ipcMain.handle('dark-mode:toggle', () => {
  if (nativeTheme.shouldUseDarkColors) {
    nativeTheme.themeSource = 'light'
  } else {
    nativeTheme.themeSource = 'dark'
  }
  return nativeTheme.shouldUseDarkColors
})

ipcMain.handle('dark-mode:system', () => {
  nativeTheme.themeSource = 'system'
})

ipcMain.handle('perform-ocr', async(event, imagePath) => {
  return await OCRProcessor.recognize(imagePath)
})


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
