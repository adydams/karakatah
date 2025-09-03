import { MdDensitySmall } from "react-icons/md";
import ProductCard from "../components/ProductCard";

const categories = [
  {
    title: "Dresses",
  },
  {
    title: "Tops",
  },
  {
    title: "Shirts",
  },
  {
    title: "Pants",
  },
  {
    title: "Jackets",
  },
  {
    title: "Underweaar",
  },
];

const products = [
  {
    id: "1",
    name: "Women's Summer Floral Dress",
    price: "12500",
    image: "bg.png",
  },
  {
    id: "2",
    name: "Men's Classic White Shirt",
    price: "9000",
    image: "bg.png",
  },
  {
    id: "3",
    name: "Kids' Playful Sneakers",
    price: "7800",
    image: "bg.png",
  },
  {
    id: "4",
    name: "Women's High-Waist Jeans",
    price: "15200",
    image: "bg.png",
  },
  {
    id: "5",
    name: "Men's Casual Polo Shirt",
    price: "8500",
    image: "bg.png",
  },
  {
    id: "6",
    name: "Kids' Cartoon Print T-shirt",
    price: "4200",
    image: "bg.png",
  },
  {
    id: "7",
    name: "Women's Leather Handbag",
    price: "18000",
    image: "bg.png",
  },
  {
    id: "8",
    name: "Men's Slim Fit Jeans",
    price: "14000",
    image: "bg.png",
  },
  {
    id: "9",
    name: "Kids' Hooded Jacket",
    price: "10500",
    image: "bg.png",
  },
  {
    id: "10",
    name: "Women's Elegant Heels",
    price: "20000",
    image: "bg.png",
  },
  {
    id: "11",
    name: "Men's Running Sneakers",
    price: "17000",
    image: "bg.png",
  },
  {
    id: "12",
    name: "Women's Office Blazer",
    price: "22000",
    image: "bg.png",
  },
  {
    id: "13",
    name: "Kids' Denim Overalls",
    price: "9500",
    image: "bg.png",
  },
  {
    id: "14",
    name: "Men's Formal Suit Jacket",
    price: "28000",
    image: "bg.png",
  },
  {
    id: "15",
    name: "Women's Casual Crop Top",
    price: "6500",
    image: "bg.png",
  },
  {
    id: "16",
    name: "Kids' Sports Tracksuit",
    price: "12000",
    image: "bg.png",
  },
  {
    id: "17",
    name: "Men's Hooded Sweatshirt",
    price: "13500",
    image: "bg.png",
  },
  {
    id: "18",
    name: "Women's Maxi Gown",
    price: "19500",
    image: "bg.png",
  },
  {
    id: "19",
    name: "Kids' School Backpack",
    price: "8000",
    image: "bg.png",
  },
  {
    id: "20",
    name: "Men's Leather Belt",
    price: "5000",
    image: "bg.png",
  },
  {
    id: "21",
    name: "Women's Sports Leggings",
    price: "11000",
    image: "bg.png",
  },
  {
    id: "22",
    name: "Men's Casual Shorts",
    price: "7500",
    image: "bg.png",
  },
  {
    id: "23",
    name: "Kids' Party Dress",
    price: "13000",
    image: "bg.png",
  },
  {
    id: "24",
    name: "Women's Stylish Sunglasses",
    price: "6000",
    image: "bg.png",
  },
];

export default function Homepage() {
  const categoriesLength = categories.length;

  console.log(categoriesLength);

  return (
    <>
      <main className="flex w-full items-center justify-center py-5 lg:h-[70vh]">
        <div className="w-[92%] items-center justify-between lg:flex lg:h-full lg:w-[85%]">
          <div className="bg-beige h-[250px] w-full lg:h-full lg:w-[65%]"></div>
          <div className="mt-5 flex w-full items-center justify-between gap-5 lg:mt-0 lg:h-full lg:w-[30%] lg:flex-col">
            <div className="bg-beige flex h-[200px] w-[50%] items-center justify-center lg:h-[50%] lg:w-full">
              Advert
            </div>
            <div className="bg-beige flex h-[200px] w-[50%] items-center justify-center lg:h-[50%] lg:w-full">
              Advert
            </div>
          </div>
        </div>
      </main>
      <section className="my-2 flex w-full flex-col items-center justify-center font-bold">
        <div className="bg-orange font-primary flex w-[92%] items-center justify-start gap-10 py-2 text-xs text-white lg:w-[85%]">
          <h2 className="flex cursor-pointer items-center justify-start gap-1 font-medium">
            <MdDensitySmall size={20} /> <span>All Categories</span>
          </h2>
          <div
            className="hidden w-[80%] lg:grid"
            style={{
              gridTemplateColumns: `repeat(${categoriesLength}, minmax(0, 1fr))`,
            }}
          >
            {categories.map((category, index) => (
              <p
                className="cursor-pointer transition-all duration-700 hover:font-medium"
                key={index}
              >
                {category.title}
              </p>
            ))}
          </div>
        </div>
        <div className="mt-4 grid w-[92%] grid-cols-1 gap-x-7 gap-y-5 md:grid-cols-2 lg:w-[85%] lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              name={product.name}
              id={product.id}
              key={product.id}
              image={product.image}
              price={product.price}
            />
          ))}
        </div>
      </section>
    </>
  );
}
