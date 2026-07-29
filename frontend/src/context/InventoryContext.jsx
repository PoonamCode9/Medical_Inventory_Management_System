import React, { createContext } from 'react';

export const InventoryContext = createContext(null);

export const InventoryProvider = ({ children }) => {
  return (
    <InventoryContext.Provider value={null}>
      {children}
    </InventoryContext.Provider>
  );
};
