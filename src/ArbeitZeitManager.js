// ArbeitZeitManager.js
import React, { useState } from 'react';

const ArbeitZeitManagerContext = React.createContext();

function ArbeitZeitManagerProvider({ children }) {
  const [arbeitZeiten, setArbeitZeiten] = useState([]);

  const addArbeitZeit = (arbeitZeit) => {
    setArbeitZeiten([...arbeitZeiten, arbeitZeit]);
  };

  return (
    <ArbeitZeitManagerContext.Provider value={{ arbeitZeiten, addArbeitZeit }}>
      {children}
    </ArbeitZeitManagerContext.Provider>
  );
}

function useArbeitZeitManager() {
  const context = React.useContext(ArbeitZeitManagerContext);
  if (context === undefined) {
    throw new Error('useArbeitZeitManager must be used within a ArbeitZeitManagerProvider');
  }
  return context;
}

export { ArbeitZeitManagerProvider, useArbeitZeitManager };
