import { useState, type ReactNode } from "react";
import { CartContext, type Cart } from "./CartContext";
import { createCart } from "../services/apiCarts";

type CartProviderProp = {
  children: ReactNode;
};

export function CartProvider({ children }: CartProviderProp) {
  const [cart, setCart] = useState<Cart | null>(null);

  async function cartCreation() {
    try {
      const cart = await createCart();
      console.log(cart);

      if (cart.success) {
        setCart(cart.data);
        localStorage.setItem("cartId", cart.data.id);
        return cart.data;
      }
    } catch (error) {
      console.error("Cart creation error", error);

      throw Error("Cart creation failed");
    }
  }


  return (
    <CartContext.Provider value={{ cart, setCart, cartCreation }}>
      {children}
    </CartContext.Provider>
  );
}
