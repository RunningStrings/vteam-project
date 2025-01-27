import { MapContainer, TileLayer, Marker, Popup, Polygon, Circle } from "react-leaflet";
import { useState, useEffect } from "react";
import MarkerClusterGroup from "@changey/react-leaflet-markercluster";
import L from "leaflet";
import { useNavigate } from "react-router-dom";

const Maps = () => {
    const [bikes, setBikes] = useState([]);
    const [cities, setCities] = useState([]);
    const [stations, setStations] = useState([]);
    const [parkings, setParkings] = useState([]);
    let token=sessionStorage.getItem("token");

    useEffect(() => {
        // Fetch cities from the backend API
        fetch("/cities")
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((responseData) => {
                setCities(responseData.data); // Ensure this is the correct data structure
            })
            .catch((error) => {
                console.error("Error fetching cities:", error);
            });

        // Fetch parkings from the backend API
        fetch("/parking_zones")
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

        // Fetch stations from the backend API
        fetch("/charging_stations")
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

        // Fetch bikes from the backend API
        fetch("/bikes",{headers: {"x-access-token": `${token}`},})
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((responseData) => {
                setBikes(responseData.data); // Ensure this is the correct data structure
            })
            .catch((error) => {
                console.error("Error fetching bikes:", error);
            });


    }, []);

    const stationIcon = new L.Icon({
        iconUrl: "./src/assets/charging.png",
        iconSize: [32, 32]
    });

    const bikeGreen = new L.Icon({
        iconUrl: "./src/assets/scooter_green.png",
        iconSize: [25, 25]
    });

    const bikeEmpty = new L.Icon({
        iconUrl: "./src/assets/scooter_empty.png",
        iconSize: [25, 25]
    });

    const parkingIcon = new L.Icon({
        iconUrl: "./src/assets/parking.png",
        iconSize: [15, 15]
    });

    const navigate = useNavigate();
    return (
        <div>
            <h2>Karta</h2>
            <MapContainer
                center={[57.18219, 16.59094]}
                zoom={7}
                scrollWheelZoom={true}
                style={{ minHeight: "100vh", minWidth: "100vw" }}
            >
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {cities.map((city, index) => (
                    <Polygon
                        positions={city.geometry.coordinates}
                        key={index}
                        color="blue"
                        fillColor="green"
                        fill="false"
                        fillOpacity={0.15}
                        zIndexOffset={10}
                    >
                    </Polygon>
                ))}

                {parkings.map((parking, index) => (
                    <Circle
                        center={parking.location.coordinates}
                        key={index}
                        color="red"
                        fillColor="red"
                        fill="true"
                        radius="10"
                        zIndexOffset={50}
                    >
                    </Circle>
                ))}

                {parkings.map((parking, index) => (
                    <Marker
                        position={parking.location.coordinates}
                        key={index}
                        icon={parkingIcon}
                        zIndexOffset={60}
                    >
                        <Popup>

                            <br />
                        </Popup>
                    </Marker>
                ))}
                <MarkerClusterGroup>
                    {stations.map((station, index) => (
                        <Marker
                            position={station.location.coordinates}
                            key={index}
                            icon={stationIcon}
                            zIndexOffset={100}
                        >
                            <Popup>
                Station nr: {index} <br />
                                {station.name}
                            </Popup>
                        </Marker>


                    ))}
                </MarkerClusterGroup>
        
                {bikes.map((bike, index) => (
                    <Marker
                        zIndexOffset={200}
                        position={bike.location.coordinates}
                        key={index}
                        icon={bike.status === "available" ? bikeGreen : bikeEmpty}
                    >
                        <Popup>
                            <strong>Cykel nr: {bike.id}</strong><br />
                            <strong>Batteri: {bike.battery}%</strong> <br />
                            <strong>{bike.status}</strong>
                            <button
                                onClick={() => {
                                    sessionStorage.setItem("bikeid", bike.id); 
                                    navigate("/rent");
                                }}
                            >
                  Hyr cykel
                            </button>
                        </Popup>
                    </Marker>
                ))}
        

            </MapContainer>
        </div>
    );
};
export default Maps;

