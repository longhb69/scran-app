const fs = require("fs")
const {dialog} = require('electron');
const ExcelProcessor = require("./excelProcessor");

class FileManager {
    static async uploadFile(win, options = {}) {
        const defaultOptions = {
            title: 'Select a file',
            buttonLabel: 'Select',
            properties: ['openFile'],
            filters: [
              { name: 'All Files', extensions: ['*'] },
            ],
        };
        const dialogOptions = { ...defaultOptions, ...options };

        const result = await dialog.showOpenDialog(win, dialogOptions)

        if(result.canceled) {
            return [];
        }

        return result.filePaths;
    }

    static extractExcelData(filePath) {
        const data = ExcelProcessor.extractExcelData(filePath)
        return data
    } 
}

module.exports = FileManager;