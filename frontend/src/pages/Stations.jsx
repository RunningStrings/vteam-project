import { useState, useEffect } from "react";
//import { useNavigate} from "react-router-dom";

function Users() {
    const [stations, setStations] = useState([]);
    const token=sessionStorage.getItem("token");
    //const navigate = useNavigate();
  
    useEffect(() => {
        // Fetch charging stations from the backend API
        fetch("/charging_stations", {
            method: "GET",
            headers: {
                "x-access-token": `${token}`,
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((responseData) => {
                setStations(responseData.data); // Ensure this is the correct data structure
            })
            .catch((error) => {
                console.error("Error fetching stations:", error);
            });
    }, [token]);

    return (
        <div className="App" style={{ marginLeft: "120px", padding: "20px" }}>
            <h2>Laddningsstationer</h2>
            <table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Namn</th>
                        <th>Stad</th>
                        <th>Position</th>
                        <th>Antal cyklar nu</th>
                        <th>Kapacitet</th>
                    </tr>
                </thead>
                <tbody>
                    {stations.map((station, index) => (
                        <tr key={index}>
                            <td>{index}</td>
                            <td>{station.name}</td>
                            <td>{station.city_name}</td>
                            <td>{station.location.coordinates[0].toFixed(4)} {station.location.coordinates[1].toFixed(4)}</td>
                            <td>{station.bikes.length}</td>
                            <td>{station.capacity}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Users;