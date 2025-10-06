import { Link } from "react-router";
import { useCart } from "../contexts/hooks/useCart";
import { formatPrice } from "../utils/utils";
import Spinner from "./Spinner";

// import { MdOutlineRemoveShoppingCart } from "react-icons/md";

export default function CartItemCardNav() {
  // const {user} =
  const { cart } = useCart();

 const items = cart?.data?.items ?? [];

  console.log(cart);
  console.log("This are the products in the cart", items);

  if (!cart)
    return (
      <div className="absolute top-[55px] left-[-130%] flex w-[300px] flex-col items-center justify-center bg-white px-3 py-2 shadow-md/10">
        <div className="w-full">
          <img src="images/cart_toon.svg" alt="" />
        </div>
        <Link
          to={""}
          className="bg-muted-green/90 hover:bg-muted-green font-primary flex w-full items-center justify-center py-3 text-sm font-bold text-white"
        >
          Start shopping
        </Link>
      </div>
    );

  if (items) {
    if (items?.length <= 0)
      return (
        <div className="absolute top-[100px] left-[-130%] flex w-[300px] flex-col items-center justify-center bg-white px-3 py-2 shadow-md/10">
          <div className="w-full">
            <img src="images/cart_toon.svg" alt="" />
          </div>
          <Link
            to={""}
            className="bg-muted-green/90 hover:bg-muted-green font-primary flex w-full items-center justify-center py-3 text-sm font-bold text-white"
          >
            Empty Cart
          </Link>
        </div>
      );
  }

  return (
    <div className="absolute top-[57px] left-[-130%] flex w-[300px] flex-col items-center justify-center bg-white px-3 py-2 shadow-md/10">
      {!items ? (
        <Spinner size="big" />
      ) : (
        items?.map((product) => (
          <div
            key={product.id}
            className="border-dark-gray/20 flex h-[80px] w-full items-center justify-start gap-2 border-b py-1.5"
          >
            <div className="h-full w-[65px] overflow-hidden rounded-lg">
              <img src="bg.png" className="h-full w-full object-cover" alt="" />
            </div>
            <div className="flex h-full flex-col items-start justify-center text-xs">
              <h2 className="font-primary text-xs font-medium lg:text-lg">
                Zealot s67
              </h2>
              <p className="font-light">
                Price:{" "}
                <span className="font-primary text-muted-green font-bold">
                  ₦{formatPrice(product.price)}
                </span>
              </p>
              <p className="font-light">
                Qty:{" "}
                <span className="font-primary font-medium">
                  {product.quantity}
                </span>
              </p>
            </div>
          </div>
        ))
      )}

      <h3 className="my-3 flex w-full items-center justify-start gap-2 text-sm font-medium">
        Total <span className="text-orange font-bold">₦500,000</span>
      </h3>
      <Link
        to={"/cart"}
        className="bg-muted-green/90 hover:bg-muted-green font-primary flex w-full items-center justify-center py-3 text-sm font-bold text-white"
      >
        View Cart
      </Link>
    </div>
  );
}
