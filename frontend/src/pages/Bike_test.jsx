import { useState, useEffect } from 'react';
import React from "react";

const initialFormValues = {
  
  id: "",
  firstname: "",
  lastname: "",
  email: "",
  password: "",
  saldo: "",
  phone: "",
  admin: ""
  
}

function search(data) {
  let number=0;
  let sessionId=sessionStorage.getItem('email');
  console.log(sessionId);
  
  for (let i=0; i<data.length; i++) {
  
    //console.log(data[i].email);
    
    if(data[i].id == sessionId)
      number=i;
}
  return number;
}






function User() {
  const [formData, setFormData] = useState(initialFormValues);
  const [bikes, setBikes] = useState([]); // Deklarerar users
  const [selectedBikeId, setSelectedBikeId] = useState([]); // Deklarerar users

  const handleSubmit = (evt) => {
    evt.preventDefault();
    //console.log(formData);
    setFormData(initialFormValues);
  };

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormData({ ...formData, [name]: value });
  };


    useEffect(() => {
      // Fetch users from the backend API
      fetch('/bikes')
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
            const matchedBike = responseData.data.find((bike) => bike.id+"" === bikeFromSession);
            if (matchedBike) {
              setFormData(matchedBike); // Populate the form with the matched user's data
            }
          }
        })        
        
        
        
        
        /*.then((responseData) => {
          setUsers(responseData.data); // Ensure this is the correct data structure
          if (responseData.data && responseData.data.length > 0) {
            const firstUser = responseData.data[0]; // Assume we're using the first user for now
            setFormData(firstUser); // Populate the form with the first user's data
            setSelectedUserId(firstUser.id); // Set selected user ID
          }
        })*/
        .catch((error) => {
          console.error('Error fetching users:', error);
        });



/*      fetch("/users")
        .then((response) => response.json())
        .then((data) => {
          setUsers(data); // Store users
          if (data.length > 0) {
            const firstUser = data[0]; // Assume we're using the first user for now
            setFormData(firstUser); // Populate the form with the first user's data
            setSelectedUserId(firstUser.id); // Set selected user ID
          }
        })
        .catch((error) => console.error("Error fetching users:", error));*/
    }, []);

    const handleBikeSelect = (evt) => {
      const bikeId = evt.target.value;
      setSelectedBikeId(bikeId);
      const user = bikes.find((u) => u.id === bikeId);
      if (user) {
        setFormData(user); // Populate formData with the selected user's data
      }
    };

  return (
    //console.log(formData);
    
    
    <div className="App" style={{ marginLeft: "220px", padding: "20px" }}>
      <h2>En användare</h2>
      <form className="form" onSubmit={handleBikeSelect}>
      
        <div className="form__group">
          <label htmlFor="id" className="form__label">
            Id
          </label>
          <input 
          type="number" 
          id="id" 
          name="id"
          value={formData.id}
          className="form__input" 
          onChange={(e) =>
            setFormData({ ...formData, id: e.target.value})
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

  
  export default User;


  /*
          <div className="form__group">
          <label htmlFor="id" className="form__label">
            Id
          </label>
          <input 
          type="string" 
          id="id" 
          name="id"
          value={formData._id}
          className="form__input" 
          onChange={(e) =>
            setFormData({ ...formData, id: e.target.value})
          }
           />
        </div>
*/