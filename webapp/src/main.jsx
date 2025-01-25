import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./style/navigation.css";
import "./style/buttons.css";
import App from "./App.jsx";
import "./style/leaflet.css"; // <- Leaflet styles
import "./style/form.css";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
