// const Tesseract = require('tesseract.js');

// const startTime = process.hrtime();
// const initialMemory = process.memoryUsage().heapUsed;

// Tesseract.recognize(
//   'C:/Users/hai/Desktop/Capture.JPG', // Path to the image with Vietnamese text
//   'vie',                         // Specify 'vie' for Vietnamese
//   {
//     logger: (info) => console.log(info), // Optional: track progress
//   }
// ).then(({ data: { text } }) => {
//     const endTime = process.hrtime(startTime);
//     const finalMemory = process.memoryUsage().heapUsed;
//     console.log(text)

//     const birthdayMatch = text.match(/Sinh ngày (\d{2}) tháng (\d{2}) năm (\d{4})/);
//     const identityIdMatch = text.match(/Số thẻ căn cước công dân \(hoặc hộ chiều\): (\d+)/);

//     const extractedData = {
//       birthday: birthdayMatch ? `${birthdayMatch[1]}/${birthdayMatch[2]}/${birthdayMatch[3]}` : 'Not found',
//       identityId: identityIdMatch ? identityIdMatch[1] : 'Not found',
//     };
    
//     console.log('Extracted Data:', extractedData);
// }).catch((error) => {
//   console.error('Error:', error);
// });

import fs from 'fs'
import { getDocument } from 'pdfjs-dist'
import { PDFDocument } from 'pdf-lib'

const extractDatawithRegex = async (filePath, regex) => {
  const pdfBuffer = fs.readFileSync(filePath)
  const uint8Array = new Uint8Array(pdfBuffer);
  const pdfDoc = await getDocument(uint8Array).promise

  const extractedData = {};

  let id = null
  for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
    const page = await pdfDoc.getPage(pageNum);
    const textContent = await page.getTextContent();

    // Extract plain text from the page
    const pageText = textContent.items.map((item) => item.str).join(' ');
    const matches = pageText.match(/Số thẻ căn cước công dân \(hoặc hộ chiếu\):\s+(\d+)/)
    // Match with regex
    id = matches ? matches[1] : null,
    extractedData[id] = pageNum 
  }

  return extractedData;
}

const test = async (studentPage, order, newOrder) => {
  const filePath = 'D:/Tong Hop/228.pdf';
  const pdfBuffer = fs.readFileSync(filePath)
  const existingPdfDoc = await PDFDocument.load(pdfBuffer);

  const newPdf = await PDFDocument.create()

  for(let i=0; i<newOrder.length; i++) {
    const pageNum = order[newOrder[i]]
    console.log(pageNum)
    const extractedPages = await newPdf.copyPages(existingPdfDoc, [pageNum-1]);
    extractedPages.forEach((page) => {
      newPdf.addPage(page);
    });
  }

  const newPdfBytes = await newPdf.save();
  const outputFilePath = "D:/Tong Hop/swapped-pages.pdf"
  fs.writeFileSync(outputFilePath, newPdfBytes);
  console.log(`Pages ${1} extracted and saved to ${outputFilePath}`);

}

const filePath = 'D:/Tong Hop/228.pdf';
const regex = /Số thẻ căn cước công dân \(hoặc hộ chiều\): (\d+)/;
const order = {
  "001096005846": 1,
  "017197005438": 2,
  "017078000570": 3
}

const newOrder = ["017078000570", "001096005846", "017197005438"]

extractDatawithRegex(filePath, regex).then((result) => {
  test(result, order, newOrder)
}).catch((err) => console.error("Error:", err));

