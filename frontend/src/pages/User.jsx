import { useState, useEffect } from 'react';
import React from "react";

const initialFormValues = {
  
  id: "",
  firstname: "{formData.firstName}",
  lastname: "",
  email: "",
  password: "",
  saldo: "",
  phone: "",
  admin: "no"
  
}

function User() {
  const [formData, setFormData] = useState(initialFormValues);
  const [users, setUsers] = useState([]); // Deklarerar users

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
    fetch('/users')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error));
    }, []);




  return (
    //console.log(formData);
    
    
    <div className="App" style={{ marginLeft: "220px", padding: "20px" }}>
      <h2>En användare</h2>
      <form className="form" onSubmit={handleSubmit}>
      
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
          className="form__input" 
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value})
          }
           />
        </div>
        <div className="form__group">
          <label htmlFor="phone" className="form__label">
            Telefon
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className="form__input"
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value})
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
            className="form__input"
            onChange={(e) =>
              setFormData({ ...formData, saldo: e.target.value})
            }
          />
        </div>
        <div className="form__group">
          <label htmlFor="admin" className="form__label">
            Administratör
          </label>
          <select
            name="admin"
            id="admin"
            className="form__select"
            defaultValue="no"
            onChange={(e) =>
              setFormData({ ...formData, admin: e.target.value})
            }
          >
            <option value="no">Nej</option>
            <option value="yes">Ja</option>
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