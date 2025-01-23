import { useState, useEffect } from 'react';

async function updateUserBalance(userId, newBalance) {
  const endpoint = `${baseURL}/users/${userId}`; // Anta att användare finns under `/users/{id}`
  const body = {
      balance: newBalance,
  };

  try {
      const response = await fetch(endpoint, {
          method: "PATCH", // Eller "PUT" om du vill uppdatera hela användaren
          headers: {
              "Content-Type": "application/json",
              "x-api-key": apiKey, // Skicka med API-nyckeln för autentisering
          },
          body: JSON.stringify(body),
      });

      if (!response.ok) {
          const errorMessage = `Error: ${response.status} ${response.statusText}`;
          console.error(errorMessage);
          toast(`Failed to update balance: ${response.statusText}`);
          return;
      }

      const data = await response.json();
      toast("Balance successfully updated!");
      console.log("Updated user balance:", data);

      return data; // Returnerar den uppdaterade användarens data om du vill använda den
  } catch (error) {
      console.error("Error updating balance:", error);
      toast("An error occurred while updating balance.");
  }
}




function DynamicForm() {
  const [selectedOption, setSelectedOption] = useState(""); // Håller koll på valt värde

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value); // Uppdaterar valt värde
 
    const [users, setUsers] = useState([]);
    let user_id="6775634df665dfbf9f5bf389"
  
    updateUserBalance(user_id, 555)
    
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
        setUsers(responseData.data); // Ensure this is the correct data structure
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });

  
  
      }, []);

      //console.log(localhost:5000/users/6775634df665dfbf9f5bf389?balance=450);
      
    };




  return (
    
    
    <div  className="App" style={{ marginLeft: "220px", padding: "20px" }}>
              <h2>Betalning</h2>
              <p>Du kan ha olika typer av betalning. </p><p>Antingen betalar du direkt med kreditkort eller så väljer du månadsinbetalning.</p>
      <form className="form">
      <div className="form__group">
        <label htmlFor="category" className="form__label">Välj typ av betalning:</label>
        <select
          id="category"
          name="category"
          className="form__select"
          value={selectedOption}
          onChange={handleOptionChange}
        >
          <option value="">-- Välj --</option>
          <option value="onetime">Engångsbetalning</option>
          <option value="month">Månadsbetalning</option>
        </select>
      </div>

      {/* Dynamiska fält baserat på valet */}
      {selectedOption === "onetime" && (
        <div>
          <div className="form__group">
            <label htmlFor="name" className="form__label">Namn på kreditkortet:</label>
            <input
              type="text"
              id="name"
              name="name"
              value="Bo Ek"
              className="form__input"
            />
          </div>
          <div className="form__group">
            <label htmlFor="cardno" className="form__label">Kortnummer:</label>
            <input
              type="text"
              id="cardno"
              name="cardno"
              value="5423 2356 8733 4320"
              className="form__input"
            />
          </div>
        <div className="form__group">
          <label htmlFor="carddate" className="form__label">Utgångsdatum:</label>
          <input
            type="text"
            id="carddate"
            name="carddate"
            value="12/26"
            className="form__input"
          />
        </div>
        <div className="form__group">
          <label htmlFor="cardno" className="form__label">CSV:</label>
          <input
            type="text"
            id="cardcsv"
            name="cardcsv"
            value="987"
            className="form__input"
          />
        </div>
        <div className="form__group">
          <label htmlFor="saldo" className="form__label">Belopp:</label>
          <input
            type="text"
            id="saldo"
            name="saldo"
            className="form__input"
          />
        </div>
      </div>
      )}

      {selectedOption === "month" && (
        <div>
          <div className="form__group">
            <label htmlFor="clearing" className="form__label">Clearingnummer:</label>
            <input
              type="text"
              id="clearing"
              name="clearing"
              className="form__input"
            />
          </div>
          <div className="form__group">
            <label htmlFor="account" className="form__label">Kontonummer:</label>
            <input
              type="text"
              id="account"
              name="account"
              className="form__input"
            />
          </div>
          <div className="form__group">
            <label htmlFor="day" className="form__label">Dag för dragning:</label>
            <input
              type="text"
              id="day"
              name="day"
              className="form__input"
            />
          </div>
          <div className="form__group">
            <label htmlFor="money" className="form__label">Belopp:</label>
            <input
              type="text"
              id="money"
              name="money"
              className="form__input"
            />
          </div>


        </div>
      )}

 

      <button type="submit" className="form__button">Skicka</button>
    </form>
    </div>
  );
}

export default DynamicForm;
