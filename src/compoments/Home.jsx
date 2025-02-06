import { useEffect, useState } from "react";
import React from 'react';


export default function Home() {
    const [students, setStudents] = useState()
    useEffect(() => {
        console.log("Mount")
    }, [])
    const uploadFile = async () => {
        try {
            const result = await window.electronAPI.uploadFile()
            console.log(result)
            setStudents(result)
        }   catch (error) {
            console.error('Error uploading or processing file:', error);
        }
    }


    return <>
        <h1>Students Lis</h1>

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
    </>
}