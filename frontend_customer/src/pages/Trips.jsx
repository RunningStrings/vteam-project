import { useState, useEffect } from 'react';

function Bikes() {
  const [users, setUsers] = useState([]);
  const [bikes, setBikes] = useState([]);

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
  }, []);

  return (
    <div className="App" style={{ marginLeft: "220px", padding: "20px" }}>
      <h2>Resehistorik</h2>
      <table>
        <thead>
          <tr>
            <th>Cykel id</th>
            <th>Distans</th>
            <th>Parkeringstyp</th>
            <th>Kostnad</th>
            <th>Start</th>
            <th>Slut</th>
          </tr>
        </thead>
        <tbody>
        {bikes.map((bikes, index) => (
            <tr key={index}>
            <td>{bikes.id}</td>
            <td>{bikes.city_name}</td>
            <td>{bikes.location.coordinates}</td>
            <td>{bikes.battery}</td>
            <td>{bikes.status}</td>
            <td>{bikes.speed}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}













/*const Bikes = () => {
    return (
      <div style={{ marginLeft: "220px", padding: "20px" }}>
        <h1>Cykelsida</h1>
        <p>Welcome to the home page.</p>
      </div>
    );
  };*/
  
  export default Bikes;