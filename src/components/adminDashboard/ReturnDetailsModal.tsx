import React from "react";
import { useQuery } from "@tanstack/react-query";
import { apiReturn } from "../../services/apiReturns";
import Spinner from "../Spinner";

type Props = {
  returnId: string;
};

export default function ReturnDetailsModal({ returnId }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ["returnDetail", returnId],
    queryFn: () => apiReturn.getReturnStatus(returnId),
  });

  if (isLoading) return <div className="p-10 flex justify-center"><Spinner /></div>;
  if (!data?.data) return <div className="p-10 text-center text-gray-500">Return request not found.</div>;

  const req = data.data;

  return (
    <div className="p-lg space-y-lg">
      <div className="flex justify-between items-start border-b pb-md">
        <div>
          <h2 className="text-headline-md font-bold text-on-surface">Return Request Details</h2>
          <p className="text-body-sm text-on-surface-variant">ID: {req.id.slice(0, 12)}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
          req.status === 'approved' ? 'bg-green-100 text-green-600' :
          req.status === 'rejected' ? 'bg-red-100 text-red-600' :
          'bg-gray-100 text-gray-600'
        }`}>
          {req.status}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
        <div className="space-y-sm">
          <p className="text-xs font-bold text-outline uppercase">Customer</p>
          <p className="text-body-md font-medium">{req.user?.name || "Unknown"}</p>
          <p className="text-body-sm text-outline">{req.user?.email}</p>
        </div>
        <div className="space-y-sm">
          <p className="text-xs font-bold text-outline uppercase">Order Details</p>
          <p className="text-body-md font-medium">Order #{req.order?.id?.slice(0, 8)}</p>
          <p className="text-body-sm text-outline">Item: {req.orderItem?.product?.name}</p>
        </div>
      </div>

      <div className="space-y-md bg-surface-container-low p-md rounded-xl">
        <div>
          <p className="text-xs font-bold text-outline uppercase mb-1">Return Reason</p>
          <p className="text-body-md font-semibold">{req.reason}</p>
        </div>
        <div>
          <p className="text-xs font-bold text-outline uppercase mb-1">Detailed Description</p>
          <p className="text-body-sm text-on-surface-variant">{req.description || "No additional description provided."}</p>
        </div>
      </div>

      <div>
        <p className="text-xs font-bold text-outline uppercase mb-3">Evidence / Photos</p>
        <div className="grid grid-cols-3 gap-4">
          {req.evidence && req.evidence.length > 0 ? (
            req.evidence.map((url: string, i: number) => (
              <a key={i} href={url} target="_blank" rel="noreferrer" className="aspect-square rounded-lg overflow-hidden border border-surface-container hover:ring-2 hover:ring-primary transition-all">
                <img src={url} className="w-full h-full object-cover" alt={`evidence-${i}`} />
              </a>
            ))
          ) : (
            <p className="text-sm text-on-surface-variant italic">No images provided.</p>
          )}
        </div>
      </div>
    </div>
  );
}
