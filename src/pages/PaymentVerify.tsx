import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import PaymentFailed from "./PaymentFailed";
import PaymentSuccess from "./PaymentSuccess";

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
    return <PaymentSuccess />;
  }

  return <PaymentFailed />;
}
