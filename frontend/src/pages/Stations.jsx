import { useState, useEffect } from 'react';
import { useNavigate} from 'react-router-dom';



function Users() {
  const [users, setUsers] = useState([]);
  const [bikes, setBikes] = useState([]);
  const [stations, setStations] = useState([]);

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
    fetch('/charging_stations')
      .then(response => response.json())
      .then(data => setStations(data))
      .catch(error => console.error('Error fetching stations:', error));


  }, []);

  return (
    <div className="App" style={{ marginLeft: "220px", padding: "20px" }}>
      <h2>Stationer</h2>
      <table>
      
        <thead>
          <tr>
            <th>Id</th>
            <th>Namn</th>
            <th>Stad</th>
            <th>Position</th>
            <th>Kapacitet</th>
          </tr>
        </thead>
        <tbody>
        {stations.map((station, index) => (
            <tr>
            <td>{index}</td>
            <td>Björkgatan</td>
            <td>{station.city_id}</td>
            <td>{station.location.coordinates}</td>
            <td>{station.capacity}</td>
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