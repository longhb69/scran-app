import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";


export default function Home() {
    const [students, setStudents] = useState()
    const [value, setValue] = useState("");
    const [A1, setA1] = useState([])
    const [searchSTT, setSearchSTT] = useState('');
    const [focusedRow, setFocusedRow] = useState(null);



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
        updateSearchValueDebounce(event.target.value);
        setSearchSTT(value);        
    };

    useEffect(() => {
        console.log("Value change", value)
        const matchedIndex = A1.findIndex(item => item.stt?.toString() === value);
        setFocusedRow(matchedIndex >= 0 ? matchedIndex : null);
        if (matchedIndex >= 0) {
            console.log(matchedIndex)
            const element = document.getElementById(`row-${matchedIndex}`);
            element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [value])

    const updateSearchValueDebounce = debounce(query => {
        setValue(query);
        console.log("serach", query)
        let test = A1.find((s) => s.stt === Number(query))
    })

    function debounce(cb, delay=100) {
        let timeout

        return(...args) => {
            clearTimeout(timeout)
            timeout = setTimeout(() => {
                cb(...args)
            }, delay)
        }
    }

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

        <input className="border border-2" type="text" id="fname" name="fname" onChange={handleChange}/>
        <div class="overflow-x-auto shadow-md sm:rounded-lg">
            <table class="w-full text-sm text-left text-gray-500">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" class="px-6 py-3">STT</th>
                        <th scope="col" class="px-6 py-3">Name</th>
                        <th scope="col" class="px-6 py-3">ID</th>
                        <th scope="col" class="px-6 py-3">Date of Birth</th>
                        <th scope="col" class="px-6 py-3">Address</th>
                        <th scope="col" class="px-6 py-3">Class</th>
                        <th scope="col" class="px-6 py-3">Note</th>
                        <th scope="col" class="px-6 py-3">Check Status</th>
                        <th scope="col" class="px-6 py-3">Check Time</th>
                    </tr>
                </thead>
                <tbody id="tableBody">
                    {A1.length > 1 && A1.map((item, index) => (
                        <tr 
                        key={item.id || index} 
                        id={`row-${index}`}
                        className={`
                            ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                            ${focusedRow === index ? 'bg-blue-100 ring-2 ring-blue-500' : ''}
                            border-b hover:bg-gray-100 transition-all duration-200
                          `}
                        >
                        <td className="px-6 py-4">{item.stt}</td>
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                            {item.name}
                        </td>
                        <td className="px-6 py-4">{item.id}</td>
                        <td className="px-6 py-4">{item.dateOfBirth}</td>
                        <td className="px-6 py-4">{item.address}</td>
                        <td className="px-6 py-4">{item.class}</td>
                        <td className="px-6 py-4">{item.note}</td>
                        <td className="px-6 py-4">
                            <span 
                            className={`${
                                item.check 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            } text-xs font-medium px-2.5 py-0.5 rounded`}
                            >
                            {item.check ? 'Checked' : 'Unchecked'}
                            </span>
                        </td>
                        <td className="px-6 py-4">{item.checkTime}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </>
}