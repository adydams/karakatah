import { createContext } from "react";

type Item = {
  name: string;
  price: number;
  quantity: number;
  id: string;
};

export type Cart = {
  data: {
    id: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    items: Item[];
  };
};
export type getCart = {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  items: Item[];
};

export type CartResponse = {
  success: boolean;
  cart: Cart;
};

type CartContextType = {
  cart: Cart | null;
  setCart: React.Dispatch<React.SetStateAction<Cart | null>>;
  cartCreation: () => Promise<CartResponse>;
};

export const CartContext = createContext<CartContextType | null>(null);
