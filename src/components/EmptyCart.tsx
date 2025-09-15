import { Link } from "react-router";



export default function EmptyCart() {
  return (
    <div className="lg:[85%] font-primary flex h-[500px] w-[92%] flex-col items-center justify-center space-y-5 rounded-2xl bg-white/65">
      <img
        className="w-[200px] rounded-full"
        src="images/cart_toon.svg"
        alt=""
      />
      <h1 className="text-lg font-medium">Your Cart is empty!</h1>
      <p className="max-w-[300px] text-center text-sm lg:max-w-full">
        Browse our categories and discover our best deals
      </p>
      <Link
        className="bg-orange hover:bg-orange/90 rounded-md px-6 py-3 font-medium text-white"
        to="/"
      >
        Start Shopping
      </Link>
    </div>
  );
}
