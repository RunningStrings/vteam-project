import { useState, useEffect } from "react";

function Users() {
    const [parkings, setParkings] = useState([]);
    const token=sessionStorage.getItem("token");
  
    useEffect(() => {
    // Fetch parkings from the backend API
        fetch("/parking_zones", {
            method: "GET", // GET är standard, så det kan utelämnas
            headers: {
                "x-access-token": `${token}`, // Lägg till Authorization-headern med token
                "Content-Type": "application/json", // Valfritt om API:et kräver det
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((responseData) => {
                setParkings(responseData.data); // Ensure this is the correct data structure
            })
            .catch((error) => {
                console.error("Error fetching parkerings:", error);
            });
    }, [token]);
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
                        <th>Kapacitet</th>
                    </tr>
                </thead>
                <tbody>
                    {parkings.map((parking, index) => (
                        <tr key={index}>
                            <td>{parking.id}</td>
                            <td>{parking.city_name}</td>
                            <td>{parking.location.coordinates}</td> 
                            <td>{parking.bikes.length}</td>
                            <td>{parking.capacity}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Users;