import { useEffect, useState } from "react";
import { FaCheck, FaClock, FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";
import { decideStoreOrderApproval, getStoreOrderApprovals } from "../services/apiAdmin";

type ApprovalItem = {
  id: string;
  quantity: number;
  price: number;
  approvalDeadline: string;
  product?: { name: string };
  order?: { id: string; createdAt: string; user?: { name: string; email: string } };
};

export default function StoreOrderApprovals() {
  const [items, setItems] = useState<ApprovalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async () => {
    try {
      const response = await getStoreOrderApprovals();
      setItems(response.data || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Unable to load order approvals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const decide = async (item: ApprovalItem, decision: "approved" | "declined") => {
    const reason = decision === "declined" ? "Declined by store owner" : undefined;
    setBusyId(item.id);
    try {
      await decideStoreOrderApproval(item.id, decision, reason);
      toast.success(decision === "approved" ? "Order item accepted" : "Order item declined");
      setItems((current) => current.filter((entry) => entry.id !== item.id));
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Unable to update order approval");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl font-bold text-[#574235]">Order approvals</h1>
        <p className="mt-1 text-sm text-gray-500">Accept or decline each order item before its deadline.</p>
        {loading ? <p className="mt-8 text-sm text-gray-500">Loading pending approvals...</p> : (
          <div className="mt-6 space-y-4">
            {items.map((item) => (
              <article key={item.id} className="rounded-2xl border border-[#dec1af] bg-white p-5 shadow-sm">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                  <div>
                    <p className="font-bold text-gray-900">{item.product?.name || "Product"}</p>
                    <p className="mt-1 text-sm text-gray-500">Order #{item.order?.id?.slice(0, 8)} · Qty {item.quantity} · ₦{Number(item.price || 0).toLocaleString()}</p>
                    <p className="mt-2 flex items-center gap-2 text-xs font-semibold text-orange-600"><FaClock /> Respond by {new Date(item.approvalDeadline).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-3">
                    <button disabled={busyId === item.id} onClick={() => decide(item, "declined")} className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"><FaTimes /> Decline</button>
                    <button disabled={busyId === item.id} onClick={() => decide(item, "approved")} className="flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-50"><FaCheck /> Accept</button>
                  </div>
                </div>
              </article>
            ))}
            {items.length === 0 && <p className="rounded-xl bg-white p-8 text-center text-sm text-gray-500">No pending order approvals.</p>}
          </div>
        )}
      </div>
    </main>
  );
}
