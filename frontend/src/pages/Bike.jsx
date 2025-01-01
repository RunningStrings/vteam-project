import { useState, useEffect } from 'react';
import React from "react";

const initialFormValues = {
  
  id: "",
  city: "",
  position: "",
  battery: "",
  status: "",
  speed: ""
}

function search(data) {
  let number=0;
  let sessionId=sessionStorage.getItem('bike');
  console.log(sessionId);
  
  for (let i=0; i<data.length; i++) {
  
    //console.log(data[i].email);
    
    if(data[i].id == sessionId)
      number=i;
}
  return number;
}


function Bike() {
  const [formData, setFormData] = useState(initialFormValues);
  const [bikes, setBikes] = useState([]); // Deklarerar bikes
  const [currentIndex, setCurrentIndex] = useState(0); 
  const [selectedBikeId, setSelectedBikeId] = useState(null); 
  //let coordsFromSession="";

  const handleSubmit = (evt) => {
    evt.preventDefault();
    //console.log(formData);
    setFormData(initialFormValues);
  };

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormData({ ...formData, [name]: value });
  };

  /*useEffect(() => {
    // Fetch users from the backend API
    fetch('/users')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error));
    }, []);*/




 useEffect(() => {
      // Fetch users from the backend API
      /*fetch('/bikes')
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((responseData) => {
          setBikes(responseData.data); // Store all users
          const bikeFromSession = sessionStorage.getItem('bike'); // Get email from sessionStorage
          if (bikeFromSession) {
            const matchedBike = responseData.data.find((bike) => bike.id === bikeFromSession);
            if (matchedBike) {
              setFormData(matchedBike); // Populate the form with the matched bike's data
            }
          }
        })        
        .catch((error) => console.error("Error fetching bikes:", error));
    }, []);*/
    let isMounted = true; // Add a flag to check if the component is still mounted


    fetch('/bikes')
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((responseData) => {
      if (isMounted) {
        setBikes(responseData.data);
        const bikeFromSession = sessionStorage.getItem('bike');
        //coordsFromSession = sessionStorage.getItem('bike_coords');
        if (bikeFromSession) {
          const matchedBike = responseData.data.find((bike) => bike.id+"" === bikeFromSession);
          if (matchedBike) {
            setFormData(matchedBike);
          }
        }
      }
    })
    .catch((error) => {
      if (isMounted) console.error("Error fetching bikes:", error);
    });

  return () => {
    isMounted = false; // Cleanup when the component unmounts
  };
}, []);





    const handleBikeSelect = (evt) => {
      const bikeId = evt.target.value;
      setSelectedBikeId(bikeId);
      const bike = bikes.find((b) => b.id === bikeId);
      if (bike) {
        setFormData(bike); // Populate formData with the selected user's data
        console.log(bike.location.coordinates);
        
      }
    };



  return (
   
    
    
    <div className="App" style={{ marginLeft: "220px", padding: "20px" }}>
      <h2>En cykel</h2>
      <form className="form" onSubmit={handleBikeSelect}>
      
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
          onChange={(e) =>
            setFormData({ ...formData, id: e.target.value})
          }
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
          value={formData.city_name}
          className="form__input" 
          onChange={(e) =>
            setFormData({ ...formData, city: e.target.value})
          }
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
          defaultValue={formData.id+""}//formData.location.coordinates || ""}
          className="form__input" 
          onChange={(e) =>
            setFormData({ ...formData, position: e.target.value})
          }
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
          value={formData.battery}
          className="form__input" 
          onChange={(e) =>
            setFormData({ ...formData, battery: e.target.value})
          }
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
            defaultValue="no"
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value})
            }
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
            value={formData.speed}
            className="form__input"
            onChange={(e) =>
              setFormData({ ...formData, speed: e.target.value})
            }
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