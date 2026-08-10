import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import PaymentFailed from "./PaymentFailed";
import PaymentSuccess from "./PaymentSuccess";
import axiosInstance from "../services/apiClient";

// https://karakatang.vercel.app/api/payments/verify?gateway=paystack&orderId=24f88ba2-c956-4cdb-850b-dadcb042fc96&trxref=order_24f88ba2-c956-4cdb-850b-dadcb042fc96_1777545554878&reference=order_24f88ba2-c956-4cdb-850b-dadcb042fc96_1777545554878

export default function PaymentVerify() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");

  useEffect(() => {
    async function verifyPayment() {
      try {
        const reference = searchParams.get("reference");
        const orderId = searchParams.get("orderId");
        const gateway = searchParams.get("gateway");

        const res = await axiosInstance.get(
          `/api/payments/verify?gateway=${gateway}&orderId=${orderId}&reference=${reference}`,
        );

        const data = res.data;

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
