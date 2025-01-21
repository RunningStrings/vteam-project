import { useState, useEffect } from 'react';

function App() {
  const [login, setLogin] = useState([]); // Starta med null eller en lämplig initial state

  useEffect(() => {
    // Hämta användardata när komponenten laddas
    fetch('http://localhost:5000/api/v1/login') //http://localhost:5000/api/v1
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); // Hämta JSON-responsen
      })
      .then((responseData) => {
        setLogin(responseData.data); // Uppdatera login state
      })
      .catch((error) => {
        console.error('Error fetching login:', error);
      });
  }, []); // Effekt körs bara en gång vid initial rendering

  // För att logga värdet av login när det har uppdaterats, använd en effekt
  useEffect(() => {
    if (login !== null) {
      console.log('Login data:', login); // Här får du den uppdaterade login-datan
    }
  }, [login]); // Kör när login-state ändras

  return (
    <div>
      <h1>Inloggningsdata</h1>
      {login ? (
        <pre>{JSON.stringify(login, null, 2)}</pre> // Visa login-datan
      ) : (
        <p>Laddar...</p> // Om login inte är laddad än
      )}
    </div>
  );
}

export default App;
