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
  const [users, setUsers] = useState([]); // Deklarerar users
  const [selectedUserId, setSelectedUserId] = useState([]); // Deklarerar users

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
      fetch('/users')
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((responseData) => {
          setUsers(responseData.data); // Store all users
          const emailFromSession = sessionStorage.getItem('email'); // Get email from sessionStorage
          if (emailFromSession) {
            const matchedUser = responseData.data.find((user) => user.email === emailFromSession);
            if (matchedUser) {
              setFormData(matchedUser); // Populate the form with the matched user's data
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

    const handleUserSelect = (evt) => {
      const userId = evt.target.value;
      setSelectedUserId(userId);
      const user = users.find((u) => u.id === userId);
      if (user) {
        setFormData(user); // Populate formData with the selected user's data
      }
    };

  return (
    //console.log(formData);
    
    
    <div className="App" style={{ marginLeft: "220px", padding: "20px" }}>
      <h2>En användare</h2>
      <form className="form" onSubmit={handleUserSelect}>
      
        <div className="form__group">
          <label htmlFor="firstname" className="form__label">
            Förnamn
          </label>
          <input 
          type="text" 
          id="firstname" 
          name="firstname"
          value={formData.firstname}
          className="form__input" 
          onChange={(e) =>
            setFormData({ ...formData, firstname: e.target.value})
          }
           />
        </div>
        <div className="form__group">
          <label htmlFor="lastname" className="form__label">
            Efternamn
          </label>
          <input 
          type="text" 
          id="lastname" 
          name="lastname" 
          value={formData.lastname}
          className="form__input" 
          onChange={(e) =>
            setFormData({ ...formData, lastname: e.target.value})
          }
           />
        </div>
        <div className="form__group">
          <label htmlFor="email" className="form__label">
            E-post
          </label>
          <input 
          type="email" 
          id="email" 
          name="email" 
          value={formData.email}
          className="form__input" 
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value})
          }
           />
        </div>
        <div className="form__group">
          <label htmlFor="trips" className="form__label">
            Resehistorik
          </label>
          <input
            type="text"
            id="trips"
            name="trips"
            value={formData.trips}
            className="form__input"
            onChange={(e) =>
              setFormData({ ...formData, trips: e.target.value})
            }
          />
        </div>

        <div className="form__group">
          <label htmlFor="saldo" className="form__label">
            Saldo
          </label>
          <input
            type="number"
            id="saldo"
            name="saldo"
            value={formData.balance}
            className="form__input"
            onChange={(e) =>
              setFormData({ ...formData, saldo: e.target.value})
            }
          />
        </div>
        <div className="form__group">
          <label htmlFor="role" className="form__label">
            Roll
          </label>
          <select
            name="role"
            id="role"
            className="form__select"
            value={formData.role}
            onChange={(e) =>
              setFormData({ ...formData, role: e.target.value})
            }
          >
            <option value="city_manager">Stadschef</option>
            <option value="admin">Administratör</option>
            <option value="customer">Kund</option>
          </select>
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