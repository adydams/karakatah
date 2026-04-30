import { formatPrice } from "../utils/utils";

export default function PaymentSuccess() {
  const address = [
    {
      title: "Name",
      value: "John Doe",
    },
    {
      title: "Address",
      value: "123 Main St, City, State 12345",
    },
    {
      title: "Phone",
      value: "(123) 456-7890",
    },
    {
      title: "Email",
      value: "john.doe@example.com",
    },
  ];

  const orderInfo = [
    {
      title: "Date",
      value: "June 15, 2024",
    },
    {
      title: "Order Number",
      value: "#123456789",
    },
    {
      title: "Payment Method",
      value: "Masterard",
    },
  ];

  const products = [
    {
      name: "All in one chocolate combo",
      image: "images/t-shirt.jpg",
      price: 4000,
      quantity: 1,
    },
    {
      name: "All in one chocolate combo",
      image: "images/t-shirt.jpg",
      price: 4600,
      quantity: 2,
    },
    {
      name: "All in one chocolate combo",
      image: "images/t-shirt.jpg",
      price: 4600,
      quantity: 1,
    },
  ];

  const subTotal = products.reduce((total, product) => total + product.price * product.quantity, 0);
  const tax = subTotal * 0.1; // Assuming a tax rate of 10%
  const shipping = 5000;
  const total = subTotal + tax + shipping;

  return (
    <main
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(255,255,255,0.9),  rgba(255,255,255,0.8)), url('balloons2.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="text-charcoal-gray flex w-full items-center justify-center pt-20 pb-10 md:h-[90vh] md:pt-0"
    >
      <div className="h-full w-[92%] items-center justify-between gap-5 md:flex md:w-4/5">
        <div className="flex w-full flex-col items-start justify-center gap-5 md:w-1/2">
          <h1 className="font-primary text-3xl font-bold md:text-5xl md:leading-16">
            Thank you for your purchase!
          </h1>
          <p className="text-dark-gray max-w-[90%] text-sm md:max-w-[70%]">
            Your order will be processed within 24 hours during working days. We
            will notify you by email once your order has been shipped.
          </p>

          <h3 className="font-primary mt-4 text-lg font-bold md:text-xl">
            Billing address
          </h3>
          <ul className="text-charcoal-gray flex flex-col items-start justify-start gap-1 text-sm">
            {address.map((item, index) => (
              <li
                key={index}
                className="flex items-center justify-start gap-2.5"
              >
                <span className="font-semibold">{item.title}:</span>{" "}
                {item.value}
              </li>
            ))}
          </ul>

          <button className="bg-orange hover:bg-orange/90 cursor-pointer rounded-full px-16 py-2.5 text-sm font-semibold tracking-wide text-white">
            Track your Order
          </button>
        </div>

        {/* ORDER SUMMARY */}
        <div className="dash mt-10 flex max-h-[80vh] w-full flex-col items-start justify-start gap-5 overflow-scroll md:mt-0 md:w-1/2">
          <h2 className="font-primary text-xl font-bold md:text-2xl">
            Order Summary
          </h2>

          <div className="border-charcoal-gray/10 grid w-full grid-cols-3 gap-5 border-y-6 border-dotted px-5 py-5">
            {orderInfo.map((item, index) => (
              <div
                key={index}
                className={`flex flex-col items-start ${index < orderInfo.length - 1 ? "border-charcoal-gray/10 border-r" : ""} justify-start gap-1 text-sm`}
              >
                <p className="text-dark-gray">{item.title}</p>
                <p className="font-semibold">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="flex w-full flex-col items-start justify-start gap-5 text-sm">
            {/* Product item */}
            {products.map((product) => (
              <div className="flex h-30 w-full items-start justify-between rounded-2xl bg-white/30 pr-5 shadow-sm">
                <div className="flex h-full items-start justify-start gap-4">
                  <div className="h-full w-30 overflow-hidden rounded-xl text-xs">
                    <img
                      className="h-full w-full object-cover"
                      src={product.image}
                      alt={product.name}
                    />
                  </div>
                  <div className="py-5">
                    <h4 className="text-primary font-semibold">
                      {product.name}
                    </h4>
                    <p className="mt-1 text-xs">
                      Quantity:{" "}
                      <span className="font-bold">{product.quantity}</span>
                    </p>
                  </div>
                </div>
                <p className="font-primary mt-5 font-bold">
                  {formatPrice(product.price)}
                </p>
              </div>
            ))}

            {/* Total */}
            <div className="border-charcoal-gray/20 flex w-full font-semibold text-gray-600 flex-col items-start justify-start gap-2 border-y border-dashed p-5 text-xs">
              <p className="flex w-full items-center justify-between">
                Sub Total <span className="font-primary">₦{formatPrice(subTotal)}</span>
              </p>
              <p className="flex w-full items-center justify-between">
                Shipping <span className="font-primary">₦{formatPrice(shipping)}</span>
              </p>
              <p className="flex w-full items-center justify-between">
                Tax <span className="font-primary">₦{formatPrice(tax)}</span>
              </p>
            </div>

            <h3 className="font-primary flex w-full items-center justify-between text-xl font-bold">
              <span>Order Total</span>{" "}
              <span className="">₦{formatPrice(total)}</span>
            </h3>
          </div>
        </div>
      </div>
    </main>
  );
}
