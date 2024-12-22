const Home = () => {
    return (
      <div>
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
      <button className="button" type="submit">
          Submit
        </button>
        </form>
      
      </div>
    );
  };
  
  export default Home;