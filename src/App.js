import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import Navbar from "./compoments/Navbar";
import Home from "./compoments/Home.jsx";
import DSA1 from "./page/DSA1";
import React from 'react';


export default function App() {
    return (
        <Router>
            <div className="flex h-screen w-full gap-10">
                <Navbar/>
                <Routes>
                    <Route path="/dsA1" element={<DSA1 />} />
                </Routes>
            </div>
        </Router>
    );
}