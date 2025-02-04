import React, { useState } from "react";
import * as XLSX from "xlsx";


export default function Home() {
    const [students, setStudents] = useState()
    const [value, setValue] = useState("");
    const [A1, setA1] = useState([])

    const uploadFile = async () => {
        try {
            const result = await window.electronAPI.uploadFile()
            console.log(result)
            setStudents(result)
        }   catch (error) {
            console.error('Error uploading or processing file:', error);
        }
    }

    const handleFileUpload = async (e) => {
        const files = e.target.files;

        let jsonData = null
        const transformedData = [];

        
        for (let file of files) {
            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data, { type: "buffer" });
            jsonData = XLSX.utils.sheet_to_json(
                workbook.Sheets[workbook.SheetNames[1]]
            );
        }

        let beginRead = false
        for(let i=0;i<jsonData.length;i++) {
            const row = jsonData[i]

            if(row["__EMPTY_2"] === "TRUNG TÂM SÁT HẠCH\n(Ký tên)  " || row["__EMPTY_13"] === "TỔ TRƯỞNG TỔ SÁT HẠCH\n(Ký tên)") break;

            if(beginRead) {
                transformedData.push({
                    stt: row["__EMPTY_1"], 
                    name: row["__EMPTY_5"],
                    id: row["__EMPTY_11"], 
                    dateOfBirth: row["__EMPTY_15"], 
                    address: row["__EMPTY_16"], 
                    class: row["__EMPTY_25"], 
                    note: row["__EMPTY_26"], 
                    check: false,
                    checkTime: null,
                });
            }
            else if (row["__EMPTY_1"] === "STT") {
                beginRead = true
                continue
            }
        }

        console.log(transformedData)
        setA1(transformedData)
    }

    const handleChange = (event) => {
        setValue(event.target.value);
        let test = A1.find((s) => s.stt === Number(event.target.value))
        console.log("Number changed to:", test);
      };


    return <>
        <h1>Students List</h1>

        <input type="text" id="studentName" placeholder="Enter student name" />
        <input type="number" id="studentAge" placeholder="Enter student age" />
        <input type="text" id="studentGrade" placeholder="Enter student grade" />
    
        <button id="addStudentBtn">Add Student</button>
        <div id="studentsList"></div>
    
        <h1>Camera Control</h1>
        <button id="ocrButton">OCR Activate</button>
        <video id="camera" width="100" height="200"></video>
        <button id="toggleCameraBtn">Turn On Camera</button>
    
        <h1>File Upload and Excel Data Extraction</h1>
    
        <button id="uploadBtn" onClick={uploadFile}>Upload Files</button>
        <div id="fileList"></div>

        <div className="mt-10 w-full h-fit">
            <ul className="flex flex-col gap-4">
                {students && students.map((student, idx) => {
                    return <li className="flex gap-4 bg-white text-black">
                        <div>{idx+1}</div>
                        <div>{student.id}</div>
                        <div>{student.name}</div>
                        <div>{student.birhday}</div>
                        <div>{student.address}</div>
                        <div>{student.status}</div>
                    </li>     
                })}
            </ul>
        </div>
        <input
          className=""
          multiple
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
        />

        <input type="text" id="fname" name="fname" onChange={handleChange}/>

    </>
}