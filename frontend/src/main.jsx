import React from "react";
import ReactDOM from "react-dom/client";
//import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './form.css'
//import './App.css'
import './navstyle.css'
import App from './App.jsx'
import "leaflet/dist/leaflet.css"; // <- Leaflet styles

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
