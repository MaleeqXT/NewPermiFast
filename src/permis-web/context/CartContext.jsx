import React, { createContext, useContext, useEffect, useReducer, useState } from "react";

/* ─── Context ───────────────────────────────────────────── */
export const CartContext = createContext(null);

/* ─── Reducer ───────────────────────────────────────────── */
const STORAGE_KEY = "ppf_cart";

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const existing = state.find(i => i.id === action.item.id);
      if (existing) {
        return state.map(i =>
          i.id === action.item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...state, { ...action.item, quantity: 1 }];
    }
    case "REMOVE":
      return state.filter(i => i.id !== action.id);
    case "INCREMENT":
      return state.map(i =>
        i.id === action.id ? { ...i, quantity: i.quantity + 1 } : i
      );
    case "DECREMENT":
      return state
        .map(i => i.id === action.id ? { ...i, quantity: i.quantity - 1 } : i)
        .filter(i => i.quantity > 0);
    case "CLEAR":
      return [];
    case "HYDRATE":
      return action.items;
    default:
      return state;
  }
}

/* ─── Provider ──────────────────────────────────────────── */
export const CartProvider = ({ children }) => {
  const [items, dispatch] = useReducer(cartReducer, []);
  const [drawerOpen, setDrawerOpen] = useState(false);

  /* Load from localStorage on mount */
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) dispatch({ type: "HYDRATE", items: JSON.parse(saved) });
    } catch (_) {}
  }, []);

  /* Persist on every change */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const totalQty   = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const addItem      = item  => dispatch({ type: "ADD",       item });
  const removeItem   = id    => dispatch({ type: "REMOVE",    id });
  const increment    = id    => dispatch({ type: "INCREMENT", id });
  const decrement    = id    => dispatch({ type: "DECREMENT", id });
  const clearCart    = ()    => dispatch({ type: "CLEAR" });
  const openDrawer   = ()    => setDrawerOpen(true);
  const closeDrawer  = ()    => setDrawerOpen(false);
  
  return (
    <CartContext.Provider value={{
      items, totalQty, totalPrice,
      addItem, removeItem, increment, decrement, clearCart,
      drawerOpen, openDrawer, closeDrawer,
    }}>
      {children}
    </CartContext.Provider>
  );
};

/* ─── Hook ──────────────────────────────────────────────── */
export const useCart = () => useContext(CartContext);
