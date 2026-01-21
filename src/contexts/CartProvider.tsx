import { useEffect, useState, type ReactNode } from "react";
import { CartContext, type Cart } from "./CartContext";
import { createCart, getCart } from "../services/apiCarts";
import { getCartIdFromToken } from "../utils/utils";
import toast from "react-hot-toast";

type CartProviderProp = {
  children: ReactNode;
};

export function CartProvider({ children }: CartProviderProp) {
  const [cart, SetCart] = useState<Cart | null>(null);

  async function cartCreation() {
    try {
      const cart = await createCart();
      if (cart.success) {
        SetCart(cart.data);
        return cart.data;
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast("An unexpected error occurred");
      }
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");

    // if no token set the cart to null
    if (!token) {
      // no token = no user = reset cart
      SetCart(null);
    }

    async function initCart() {
      const cartId = getCartIdFromToken();

      if (cartId) {
        try {
          const existingCart = await getCart();
          if (existingCart.success) {
            SetCart(existingCart.data);

            return;
          }
        } catch (err) {
          console.error(err);
        }
      } else {
        // if no cartId or fetching failed → create new cart
        const newCart = await cartCreation();
        if (newCart) SetCart(newCart);
      }
    }
    initCart();
  }, []);

  return (
    <CartContext.Provider value={{ cart, SetCart, cartCreation }}>
      {children}
    </CartContext.Provider>
  );
}
