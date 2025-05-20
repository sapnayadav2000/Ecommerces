import React, { createContext, useContext, useState, useEffect } from "react";
import AddtoCartServices from "../services/AddtoCart";

// Create context
const AddtoCartContext = createContext();

// Provider component
export const CartProvider = ({ children }) => {
  const [CartCount, setCartCount] = useState(0);

const fetchCartCount = async () => {
  try {
    const response = await AddtoCartServices.getCartCount();
    const cart = response?.data;

    setCartCount(cart?.totalItems || 0); // <-- Correctly extract totalItems
  } catch (err) {
    console.error("Failed to fetch cart count", err);
    setCartCount(0);
  }
};


  useEffect(() => {
    fetchCartCount();
  }, []);

  return (
    <AddtoCartContext.Provider value={{ CartCount, setCartCount, fetchCartCount }}>
      {children}
    </AddtoCartContext.Provider>
  );
};

// Custom hook to use the cart context
export const useCart = () => useContext(AddtoCartContext);
