import { useEffect, useState } from "react";
//import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
//import scooterImage from '../src/assets/scooter.png';

const Home = () => {
    //const navigate = useNavigate();
    const location = useLocation();
    const [isLoggedIn, setIsLoggedIn] = useState(!!sessionStorage.getItem("token"));

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const tokenParam = queryParams.get("token");
        const roleParam = queryParams.get("role");
        const idParam = queryParams.get("id");
        const fnameParam = queryParams.get("fname");

        if (tokenParam) {
            sessionStorage.setItem("token", tokenParam);
        }
        if (roleParam) {
            sessionStorage.setItem("role", roleParam);
        }
        if (idParam) {
            sessionStorage.setItem("id", idParam);
        }
        if (fnameParam) {
            sessionStorage.setItem("firstname", fnameParam);
        }

        setIsLoggedIn(!!tokenParam);
    }, [location.search]);

    const handleLogin = () => {
        window.location.href = "http://localhost:5000/api/v1/login/?originUrl=http://localhost:1337/";
    };

    const handleLogout = () => {
        sessionStorage.clear();
        setIsLoggedIn(false);
    };


    return (
        <div style={{ marginLeft: "220px", padding: "20px" }}>
            <h2>Svenska Elsparkcyklar AB</h2>
            <br></br>
            <p>Välkommen till oss! Vi sätter jorden i rullning.</p>
            <br></br>
            <img src="./src/assets/scooter.png" width="420" height="320"></img>
            <p><button onClick={isLoggedIn ? handleLogout : handleLogin} style={{ padding: "10px 20px", fontSize: "16px" }}>
                {isLoggedIn ? "Logga ut" : "Logga in"}
            </button></p>
        </div>
    );
};
  
export default Home;














/*import { useNavigate } from 'react-router-dom';


const Home = () => {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/newuser");
  };

    return (
      <div style={{ marginLeft: "220px", padding: "20px" }}>
        <h2>Svenska Elsparkcyklar AB</h2>
        <br></br>
        <p>Välkommen till oss. Vi sätter jorden i rullning.</p>
        <br></br>
        <p><img src="../src/assets/scooter.png" width="420" height="320"></img></p>
        <p><button onClick={handleClick} className="blue-button">
      Skapa ny användare
    </button></p>
      </div>
    );
  };
  
  export default Home;*/