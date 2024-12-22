import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Rent from "./pages/Rent";
import User from "./pages/User";
import Maps from "./pages/Maps";
import Support from "./pages/Support";


function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <div style={{ display: "flex" }}>
        <div className="bottom-nav"><Navbar /></div>
        
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/rent" element={<Rent />} />
            <Route path="/user" element={<User />} />
            <Route path="/maps" element={<Maps />} />
            <Route path="/support" element={<Support />} />
          </Routes>
        </div>
      </div>
    </Router>


  )
}

export default App
