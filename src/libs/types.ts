// Api Login type

export type ApiLoginType = {
  email: string;
  password: string;
};

export type categoryItem = {
  name: string;
  description: string;
  image?: File;
};

export type SubCategoryItem = {
  categoryId: string;
  name: string;
  description: string;
};
export type BrandItem = {
  name: string;
  description: string;
  logo: string;
};

export type ProductPayload = {
  name: string;
  description: string;
  price: number | string;
  stockQuantity: number | string;
  categoryId: string;
  subCategoryId: string;
  brandId: string;
  weightKg?: string;
  lengthCm?: string;
  widthCm?: string;
  heightCm?: string;
  logisticsCategoryId?: string;
  boxSizeId?: string;
  pickupStations?: Array<{
    stationId?: string;
    initialStock: number;
  }>;
  fulfillmentMethod?: "RIDER_PICKUP" | "HUB_DROPOFF";
  fulfillmentHubId?: string;
  discounts?: any[];
  images: File[]; // 👈 This is important
};
