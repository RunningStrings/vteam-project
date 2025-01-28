//import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
//import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Bikes from "./pages/Bikes";
import Bike from "./pages/Bike";
import Parkings from "./pages/Parkings";
import Stations from "./pages/Stations";
import Users from "./pages/Users";
import User from "./pages/User";
import Maps from "./pages/Maps";
import Support from "./pages/Support";

let token=sessionStorage.getItem("token");

// Skyddad Route-komponent
const ProtectedRoute = ({ children }) => {
    return token ? children : <Navigate to="/" />;
};


const App = () => {
    //const { isAuthenticated } = useAuth0();
  

    return (
        <Router>
            <div style={{ display: "flex" }}>
                <Navbar />
        
                <div style={{ flex: 1, marginLeft: "120px", padding: "20px" }}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/bikes" element={<Bikes />} />
                        <Route path="/bike" element={<Bike />} />
                        <Route path="/stations" element={<Stations />} />
                        <Route path="/parkings" element={<Parkings />} />
                        <Route path="/users" element={
                            <ProtectedRoute>
                                <Users />
                            </ProtectedRoute>
                        } />
                        <Route path="/user" element={<User />} />
                        <Route path="/maps" element={<Maps />} />
                        <Route path="/support" element={<Support />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;
