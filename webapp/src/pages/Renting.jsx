import { useState, useEffect } from 'react';
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';

const Home = () => {
  let sessionId=sessionStorage.getItem('bikeid');

  const navigate = useNavigate();

  function Bikes() {
    const [bikes, setBikes] = useState([]);
  
    const showToast = () => {
        toast.success("This is a success toast!", {
          position: toast.POSITION.TOP_RIGHT, // Customize position
        });
      };
    


    
    useEffect(() => {
      // Fetch users from the backend API
      fetch('/users')
        .then(response => response.json())
        .then(data => setUsers(data))
        .catch(error => console.error('Error fetching users:', error));
  
    }, []);

  }
    const handleSubmit = (event) => {
      event.preventDefault();
      sessionStorage.setItem("renting", -1);
      toast.success("Du har nu lämnat tillbaka: "+ sessionId, {
        onClose: () => {
          // Navigate or perform any action after the toast disappears
          navigate("/");
        },
        autoClose: 3000, // Auto close after 3 seconds
      });

  };

    
  
  return (
      <div className="full_width">
        <h2>Lämna tillbaka en elsparkcykel</h2>
        <br></br>
        <form className="form"  onSubmit={handleSubmit}>
      
      <div className="form__group">
        <label htmlFor="id" className="form__label">
          Cykelns id-nummer:
        </label>
        <input 
        type="number" 
        id="id" 
        name="id"
        className="form__input"
        defaultValue={sessionId} 
        readOnly
        //onChange={(e) =>
        //  setFormData({ ...formData, id: e.target.value})
        //}
         />
      </div>
      <button className="full-button blue-button" type="submit">
          Lämna tillbaka
        </button>
        </form>
        <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
       <img src="./src/assets/scooter.gif" width="420" height="320"></img>     
      </div>
    );
  };
  
  export default Home;