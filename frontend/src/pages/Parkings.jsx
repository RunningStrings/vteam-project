import { useState, useEffect } from 'react';
import { useNavigate} from 'react-router-dom';



function Users() {
  const [users, setUsers] = useState([]);
  const [bikes, setBikes] = useState([]);
  const [parkings, setParkings] = useState([]);

  const navigate = useNavigate();

 
  
  useEffect(() => {
    // Fetch users from the backend API
    fetch('/users')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error));

    // Fetch bikes from the backend API
    fetch('/bikes')
      .then(response => response.json())
      .then(data => setBikes(data))
      .catch(error => console.error('Error fetching bikes:', error));

    // Fetch stations from the backend API
    fetch('/parking_zones')
      .then(response => response.json())
      .then(data => setParkings(data))
      .catch(error => console.error('Error fetching parkings:', error));


  }, []);

  return (
    <div className="App" style={{ marginLeft: "120px", padding: "20px" }}>
      <h2>Parkeringar</h2>
      <table>
      
        <thead>
          <tr>
            <th>Id</th>
            <th>Stad</th>
            <th>Position</th>
            <th>Antal cyklar nu</th>
          </tr>
        </thead>
        <tbody>
        {parkings.map((parking, index) => (
            <tr>
            <td>{index}</td>
            <td>{parking.city_name}</td>
            <td>{parking.location.coordinates}</td> 
            <td>0</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/*const Users = () => {
    return (
      <div style={{ marginLeft: "220px", padding: "20px" }}>
        <h1>Användare</h1>
        <p>Welcome to the home page.</p>
      </div>
    );
  };*/
  
  export default Users;