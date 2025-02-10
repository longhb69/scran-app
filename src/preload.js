// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('darkMode', {
  toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
  system: () => ipcRenderer.invoke('dark-mode:system'),
})

contextBridge.exposeInMainWorld('electronAPI', {
  getStudents: () => ipcRenderer.invoke('get-students'),
  addStudent: (student) => ipcRenderer.invoke('add-student', student),
  deleteStudent: (id) => ipcRenderer.invoke('delete-student', id),
  updateStudent: (updatedStudent) => ipcRenderer.invoke('update-student', updatedStudent),
  performOCR: (imagePath) => ipcRenderer.invoke('perform-ocr', imagePath),
  uploadFile: () => ipcRenderer.invoke('upload-file'),
  
})
