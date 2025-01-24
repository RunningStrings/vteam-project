import { useState, useEffect } from 'react';
import { apiKey, baseURL } from "../components/utils.jsx";
import React from "react";

let bikeId="";
const initialFormValues = {
  
  id: "",
  city: "",
  position: "",
  battery: "",
  status: "",
  speed: ""
}

async function updateBike(id, city, position, battery, status, speed) {
  let token=sessionStorage.getItem('token');
  let bikeId=sessionStorage.getItem('bike_id');
  const endpoint = `${baseURL}/bikes/${bikeId}`;
  console.log(endpoint);
  
  const body = {
    "id": id,
    "city": city,
    "position": position,
    "battery": battery,
    "status": status,
    "speed": speed,
  };


  try {
    const response = await fetch(endpoint, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        'x-access-token': `${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    // Kontrollera om svaret innehåller JSON
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      /* toast.success("Du är nu uppdaterat en användare!", {
        onClose: () => {
          // Navigate or perform any action after the toast disappears
          navigate("/");
        },
        autoClose: 3000, // Auto close after 3 seconds
      });*/




      //console.log("Response data:", data);
      alert("Cykeln har uppdaterats!");
      return data;
    } else {
      /*toast.success("Du är nu updaterat en användare!", {
        onClose: () => {
          // Navigate or perform any action after the toast disappears
          navigate("/");
        },
        autoClose: 3000, // Auto close after 3 seconds
      });*/




      //console.warn("No JSON content in response.");
      alert("Cykeln har uppdaterats");
      return null;
    }
  } catch (error) {
    alert("Ett problem uppstod när cykeln skapades.");
    console.error("Error creating bike:", error);
  }
}


function Bike() {
  const [formData, setFormData] = useState(initialFormValues);
  const [bikes, setBikes] = useState([]); // Deklarerar bikes
  const [currentIndex, setCurrentIndex] = useState(0); 
  const [selectedBikeId, setSelectedBikeId] = useState(null); 
  let token=sessionStorage.getItem('token');
  const bikeCoords=sessionStorage.getItem('coordinates');
  
  //let coordsFromSession="";

  const handleSubmit = (evt) => {
    evt.preventDefault();
    //console.log(formData);
    
    const {id, city, bikeCoords, battery, status, speed } = formData;
    updateBike(id, city, bikeCoords, battery, status, speed);
    //setFormData(initialFormValues);
  };

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormData({ ...formData, [name]: value });
  };

 useEffect(() => {
    //let isMounted = true; // Add a flag to check if the component is still mounted


    fetch('/bikes')
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((responseData) => {
      //if (isMounted) {
        setBikes(responseData.data);
        const bikeFromSession = sessionStorage.getItem('bike');
        //console.log(bikeFromSession);
        
        //console.log("Den här: "+responseData.data.id);
        
        //coordsFromSession = sessionStorage.getItem('bike_coords');
        if (bikeFromSession) {
          const matchedBike = responseData.data.find((bike) => parseInt(bike.id) === parseInt(bikeFromSession));
          if (matchedBike) {
            //console.log(matchedBike);
            bikeId=matchedBike.id;
            
            setFormData(matchedBike);
          }
        }
      //}
    })
    .catch((error) => {
    console.error("Error fetching bikes:", error);
    });

  return () => {
    //isMounted = false; // Cleanup when the component unmounts
  };
}, []);

    const handleBikeSelect = (evt) => {
      const bikeId = evt.target.value;
      setSelectedBikeId(bikeId);
      const bike = bikes.find((b) => b.id === bikeId);
      if (bike) {
        setFormData(bike); // Populate formData with the selected user's data
        console.log(bike.location.coordinates);
        console.log(bike);
      }
    };



  return (
   
    
    
    <div className="App" style={{ marginLeft: "220px", padding: "20px" }}>
      <h2>En cykel</h2>
      <form className="form" onSubmit={handleSubmit}>
      
        <div className="form__group">
          <label htmlFor="id" className="form__label">
            Id
          </label>
          <input 
          type="number" 
          id="id" 
          name="id"
          defaultValue={formData.id}
          className="form__input" 
          onChange={handleChange}
           />
        </div>
        <div className="form__group">
          <label htmlFor="city" className="form__label">
            Stad
          </label>
          <input 
          type="text" 
          id="city" 
          name="city"
          defaultValue={formData.city_name}
          className="form__input" 
          onChange={handleChange}
           />
        </div>
        <div className="form__group">
          <label htmlFor="position" className="form__label">
            Position
          </label>
          <input 
          type="text" 
          id="position" 
          name="position" 
          defaultValue={bikeCoords || "saknas"}
          className="form__input" 
          onChange={handleChange}
           />
        </div>
        <div className="form__group">
          <label htmlFor="battery" className="form__label">
            Batteri
          </label>
          <input 
          type="number" 
          id="battery" 
          name="battery" 
          defaultValue={formData.battery}
          className="form__input" 
          onChange={handleChange}
           />
        </div>
       

        <div className="form__group">
          <label htmlFor="status" className="form__label">
            Status
          </label>
          <select
            name="status"
            id="status"
            className="form__select"
            value={formData.status}
            onChange={handleChange}
            >
            <option value="available">Tillgänglig</option>
            <option value="in_use">Används</option>
            <option value="charging">Laddas</option>
            <option value="maintenance">Underhåll</option>
          </select>
        </div>
        <div className="form__group">
          <label htmlFor="speed" className="form__label">
            Fart
          </label>
          <input
            type="number"
            id="speed"
            name="speed"
            defaultValue={formData.speed}
            className="form__input"
            onChange={handleChange}
            />
        </div>
 
        <button className="button" type="submit">
          Submit
        </button>

        </form>
    </div>
  );
};

  
  export default Bike;



  /*
  
 // Navigate to the next bike
 const handleNext = () => {
  if (currentIndex < users.length - 1) {
    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    setFormData(users[nextIndex]);
  }
};

// Navigate to the previous user
const handlePrevious = () => {
  if (currentIndex > 0) {
    const prevIndex = currentIndex - 1;
    setCurrentIndex(prevIndex);
    setFormData(users[prevIndex]);
  }
};
*/