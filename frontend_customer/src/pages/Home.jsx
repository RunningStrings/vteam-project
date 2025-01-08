import { useNavigate } from 'react-router-dom';


const Home = () => {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/newuser");
  };

    return (
      <div style={{ marginLeft: "220px", padding: "20px" }}>
        <h2>Svenska Elsparkcyklar AB</h2>
        <br></br>
        <p>Välkommen till oss. Vi sätter jorden i rullning.</p>
        <br></br>
        <p><img src="../src/assets/scooter.png" width="420" height="320"></img></p>
        <p><button onClick={handleClick} className="blue-button">
      Skapa ny användare
    </button></p>
      </div>
    );
  };
  
  export default Home;