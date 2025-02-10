import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import formatTime from "../utils/fomatTime"


export default function DSA1() {
    const [value, setValue] = useState("");
    const [A1, setA1] = useState([])
    const [focusedRow, setFocusedRow] = useState(null);
    const [backspace, setBackSpace] = useState(false)

    const handleFileUpload = async (e) => {
        const files = e.target.files;

        let jsonData = null
        const transformedData = [];

        
        for (let file of files) {
            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data, { type: "buffer" });
            jsonData = XLSX.utils.sheet_to_json(
                workbook.Sheets[workbook.SheetNames[0]]
            );
        }

        let beginRead = false
        for(let i=0;i<jsonData.length;i++) {
            const row = jsonData[i]
            const keys = Object.keys(row);

            if(row[keys[0]] === "TRUNG TÂM SÁT HẠCH\n(Ký tên)  " || row[keys[1]] === "TỔ TRƯỞNG TỔ SÁT HẠCH\n(Ký tên)") break;

            if(beginRead) {
                transformedData.push({
                    stt: row[keys[1]],
                    name: row[keys[2]],
                    id: row[keys[3]],
                    dateOfBirth: row[keys[4]],
                    address: "",
                    class: row[keys[5]],
                    note: row[keys[6]],
                    check: false,
                    checkTime: null,
                });
            }
            else if (row[keys[0]] === "STT") {
                beginRead = true
                continue
            }
        }

        setA1(transformedData)
    }

    const test = async (e) => {
        e.preventDefault()
        try {
            const result = await window.electronAPI.uploadFile()
            console.log(result)
            setA1(result)
        }   catch (error) {
            console.error('Error uploading or processing file:', error);
        }
    }

    useEffect(() => {
        const matchedIndex = A1.findIndex(item => item.stt?.toString() === value);
        console.log("Match index ", matchedIndex)
        setFocusedRow(matchedIndex >= 0 ? matchedIndex : null);
        if (matchedIndex >= 0) {
            const element = document.getElementById(`row-${matchedIndex}`);
            element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [value])

    const handleChange = (event) => {
        if (backspace) {
            console.log("is backspace")
            setBackSpace(false)
            return;
        }
        updateSearchValueDebounce(event.target.value);
    };

    const updateSearchValueDebounce = debounce(query => {
        let search = A1.find((s) => s.stt === query)
        if(search) {
            console.log("find ", query)
            setValue(query);
        }
        else {
            console.log("Student not found")
            setValue(null)
        }
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

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Backspace') {
                console.log("backspace")
                setValue('')
                setBackSpace(true)
            }
            else if(event.key === 'Enter') {
                console.log(focusedRow)
                if(focusedRow || focusedRow === 0) {
                    console.log(focusedRow, A1[focusedRow])
                    const updatedA1 = [...A1]
                    updatedA1[focusedRow].check = !updatedA1[focusedRow].check
                    updatedA1[focusedRow].checkTime = updatedA1[focusedRow].checkTime ? null : formatTime(new Date());
                    setA1(updatedA1);
                }
                else {
                    console.log("Cannot check ", focusedRow)
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [focusedRow]);

    useEffect(() => {
        console.log("value state change", value)
    }, [value])


    return <div className="w-full h-full p-10">
        <input
            className=""
            multiple
            type="file"
            accept=".xlsx, .xls"
            onChange={test}
        />
        <input className="border border-2" type="text" id="fname" name="fname" onChange={handleChange}/>
        <div class="overflow-x-auto shadow-md sm:rounded-lg relative">
            <table class="w-[80%] text-sm text-left text-gray-500 relative">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 relative">
                    <tr className="relative sticky top-0 z-10">
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
                            ${item.check ? 'bg-green-100' : ''} 
                            ${focusedRow === index ? 'bg-blue-100 ring-2 ring-blue-500' : ''} 
                            cursor-pointer
                            transition-opacity duration-200 
                            hover:bg-gray-200
                        `}
                        onClick={() => {
                            setValue((index+1).toString())
                        }}
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
    </div>
}