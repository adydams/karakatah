import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

export default function PaymentVerify() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "failed">(
    "loading",
  );

  useEffect(() => {
    async function verifyPayment() {
      try {
        const reference = searchParams.get("reference");
        const orderId = searchParams.get("orderId");
        const gateway = searchParams.get("gateway");

        const res = await fetch(
          `/api/payments/verify?gateway=${gateway}&orderId=${orderId}&reference=${reference}`,
        );

        const data = await res.json();

        if (data.success) {
          setStatus("success");
        } else {
          setStatus("failed");
        }
      } catch {
        setStatus("failed");
      }
    }

    verifyPayment();
  }, [searchParams]);

  // UI STATES
  if (status === "loading") {
    return <h1 className="mt-20 text-center">Verifying payment...</h1>;
  }

  if (status === "success") {
    return (
      <div className="mt-20 text-center">
        <h1 className="text-2xl font-bold text-green-600">
          Payment Successful 🎉
        </h1>
        <p>Your order has been confirmed.</p>
      </div>
    );
  }

  return (
    <div className="mt-20 text-center">
      <h1 className="text-2xl font-bold text-red-600">Payment Failed ❌</h1>
      <p>Please try again.</p>
    </div>
  );
}
