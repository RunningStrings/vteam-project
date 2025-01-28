import { MapContainer, TileLayer, Marker, Popup, Polygon, Circle } from "react-leaflet";
import { useState, useEffect } from "react";
import MarkerClusterGroup from "@changey/react-leaflet-markercluster";
import L from "leaflet";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
//import { useMap } from "../hooks";

const Maps = () => {
    const [bikes, setBikes] = useState([]);
    const [cities, setCities] = useState([]);
    const [stations, setStations] = useState([]);
    const [parkings, setParkings] = useState([]);
    let token=sessionStorage.getItem("token");
    const navigate = useNavigate();

    // Connect to socket
    useEffect(() => {
        const socket = io("http://localhost:5000", {
            withCredentials: true,
            transports: ["websocket"],
        });

        // Listen for bike updates
        socket.on("bike-update", (updatedBike) => {
            setBikes((prevBikes) => {
                const bikeIndex = prevBikes.findIndex((bike) => bike.id === updatedBike.id);

                if (bikeIndex !== -1) {
                    // Update the existing bike's data
                    const updatedBikes = [...prevBikes];
                    updatedBikes[bikeIndex] = { ...updatedBikes[bikeIndex], ...updatedBike };
                    return updatedBikes;
                } else {
                    // Add the new bike if not found
                    return [...prevBikes, updatedBike];
                }
            });
        });

        // Clean up the socket connection on unmount
        //return () => {
        //    socket.disconnect();
        //};
    }, []);
  
    useEffect(() => {
        Promise.all([fetch("/cities",{headers: {"x-access-token": `${token}`},}), fetch("/bikes",{headers: {"x-access-token": `${token}`},}), fetch("/charging_stations",{headers: {"x-access-token": `${token}`},}), fetch("/parking_zones",{headers: {"x-access-token": `${token}`},})])
            .then(([citiesRes, bikesRes, stationsRes, parkingsRes]) => 
                Promise.all([citiesRes.json(), bikesRes.json(), stationsRes.json(), parkingsRes.json()])
            )
            .then(([citiesData, bikesData, stationsData, parkingsData]) => {
                setCities(citiesData.data);
                setBikes(bikesData.data);
                setStations(stationsData.data);
                setParkings(parkingsData.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, [token]);

    const stationIcon = new L.Icon({
        iconUrl: "./src/assets/charging.png",
        iconSize: [32, 32]
    });
    const bikeRed = new L.Icon({
        iconUrl: "./src/assets/scooter_red.png",
        iconSize: [25, 25]
    });
    const bikeGreen = new L.Icon({
        iconUrl: "./src/assets/scooter_green.png",
        iconSize: [25, 25]
    });
    const bikeOrange = new L.Icon({
        iconUrl: "./src/assets/scooter_orange.png",
        iconSize: [25, 25]
    });
    const bikeBlue = new L.Icon({
        iconUrl: "./src/assets/scooter_blue.png",
        iconSize: [25, 25]
    });
    const parkingIcon = new L.Icon({
        iconUrl: "./src/assets/parking.png",
        iconSize: [15, 15]
    });

    //    for (let index = 0; index < cities.length; index++) {
    //        const element = cities[index];
    //    }
    return (
        <div style={{ marginLeft: "150px", marginBottom: "100px", width: "100px", padding: "20px" }}>
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
                        positions={city.geometry.coordinates} //LatLng.wrap(
                        key={index}
                        color="blue"
                        fillColor="green"
                        fill="true"
                        fillOpacity={0.15}
                        zIndexOffset={10}
                    >
                    </Polygon>
                ))}
                {parkings.map((parking, index) => (
                    <Circle
                        center={parking.location.coordinates} //LatLng.wrap(
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
                        position={parking.location.coordinates} //LatLng.wrap(
                        key={index}
                        icon={parkingIcon}
                        zIndexOffset={100}
                    >
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
                Address: {station.name}
                            </Popup>
                        </Marker>
                    ))}
                </MarkerClusterGroup>
                <MarkerClusterGroup>
                    {bikes.map((bike, index) => (
                        <Marker
                            zIndexOffset={200}
                            position={bike.location.coordinates}
                            key={index}
                            icon={bike.status === "in_use" ? bikeBlue : bike.status === "available" ? bikeGreen : bike.status === "charging" ? bikeOrange : bikeRed}
                        >
                            <Popup>
                                <strong>Cykel nr: {bike.id}</strong><br />
                                <strong>Batteri: {bike.battery}% </strong><br />
                                <strong>{bike.status}</strong><br/>
                                <button className="mapbutton"
                                    onClick={() => {
                                        sessionStorage.setItem("bike", bike.id); // Spara index i sessionStorage
                                        sessionStorage.setItem("bike_id", bike._id); // Spara index i sessionStorage
                                        navigate("/bike");
                                    }}
                                >
                  Ändra
                                </button>
                            </Popup>
                        </Marker>
                    ))}
                </MarkerClusterGroup>
            </MapContainer>
        </div>
    );
};
export default Maps;