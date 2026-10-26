import { useEffect } from "react";
import { useNavigate } from "react-router";
import CustomerChrome from "../components/customer/CustomerChrome";
import Footer from "../components/Footer";

export default function PaymentFailed() {
  const navigate = useNavigate();

  function handleTryAgain() {
    navigate(-1);
  }

  useEffect(() => {
    setTimeout(() => {
      navigate(-1);
    }, 5000);
  }, [navigate]);

  return (
    <>
      <CustomerChrome />
      <main className="flex h-[90vh] w-full items-center justify-center tracking-wide">
        <div className="flex flex-col items-center justify-center">
          <img
            className="w-[250px] md:w-[350px]"
            src="/failed.png"
            alt="Payment Failed"
          />
          <h1 className="mt-5 text-center text-xl font-medium md:text-3xl">
            Your payment has failed
          </h1>
          <p className="text-muted-foreground my-1 max-w-[90%] text-center text-sm text-gray-600">
            We're sorry, but your payment <br />
            could not be processed.
          </p>
          <button
            className="bg-orange hover:bg-orange/90 text-primary-foreground hover:bg-primary/90 mt-6 cursor-pointer rounded-full px-20 py-2 font-semibold text-white"
            onClick={handleTryAgain}
          >
            Try Again
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
}
