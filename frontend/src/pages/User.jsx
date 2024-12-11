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
  admin: "no"
}

function User() {
  const [formData, setFormData] = useState(initialFormValues);

  const handleSubmit = (evt) => {
    evt.preventDefault();
    console.log(formData);
    setFormData(initialFormValues);
  };

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
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



/*function User() {
  const [users, setUsers] = useState([]);
  const [bikes, setBikes] = useState([]);

  useEffect(() => {
    // Fetch users from the backend API
    fetch('/users')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error));

    // Fetch bikes from the backend API
    fetch('/bikes')
      .then(response => response.json())
      .then(data => setBikes(data))
      .catch(error => console.error('Error fetching bikes:', error));
  }, []);

  return (
    <div className="App" style={{ marginLeft: "220px", padding: "20px" }}>
      <h2>En Användare</h2>
      <table>
        <thead>
          <tr>
            <th>Kundnummer</th>
            <th>Namn</th>
            <th>Telefonnummer</th>
            <th>E-post</th>
            <th>Saldo</th>
          </tr>
        </thead>
        <tbody>
        {users.map((user, index) => (
            <tr key={index}>
            <td>xxxx</td>
            <td>{user.name}</td>
            <td>555-545434</td>
            <td>{user.email}</td>
            <td>542 kr</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}*/

/*const Users = () => {
    return (
      <div style={{ marginLeft: "220px", padding: "20px" }}>
        <h1>Användare</h1>
        <p>Welcome to the home page.</p>
      </div>
    );
  };*/
  
  export default User;