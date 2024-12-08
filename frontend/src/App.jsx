import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Bikes from "./pages/Bikes";
import Users from "./pages/Users";
import User from "./pages/User";
import Maps from "./pages/Maps";
import Support from "./pages/Support";
import Settings from "./pages/Settings";

const App = () => {
  return (
    <Router>
      <div style={{ display: "flex" }}>
        <Navbar />
        <div style={{ flex: 1, marginLeft: "120px", padding: "20px" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/bikes" element={<Bikes />} />
            <Route path="/users" element={<Users />} />
            <Route path="/user" element={<User />} />
            <Route path="/maps" element={<Maps />} />
            <Route path="/support" element={<Support />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App
