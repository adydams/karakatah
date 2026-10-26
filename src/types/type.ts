export type ProductProp = {
  id: string;
  name: string;
  price: string;
  currentPrice?: string;
  isDiscounted?: boolean;
  image?: string;
  availableStock?: number;
};
