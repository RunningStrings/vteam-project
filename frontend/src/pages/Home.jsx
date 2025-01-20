const Home = () => {

  
    const handleLogin = () => {
      window.location.href = 'http://localhost:5173/newuser'; // URL till backend-servern
    };

    return (
      <div style={{ marginLeft: "220px", padding: "20px" }}>
        <h2>Svenska Elsparkcyklar AB</h2>
        <br></br>
        <p>Välkommen till oss. Vi sätter jorden i rullning.</p>
        <br></br>
        <img src="./src/assets/scooter.png" width="420" height="320"></img>
        <p><button onClick={handleLogin} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Logga in
      </button></p>
      </div>
    );
  };
  
  export default Home;