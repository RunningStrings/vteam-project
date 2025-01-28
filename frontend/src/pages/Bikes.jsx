import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Bikes() {
    const [bikes, setBikes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    let token=sessionStorage.getItem("token");

    function handleClick(bike_id,bikeid ,bike_coords) {
    //sessionStorage.setItem("bike", JSON.stringify({ id: bike_id, coordinates: bike_coords }));
        sessionStorage.setItem("bike_id", bike_id);
        sessionStorage.setItem("bike", bikeid);
        sessionStorage.setItem("coordinates", bike_coords);
        //console.log(bike_id);
    
        navigate("/bike");
    }

    useEffect(() => {
        setIsLoading(true);
        fetch("/bikes",{headers: {"x-access-token": `${token}`},})
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((responseData) => {
                //console.log('API response:', responseData);
                //console.log(responseData.data);
        
                setBikes(responseData.data);
                setIsLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setIsLoading(false);
            });
    }, [token]);

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="App" style={{ marginLeft: "220px", padding: "20px" }}>
            <h2>Elsparkcyklar</h2>
            <table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Stad</th>
                        <th>Position</th>
                        <th>Batteri</th>
                        <th>Status</th>
                        <th>Fart</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(bikes) && bikes.map((bike) => (
                        <tr key={bike.id}>
                            <td onClick={() => handleClick(bike._id, bike.id, bike.location.coordinates)} style={{ cursor: "pointer", color: "blue" }}>
                                {bike.id}
                            </td>
                            <td>{bike.city_name}</td>
                            <td>{bike.location.coordinates.join(", ")}</td>
                            <td>{bike.battery}</td>
                            <td>{bike.status}</td>
                            <td>{bike.speed}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Bikes;
