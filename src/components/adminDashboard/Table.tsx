import Tableitems from "./Tableitems";

const products = [
  {
    image: "images/lappy.jpg",
    name: "Yoga Mat",
    date: "2025-10-17",
    price: 4500,
    totalEarning: 22500,
  },
  {
    image: "images/lappy.jpg",
    name: "Resistance Band Set",
    date: "2025-10-16",
    price: 3500,
    totalEarning: 17500,
  },
  {
    image: "images/lappy.jpg",
    name: "Workout Gloves",
    date: "2025-10-15",
    price: 2500,
    totalEarning: 12500,
  },
  {
    image: "images/lappy.jpg",
    name: "Skipping Rope",
    date: "2025-10-14",
    price: 1500,
    totalEarning: 7500,
  },
  {
    image: "images/lappy.jpg",
    name: "Gym Water Bottle",
    date: "2025-10-13",
    price: 2000,
    totalEarning: 10000,
  },
];

const headerFields = ["Product name", "Date Added", "Price", "Total Earning"];
export default function Table() {
  return (
    <>
      <div
        className="flex tableHead items-center overflow-x-scroll-scroll lg:grid w-full gap-2 px-5"
        style={{
          gridTemplateColumns: `repeat(${headerFields.length}, 1fr)`,
        }}
      >
        {headerFields.map((header, index) => (
          <p className="py-2 font-light" key={index}>
            {header}
          </p>
        ))}
      </div>

      {products.map((product, index) => (
        <Tableitems
          image={product.image}
          name={product.name}
          date={product.date}
          price={product.price}
          totalEarning={product.totalEarning}
          index={index}
          key={index}
        />
      ))}
    </>
  );
}
