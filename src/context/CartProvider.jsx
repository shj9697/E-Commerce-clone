import { createContext, useContext, useEffect, useState } from "react";
import { addToCartAPI, getCartAPI, productDeleteFromCartAPI, updateCartItemAPI } from "../api/cartApi";
import toast from "react-hot-toast";
import { useAuth } from "./AuthProvider";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [], totalItems: 0, totalAmount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // A profile update replaces the user object; only signing in or out should reload the cart
  const loggedIn = !!user;

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const cartData = await getCartAPI();
        if (!cancelled) {
          if (cartData.status) setCart(cartData.data);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [loggedIn]);

  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      toast.error("Please login");
      return false;
    }
    // The cart API never throws; a failure comes back as status: false with the server's message
    setLoading(true);
    const response = await addToCartAPI(productId, quantity);
    setLoading(false);
    if (!response.status) {
      toast.error(response.message);
      return false;
    }
    setCart(response.data);
    toast.success("Item added to Cart");
    return true;
  };

  const removeFromCart = async (productId) => {
    const checkQuantity = cart.items.find((cartItems) => cartItems.productId === productId);
    setLoading(true);
    const response = await updateCartItemAPI(productId, checkQuantity?.quantity - 1);
    setLoading(false);
    if (!response.status) {
      toast.error(response.message);
      return false;
    }
    setCart(response.data);
    toast.success('Item removed from cart');
    return true;
  };

  const productDeleteFromCart = async (productId) => {
    setLoading(true);
    const response = await productDeleteFromCartAPI(productId);
    setLoading(false);
    if (!response.status) {
      toast.error(response.message);
      return false;
    }
    setCart(response.data);
    toast.success('Item removed from cart');
    return true;
  };

  // Placing an order empties the cart on the server, so reload it afterwards
  const refreshCart = async () => {
    const response = await getCartAPI();
    if (response.status) setCart(response.data);
  };

  const value = { cart, addToCart, removeFromCart, productDeleteFromCart, refreshCart, cartLoading: loading, cartError: error };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
};
