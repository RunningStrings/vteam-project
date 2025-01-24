import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
//import scooterImage from '../src/assets/scooter.png';

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(!!sessionStorage.getItem('token'));

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenParam = queryParams.get('token');
    const roleParam = queryParams.get('role');
    const idParam = queryParams.get('id');
    const fnameParam = queryParams.get('fname');

    if (tokenParam) {
      sessionStorage.setItem('token', tokenParam);
    }
    if (roleParam) {
      sessionStorage.setItem('role', roleParam);
    }
    if (idParam) {
      sessionStorage.setItem('id', idParam);
    }
    if (fnameParam) {
      sessionStorage.setItem('firstname', fnameParam);
    }

    setIsLoggedIn(!!tokenParam);
  }, [location.search]);

  const handleLogin = () => {
    window.location.href = 'http://localhost:5000/api/v1/login/?originUrl=http://localhost:5173/';
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
        <p><button onClick={isLoggedIn ? handleLogout : handleLogin} style={{ padding: '10px 20px', fontSize: '16px' }}>
        {isLoggedIn ? 'Logga ut' : 'Logga in'}
      </button></p>
      </div>
    );
  };
  
  export default Home;



  /*import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState('');
  const [role, setRole] = useState('');
  const [id, setId] = useState('');
  const [fname, setFirstName] = useState('');
  const [lname, setLastName] = useState('');
  const [users, setUsers] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(!!sessionStorage.getItem('token'));

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenParam = queryParams.get('token');
    const roleParam = queryParams.get('role');
    const idParam = queryParams.get('id');
    const fnameParam = queryParams.get('fname');
    
    console.log(tokenParam);
    
    setToken(tokenParam);
    setRole(roleParam);
    setId(idParam);
    setFirstName(fnameParam);
    if (token) sessionStorage.setItem("token",token);
    if (role) sessionStorage.setItem("role",role);
    if (id) sessionStorage.setItem("id",id);
    if (fname) sessionStorage.setItem("firstname",firstname);
  }, [location.search]);



    const handleLogin = () => {
      //window.location.href = 'http://localhost:5173/newuser'; // URL till backend-servern
      window.location.href = 'http://localhost:5000/api/v1/login/?originUrl=http://localhost:5173/';
      //navigate('/newuser');
      setIsLoggedIn(true); // Uppdatera state
    };

  // Hantera utloggning
  const handleLogout = () => {
    //sessionStorage.removeItem('token'); // Ta bort token
    setIsLoggedIn(false); // Uppdatera state
    //window.location.href = 'http://localhost:5000/';
  };
*/