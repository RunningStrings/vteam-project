//import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
//import "react-toastify/dist/ReactToastify.css";

//import LoginButton from "./components/LoginButton";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Trips from "./pages/Trips";
import User from "./pages/User";
//import NewUser from "./pages/NewUser";
import Maps from "./pages/Maps";
import Support from "./pages/Support";
import Payment from "./pages/Payment";
//import { useAuth0 } from "@auth0/auth0-react";

const App = () => {
    //const { isAuthenticated } = useAuth0();

    return (
        <Router>
            <div style={{ display: "flex" }}>
                <Navbar />
        
                <div style={{ flex: 1, marginLeft: "120px", padding: "20px" }}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/trips" element={<Trips />} />
                        <Route path="/user" element={<User />} />
                        <Route path="/maps" element={<Maps />} />
                        <Route path="/support" element={<Support />} />
                        <Route path="/payment" element={<Payment />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;
