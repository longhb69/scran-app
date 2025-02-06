import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";


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

        console.log(jsonData)
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

        console.log(transformedData)
        setA1(transformedData)
    }

    useEffect(() => {
        const matchedIndex = A1.findIndex(item => item.stt?.toString() === value);
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
        console.log("scroll")
        updateSearchValueDebounce(event.target.value);
    };

    const updateSearchValueDebounce = debounce(query => {
        setValue(query);
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

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Backspace') {
                console.log("backspace")
                setValue('')
                setBackSpace(true)
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    useEffect(() => {
        console.log("backspace state change", backspace)
    }, [backspace])

    return <div className="w-full h-full">
        <input
            className=""
            multiple
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
        />
        <input className="border border-2" type="text" id="fname" name="fname" onChange={handleChange}/>
        <div class="overflow-x-auto shadow-md sm:rounded-lg relative">
            <table class="w-full text-sm text-left text-gray-500 relative">
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
                            ${focusedRow === index ? 'bg-blue-200 ring-2 ring-blue-500' : ''}
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
    </div>
}