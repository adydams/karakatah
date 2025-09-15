import CartItem from "../components/CartItem";
import EmptyCart from "../components/EmptyCart";

const cartList = [
  {
    name: "Jbl Speaker",
    price: "270000",
    quantity: "2",
  },
  {
    name: "Jbl Speaker",
    price: "300000",
    quantity: "2",
  },
  {
    name: "Zealot Bluetooth Speaker",
    price: "25000",
    quantity: "2",
  },
  {
    name: "Kida Kudz",
    price: "10000",
    quantity: "2",
  },
];

export default function CartPage() {
  return (
    <>
      <section className="flex w-full pb-5 items-center justify-center pt-14 lg:py-5">
        {cartList.length >= 1 ? (
          <div className="grid h-full w-[92%] grid-cols-1 gap-5 lg:w-[85%] lg:grid-cols-[2fr_1fr]">
            <div className="flex h-full w-full flex-col items-start justify-start space-y-3 rounded-lg bg-white px-3">
              <h1 className="font-primary border-dark-gray/10 w-full border-b py-3 text-lg font-semibold">
                Cart ({cartList.length})
              </h1>
              {cartList.map((item, index) => (
                <CartItem
                  key={index}
                  name={item.name}
                  price={item.price}
                  quantity={item.quantity}
                />
              ))}
            </div>
            <div className="h-[180px] w-full space-y-2 rounded-lg bg-white px-3 pb-3">
              <h1 className="border-dark-gray/10 w-full border-b py-3 text-base font-medium">
                CART SUMMARY
              </h1>
              <div className="border-dark-gray/10 flex items-center justify-between border-b py-3">
                <p>SubTotal</p>
                <p className="font-primary text-lg font-semibold">₦ 77,800</p>
              </div>
              <button className="bg-orange/90 hover:bg-orange font-primary w-full cursor-pointer rounded-lg py-3 font-semibold text-white">
                Checkout{" "}
              </button>
            </div>
          </div>
        ) : (
          <EmptyCart />
        )}
      </section>
    </>
  );
}
