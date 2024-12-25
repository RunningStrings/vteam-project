import { useState, useEffect } from 'react';

const Home = () => {
  

  
  function Bikes() {
    const [bikes, setBikes] = useState([]);
  
    useEffect(() => {
      // Fetch users from the backend API
      fetch('/users')
        .then(response => response.json())
        .then(data => setUsers(data))
        .catch(error => console.error('Error fetching users:', error));
  
    }, []);
  }

  
  
  return (
      <div className="full_width">
        <h2>Hyr en elsparkcykel</h2>
        <br></br>
        <form className="form">
      
      <div className="form__group">
        <label htmlFor="id" className="form__label">
          Id
        </label>
        <input 
        type="number" 
        id="id" 
        name="id"
        className="form__input" 
        //onChange={(e) =>
        //  setFormData({ ...formData, id: e.target.value})
        //}
         />
      </div>
      <button className="button_full" type="submit">
          Submit
        </button>
        </form>
      
      </div>
    );
  };
  
  export default Home;