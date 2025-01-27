import React from "react";
//import ReactDOM from "react-dom/client";
//import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
import "./index.css";
import "./form.css";
//import './App.css'
import "./navstyle.css";
import App from "./App.jsx";
//import { apiKey, baseURL, toast } from './components/utils.jsx'
//import toast from './components/utils.jsx'
//import { Auth0Provider } from '@auth0/auth0-react';
import "leaflet/dist/leaflet.css"; // <- Leaflet styles
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);

/*<Auth0Provider
    domain='dev-7l63w0um72om0bvc.us.auth0.com'
    clientId='6ETQi0iZYDkcPwjgsvY6wqhFQcSo4dZH'
    authorizationParams={{ redirect_uri: window.location.origin }}>
  <App />
  </Auth0Provider>*/