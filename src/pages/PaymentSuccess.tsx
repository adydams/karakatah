import { useNavigate, useSearchParams } from "react-router";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { formatPrice } from "../utils/utils";
import { getOrder } from "../services/apiCheckout";
import { useQuery } from "@tanstack/react-query";
import InvoicePulseSkeleton from "../components/InvoicePulseSkeleton";
import { useEffect, useState } from "react";
import { FaDownload, FaShareAlt, FaWhatsapp, FaEnvelope } from "react-icons/fa";
import toast from "react-hot-toast";

type OrderItem = {
  id: string;
  price: string;
  quantity: number;
  subtotal: string;
  discount?: {
    name: string;
    percentage: number;
    value: number;
  };
  product: {
    name: string;
    image: string | null;
  };
};

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [showShareMenu, setShowShareMenu] = useState(false);

  const navigate = useNavigate();

  console.log(orderId);

  const {
    data: order,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrder(orderId!),
    enabled: !!orderId,
  });

  console.log(order);

  // ✅ Redirect safely AFTER render
  useEffect(() => {
    if (!orderId) {
      navigate("/");
    }
  }, [orderId, navigate]);

  // ❌ If error fetching order
  if (isError) {
    return (
      <>
        <Navbar />
        <div className="flex h-[60vh] items-center justify-center">
          <p className="font-semibold text-red-500">
            Failed to load order. Please try again.
          </p>
        </div>
        <Footer />
      </>
    );
  }

  const date = order?.data.order?.createdAt
    ? new Date(order.data.order.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "N/A";
  const orderNumber = order?.data.order?.id;
  const status = order?.data.order?.status;

  const address = order?.data.order?.shippingAddress ? [
    {
      title: "Name",
      value: order.data.order.customer.fullName,
    },
    {
      title: "Address",
      value: order.data.order.shippingAddress.address,
    },
    {
      title: "Phone",
      value: order.data.order.customer.phone,
    },
    {
      title: "Email",
      value: order.data.order.customer.email,
    },
    {
      title: "Discount",
      value: order.data.order.discount ? `₦${formatPrice(order.data.order.discount.value)}` : "0",
    },
  ] : [];

  const orderInfo = [
    {
      title: "Date",
      value: date,
    },
    {
      title: "Order Number",
      value: orderNumber,
    },
    {
      title: "Status",
      value: status,
    },
  ];

  const handleDownloadPdf = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/orders/invoice/${orderId}/pdf`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (!response.ok) throw new Error("PDF download failed");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Invoice_${orderId?.slice(0, 8)}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
      toast.error("Failed to download PDF");
    }
  };

  const shareInvoice = (platform: 'whatsapp' | 'email' | 'link') => {
    const shareUrl = `${window.location.href}`;
    const text = `Check out my order invoice #${orderId?.slice(0, 8)} from Karakata Commerce: ${shareUrl}`;

    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    } else if (platform === 'email') {
      window.location.href = `mailto:?subject=My Order Invoice #${orderId?.slice(0, 8)}&body=${encodeURIComponent(text)}`;
    } else if (platform === 'link') {
      navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
    }
    setShowShareMenu(false);
  };

  const products: OrderItem[] = order?.data.items ?? [];
  const orderData = order?.data.order;

  const subTotal = products.reduce((total, product) => {
    return total + Number(product.subtotal);
  }, 0);

  const shipping = orderData?.shippingFee || 0;
  const total = orderData?.totalAmount || 0;
  const globalDiscount = orderData?.discount;

  return (
    <>
      <Navbar />

      <main
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.9),  rgba(255,255,255,0.8)), url('balloons2.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="text-charcoal-gray flex w-full items-center justify-center pt-20 pb-10 md:h-[90vh] md:pt-0"
      >
        {isLoading ? (
          <InvoicePulseSkeleton />
        ) : (
          <div className="h-full w-[92%] items-center justify-between gap-5 md:flex md:w-4/5">
            <div className="flex w-full flex-col items-start justify-center gap-5 md:w-1/2">
              <h1 className="font-primary text-3xl font-bold md:text-5xl md:leading-16">
                Thank you for your purchase!
              </h1>
              <p className="text-dark-gray max-w-[90%] text-sm md:max-w-[70%]">
                Your order will be processed within 24 hours during working
                days. We will notify you by email once your order has been
                shipped.
              </p>

              <h3 className="font-primary mt-6 text-lg font-bold md:text-xl">
                Billing Address
              </h3>
              <div className="mt-3 flex flex-col gap-2">
                {address.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-start gap-2 text-sm"
                  >
                    <span className="font-semibold text-gray-500 min-w-[80px]">{item.title}:</span>
                    <span className="text-charcoal-gray font-medium">{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-5 mt-8">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleDownloadPdf}
                    className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-full text-sm font-bold hover:bg-orange-700 transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <FaDownload size={16} />
                    Download Invoice
                  </button>

                  <div className="relative flex-1">
                    <button
                      onClick={() => setShowShareMenu(!showShareMenu)}
                      className="w-full px-6 py-3 bg-white border-2 border-orange-600 text-orange-600 rounded-full text-sm font-bold hover:bg-orange-50 transition-all shadow-sm flex items-center justify-center gap-2"
                    >
                      <FaShareAlt size={16} />
                      Share Invoice
                    </button>

                    {showShareMenu && (
                      <div className="absolute bottom-full left-0 mb-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-2">
                        <button
                          onClick={() => shareInvoice('whatsapp')}
                          className="w-full px-4 py-2 text-left text-xs hover:bg-gray-50 flex items-center gap-3 text-gray-700"
                        >
                          <FaWhatsapp className="text-green-500" size={14} /> WhatsApp
                        </button>
                        <button
                          onClick={() => shareInvoice('email')}
                          className="w-full px-4 py-2 text-left text-xs hover:bg-gray-50 flex items-center gap-3 text-gray-700"
                        >
                          <FaEnvelope className="text-blue-500" size={14} /> Email
                        </button>
                        <button
                          onClick={() => shareInvoice('link')}
                          className="w-full px-4 py-2 text-left text-xs hover:bg-gray-50 flex items-center gap-3 text-gray-700"
                        >
                          <FaShareAlt className="text-gray-500" size={14} /> Copy Link
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/invoice/${orderId}`)}
                  className="w-full py-3 text-sm font-semibold text-gray-600 hover:text-orange-600 transition-all flex items-center justify-center gap-2 underline underline-offset-4"
                >
                  Track your Order ➔
                </button>
              </div>
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
                  <div
                    key={product.id}
                    className="flex h-30 w-full items-start justify-between rounded-2xl bg-white/30 pr-5 shadow-sm"
                  >
                    <div className="flex h-full items-start justify-start gap-4">
                      <div className="h-full w-30 overflow-hidden rounded-xl text-xs">
                        <img
                          className="h-full w-full object-cover"
                          src={product.product.image || "/balloons.jpg"}
                          alt={product.product.name}
                        />
                      </div>
                      <div className="py-5">
                        <h4 className="text-primary font-semibold">
                          {product.product.name}
                        </h4>
                        <p className="mt-1 text-xs">
                          Quantity:{" "}
                          <span className="font-bold">{product.quantity}</span>
                        </p>
                        {product.discount && (
                          <p className="mt-1 text-xs text-green-600 font-medium">
                            {product.discount.name} (-₦{formatPrice(product.discount.value)})
                          </p>
                        )}
                      </div>
                    </div>
                    <p className="font-primary mt-5 font-bold">
                      ₦{formatPrice(product.price)}
                    </p>
                  </div>
                ))}

                {/* Total */}
                <div className="border-charcoal-gray/20 flex w-full flex-col items-start justify-start gap-2 border-y border-dashed p-5 text-xs font-semibold text-gray-600">
                  <p className="flex w-full items-center justify-between">
                    Sub Total{" "}
                    <span className="font-primary">
                      ₦{formatPrice(subTotal)}
                    </span>
                  </p>
                  {globalDiscount && (
                    <p className="flex w-full items-center justify-between text-green-600">
                      {globalDiscount.code} (-₦{formatPrice(globalDiscount.value)})
                    </p>
                  )}
                    <div className="flex flex-col gap-1">
                      <p className="flex w-full items-center justify-between text-xs text-gray-500">
                        Courier Base Fee{" "}
                        <span className="font-medium">
                          ₦{formatPrice(orderData?.shippingDetails?.baseFee || 0)}
                        </span>
                      </p>
                      <p className="flex w-full items-center justify-between text-xs text-gray-500">
                        Sourcing Fee{" "}
                        <span className="font-medium">
                          ₦{formatPrice(orderData?.shippingDetails?.sourcingFee || 0)}
                        </span>
                      </p>
                      <p className="flex w-full items-center justify-between mt-1 border-t border-gray-100 pt-1">
                        Shipping Total{" "}
                        <span className="font-primary font-bold">
                          ₦{formatPrice(shipping)}
                        </span>
                      </p>
                    </div>
                </div>

                <h3 className="font-primary flex w-full items-center justify-between text-xl font-bold">
                  <span>Order Total</span>{" "}
                  <span className="">₦{formatPrice(total)}</span>
                </h3>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
