"use client";
import { createContext, useContext, useEffect, useState } from "react";

type CartContextType = {
  cart: number;
  addToCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<number>(0);

  // Load cart count from localStorage when component mounts
  useEffect(() => {
    const savedCart = localStorage.getItem("cartCount");
    if (savedCart) {
      setCart(Number(savedCart)); // Restore cart count
    }
  }, []);

  const addToCart = () => {
    setCart((prev) => {
      const newCart = prev + 1;
      localStorage.setItem("cartCount", String(newCart)); // Save to localStorage
      return newCart;
    });
  };

  return (
    <CartContext.Provider value={{ cart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
