import { createContext } from "react";

type images = {
  url: string;
};
type Item = {
  quantity: number;
  id: string;
  product: {
    id: string;
    name: string;
    price: string;
    images: images[];
  };
};

export type Cart = {
  data: {
    id: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    items: Item[];
    totalAmount: string;
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
