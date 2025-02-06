import * as React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.js'
import "./App.css";
import Home from './compoments/Home.jsx'
import './index.css'

import { BrowserRouter, Route, Router, Routes } from 'react-router-dom'

const root = createRoot(document.body)
root.render(<App/>)