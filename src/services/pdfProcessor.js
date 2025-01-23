const fs = require('fs');
import { getDocument } from 'pdfjs-dist'
import { PDFDocument } from 'pdf-lib'

class pdfProcessor {
    static async extractPdfData(filePath) {
        try {
            const fileBuffer = fs.readFileSync(filePath);
            const pdfBuffer = fs.readFileSync(filePath)
            const uint8Array = new Uint8Array(pdfBuffer);
            const pdfDoc = await getDocument(uint8Array).promise

            const extractedData = {};

            let id = null
            for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
                const page = await pdfDoc.getPage(pageNum);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map((item) => item.str).join(' ');
                const matches = pageText.match(/Số thẻ căn cước công dân \(hoặc hộ chiếu\):\s+(\d+)/)
                id = matches ? matches[1] : null,
                extractedData[id] = pageNum 
            }

            return extractedData;
        } catch (error) {
            console.error('Error reading Excel file:', error);
            return null;
        }
    }
    static async reOrderPdf(filePath, studentOrder, newOrder) {
        const filePath = 'D:/Tong Hop/228.pdf';
        const pdfBuffer = fs.readFileSync(filePath)
        const existingPdfDoc = await PDFDocument.load(pdfBuffer);

        for(let i=0; i<newOrder.length; i++) {
            const pageNum = order[newOrder[i]]
            console.log(pageNum)
            const extractedPages = await newPdf.copyPages(existingPdfDoc, [pageNum-1]);
            extractedPages.forEach((page) => {
              newPdf.addPage(page);
            });
          }

        const newPdf = await PDFDocument.create()
        const newPdfBytes = await newPdf.save();
        const outputFilePath = "D:/Tong Hop/swapped-pages.pdf"
        fs.writeFileSync(outputFilePath, newPdfBytes);
        console.log(`Pages ${1} extracted and saved to ${outputFilePath}`);
    }
}