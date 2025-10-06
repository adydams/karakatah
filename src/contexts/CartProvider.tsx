import { useEffect, useState, type ReactNode } from "react";
import { CartContext, type Cart } from "./CartContext";
import { createCart, getCart } from "../services/apiCarts";
import { getCartIdFromToken } from "../utils/utils";

type CartProviderProp = {
  children: ReactNode;
};

export function CartProvider({ children }: CartProviderProp) {
  const [cart, setCart] = useState<Cart | null>(null);

  async function cartCreation() {
    try {
      const cart = await createCart();
      if (cart.success) {
        setCart(cart.data);
        console.log(cart);
        return cart.data;
      }
    } catch (error) {
      console.error("Cart creation error", error);
      throw Error("Cart creation failed");
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");

    // if no token set the cart to null
    if (!token) {
      // no token = no user = reset cart
      setCart(null);
    
    }

    async function initCart() {
      const cartId = getCartIdFromToken();

      if (cartId) {
        try {
          const existingCart = await getCart();
          if (existingCart.success) {
            setCart(existingCart.data);

            return;
          }
        } catch (err) {
          console.error(err);
        }
      } else {
        // if no cartId or fetching failed → create new cart
        const newCart = await cartCreation();
        if (newCart) setCart(newCart);
      }
    }
    initCart();
  }, []);
  console.log(cart);

  return (
    <CartContext.Provider value={{ cart, setCart, cartCreation }}>
      {children}
    </CartContext.Provider>
  );
}
