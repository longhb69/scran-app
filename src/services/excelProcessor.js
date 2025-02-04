const XLSX = require("xlsx")
const fs = require('fs');


class ExcelProcessor {
    static extractExcelData(filePath) {
        try {
            const fileBuffer = fs.readFileSync(filePath);
            const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            const jsonData = XLSX.utils.sheet_to_json(sheet);

            return jsonData;
        } catch (error) {
            console.error('Error reading Excel file:', error);
            return null;
        }
    } 
    static extractStudent(data) {
        let students = []
        for(let i = 1;i < data.length - 2; i++) {
            const extractStudent = {
                name: data[i]["Sở GTVT Hòa Bình\nTrung tâm đào tạo sát hạch lái xe Chi nhánh Hòa Bì"],
                status: data[i]["Ngày mãn khóa: "],
                address: data[i]["Ngày khai giảng: "],
                id: data[i]["DANH SÁCH THÍ SINH DỰ SÁT HẠCH\n"],
                birhday: data[i]["BÁO CÁO 2\nThời gian đào tạo:  3.8 tháng"],
            }
            students.push(extractStudent)
        }
        return students
    }
    
}

module.exports = ExcelProcessor