import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function ResultsComponent() {
  const location = useLocation();
  const [address, setAddress] = useState('');

  // Hämta query-parametern "address" från URL:en
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const addressParam = queryParams.get('address');
    setAddress(addressParam || 'Ingen adress angiven');
  }, [location.search]);

  return (
    <div>
      <h2>Resultat</h2>
      <p>Du sökte efter: <strong>{address}</strong></p>

      {/* Här kan du lägga till logik för att hämta data från API */}
    </div>
  );
}

export default ResultsComponent;

