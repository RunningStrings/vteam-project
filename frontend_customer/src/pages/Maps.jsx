/* global L */
import { MapContainer, TileLayer, Marker, Popup, Polygon, Circle } from "react-leaflet";
import { useState, useEffect } from "react";
import MarkerClusterGroup from "@changey/react-leaflet-markercluster";
//import L from "leaflet";
//import { useNavigate } from "react-router-dom";
//import { io } from "socket.io-client";
//import { useMap } from "../hooks";

const Maps = () => {
    const [bikes, setBikes] = useState([]);
    const [cities, setCities] = useState([]);
    const [stations, setStations] = useState([]);
    const [parkings, setParkings] = useState([]);
    let token=sessionStorage.getItem("token");
    //const navigate = useNavigate();
  
    useEffect(() => {
        Promise.all([fetch("/cities",{headers: {"x-access-token": `${token}`},}), fetch("/bikes"), fetch("/charging_stations",{headers: {"x-access-token": `${token}`},}), fetch("/parking_zones",{headers: {"x-access-token": `${token}`},})])
            .then(([citiesRes, bikesRes, stationsRes, parkingsRes]) => 
                Promise.all([citiesRes.json(), bikesRes.json(), stationsRes.json(), parkingsRes.json()])
            )
            .then(([citiesData, bikesData, stationsData, parkingsData]) => {
                setCities(citiesData.data);
                setBikes(bikesData.data);
                setStations(stationsData.data);
                setParkings(parkingsData.data);
                //setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                //setLoading(false);
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

    const parkingIcon = new L.Icon({
        iconUrl: "./src/assets/parking.png",
        iconSize: [15, 15]
    });

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
                    //}

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
                            icon={bike.status === "available" ? bikeGreen : bike.status === "charging" ? bikeOrange : bikeRed}
                        >
                            <Popup>
                                <strong>Cykel nr: {index}</strong><br />
                                <strong>Batteri: {bike.battery}% </strong><br />
                                <strong>{bike.status}</strong><br/>
                            </Popup>
                        </Marker>
                    ))}
                </MarkerClusterGroup>
            </MapContainer>
        </div>
    );
};

export default Maps;

/*

  // Handle WebSocket updates
  useEffect(() => {
  /*  socket.on('update-location', (data) => {
      const { lat, lon } = data.location.coordinates;
      console.log(lat);
      console.log(lon);
      
      //marker.setlatlon([lat, lon]);
    };
    });
 
 
    socket.on("update-location", (data) => {
      console.log("socket on");
      const { lat, lon } = data.location.coordinates;
      console.log(data);
      console.log(lat);
      console.log(lon);

      
      setBikes((prevBikes) =>
        prevBikes.map((bike) =>
          bike.id === data.id ? { ...bike, location: data.location } : bike
        )
      );
    });
  
    return () => {
      //socket.off("update-location");
      console.log("socket off");
    };
  }, []);
  
  useEffect(() => {
    socket.on('connect', (data) => {
      console.log('WebSocket connected:', socket.id);
      console.log(socket);
      
    });
  
    socket.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error);
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });
  
/*    return () => {
      socket.disconnect();
    };
  }, []);*/
  
  
/*useEffect(() => {
    const handleLocationUpdate = (data) => {
      console.log("Updated Location:", data);
    };

    socket.on("update-location", handleLocationUpdate);

    return () => {
      // Cleanup WebSocket listener
      socket.off("update-location", handleLocationUpdate);
    };
  }, [socket]);*/

/*     socket.on('update-location', (data) => {
        const { lat, lon } = data.location.coordinates;
        console.log(lat);
        console.log(lon);
        
        //marker.setlatlon([lat, lon]);
      }
      });*/


/*return (
    <div style={{ marginLeft: "220px", padding: "20px" }}>
      <h1>Kartor</h1>
      <p>Welcome to the home page.</p>
    </div>
  );*/


/*  useEffect(() => {
    // Fetch cities from the backend API
    fetch('/cities')
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
        console.error('Error fetching cities:', error);
      });

    // Fetch parkings from the backend API
    fetch('/parking_zones')
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
        console.error('Error fetching parkerings:', error);
      });

    // Fetch stations from the backend API
    fetch('/charging_stations')
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
        console.error('Error fetching stations:', error);
      });

    fetch('/bikes')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((responseData) => {
        setBikes(responseData.data.result); // Ensure this is the correct data structure
      })
      .catch((error) => {
        console.error('Error fetching bikes:', error);
      });


  }, []);*/

/*import { MapContainer, TileLayer, Marker, Popup, Polygon, Circle } from "react-leaflet";
import { useState, useEffect } from 'react';
import MarkerClusterGroup from "@changey/react-leaflet-markercluster";
import  L, { LatLng } from "leaflet";

//import { useMap } from "../hooks";

const Maps = () => {

    
    const [bikes, setBikes] = useState([]);
    const [cities, setCities] = useState([]);
    const [stations, setStations] = useState([]);
    const [parkings, setParkings] = useState([]);

  useEffect(() => {
     // Fetch cities from the backend API
     fetch('/cities')
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
       console.error('Error fetching cities:', error);
     });
 
     // Fetch parkings from the backend API
     fetch('/parking_zones')
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
       console.error('Error fetching parkerings:', error);
     });
 
 
 
 
 
 
     // Fetch stations from the backend API
     fetch('/charging_stations')
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
       console.error('Error fetching stations:', error);
     });
 
     fetch('/bikes')
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
       console.error('Error fetching bikes:', error);
     }); 
    }, []);

    const stationIcon = new L.Icon({
      iconUrl: './src/assets/location.png',
    iconSize:[32,32]  
    });

    
    const bikeIcon = new L.Icon({
      iconUrl: './src/assets/kick-scooter.png',
    iconSize:[25,25]  
    });

    const bikeRed = new L.Icon({
      iconUrl: './src/assets/scooter_red.png',
    iconSize:[25,25]  
    });

    const bikeGreen = new L.Icon({
      iconUrl: './src/assets/scooter_green.png',
    iconSize:[25,25]  
    });

    const bikeOrange = new L.Icon({
      iconUrl: './src/assets/scooter_orange.png',
    iconSize:[25,25]  
    });

    const bikeBlue = new L.Icon({
      iconUrl: './src/assets/scooter_blue.png',
    iconSize:[25,25]  
    });





    //const cityBorder = new L.polygon;
    //console.log(stations);    
for (let index = 0; index < cities.length; index++) {
  const element = cities[index];
  //console.log(element);
  
}
  //const {position} = useMap();//L.GeoJson.coordsToLatLngs() ;
  return (



<div style={{ marginLeft: "150px", marginBottom: "100px", width: "100px", padding: "20px" }}>
    <h2>Karta</h2>
    <MapContainer
      center={[57.18219, 16.59094]}
      zoom={7}
      scrollWheelZoom={true}
      style={{ minHeight: "100vh", minWidth: "100vw"}}
      
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
          fillColor="blue"
          fill="true"
          fillOpacity={0.15}
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
          >
          
          
        <Popup>
        
         <br />
          </Popup>
        </Circle>
      //}
  
      ))}



<MarkerClusterGroup>
{stations.map((station, index) => (
      
    //L.marker({station.location.coordinates}, {icon: stationIcon}).addTo(map);

      <Marker 
        position={station.location.coordinates}
        key={index}
        icon={stationIcon}
        >
        
        
      <Popup>
      
       Station nr: {index} <br />
       Hagagatan
        </Popup>
      </Marker>
  

    ))}
</MarkerClusterGroup>
<MarkerClusterGroup>
{bikes.map((bike, index) => (
      <Marker 
        position={bike.location.coordinates}
        key={index}
        icon={bike.status === "in_use" ? bikeBlue : bike.status === "available" ? bikeGreen : bike.status === "charging" ? bikeOrange : bikeRed}
        >
      <Popup>
      Cykel nr: {index}<br /> 
      Batteri: {bike.battery}% <br /> 
      {bike.status} 
        </Popup>
      </Marker>
    ))}
</MarkerClusterGroup>

    </MapContainer>
    </div>
  );  
  
  
  
  };
  
  export default Maps;*/
