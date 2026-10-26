import React, { useState, useEffect } from "react";
import {
  getDiscounts,
  createDiscount,
  updateDiscount,
  toggleDiscountStatus,
  deleteDiscount
} from "../../services/apiAdmin";
import Spinner from "../../components/Spinner";
import toast from "react-hot-toast";
import { FiPlus, FiEdit, FiTrash2, FiPower } from "react-icons/fi";

// Note: I'll need to add these functions to apiAdmin.ts
// For now, I'll assume they exist or I'll add them in the next step.

export default function Discounts() {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    code: "",
    type: "PERCENTAGE",
    value: "",
    minOrderAmount: 0,
    maxUses: "",
    expiresAt: "",
    isActive: true,
    isAutomatic: false,
    displayInAdverts: false,
    advertStartDate: "",
    advertEndDate: "",
  });

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      const res = await getDiscounts();
      setDiscounts(res.data || []);
    } catch {
      toast.error("Failed to fetch discounts");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingDiscount) {
        await updateDiscount(editingDiscount.id, formData);
        toast.success("Discount updated successfully");
      } else {
        await createDiscount(formData);
        toast.success("Discount created successfully");
      }
      setIsModalOpen(false);
      setEditingDiscount(null);
      setFormData({ title: "", code: "", type: "PERCENTAGE", value: "", minOrderAmount: 0, maxUses: "", expiresAt: "", isActive: true, isAutomatic: false, displayInAdverts: false, advertStartDate: "", advertEndDate: "" });
      fetchDiscounts();
    } catch {
      toast.error(err.message || "An error occurred");
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await toggleDiscountStatus(id);
      fetchDiscounts();
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this discount?")) return;
    try {
      await deleteDiscount(id);
      fetchDiscounts();
      toast.success("Discount deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="font-primary w-full p-5 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mt-8 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Promotions & Coupons</h1>
          <p className="text-gray-500 text-sm">Manage automatic sales and manual discount codes.</p>
        </div>

        <div className="rounded-lg border border-orange-100 bg-orange-50/50 p-3 space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={formData.displayInAdverts}
              onChange={(e) => setFormData({...formData, displayInAdverts: e.target.checked})}
            />
            Display this discount in adverts
          </label>
          {formData.displayInAdverts && (
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Advert starts
                <input
                  type="datetime-local"
                  className="mt-1 w-full p-2 border border-gray-300 rounded-lg font-normal normal-case"
                  value={formData.advertStartDate}
                  onChange={(e) => setFormData({...formData, advertStartDate: e.target.value})}
                  required
                />
              </label>
              <label className="text-xs font-bold text-gray-500 uppercase">
                Advert ends
                <input
                  type="datetime-local"
                  className="mt-1 w-full p-2 border border-gray-300 rounded-lg font-normal normal-case"
                  value={formData.advertEndDate}
                  onChange={(e) => setFormData({...formData, advertEndDate: e.target.value})}
                  required
                />
              </label>
            </div>
          )}
        </div>
        <button
          onClick={() => { setEditingDiscount(null); setIsModalOpen(true); }}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-orange-700 transition shadow-md"
        >
          <FiPlus /> Create Discount
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold">
            <tr className="border-b">
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Code/Label</th>
              <th className="px-6 py-3">Value</th>
              <th className="px-6 py-3">Min Order</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {discounts.map((d) => (
              <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${d.isAutomatic ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                    {d.isAutomatic ? 'Automatic' : 'Manual'}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium text-gray-800">
                  <div>{d.title}</div>
                  <div className="text-xs font-normal text-gray-500">{d.isAutomatic ? 'Automatic promotion' : d.code}</div>
                </td>
                <td className="px-6 py-4">
                  {d.type === 'PERCENTAGE' ? `${d.value}%` : `₦${d.value}`}
                </td>
                <td className="px-6 py-4 text-gray-500">₦{d.minOrderAmount}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleToggleStatus(d.id)}
                    className={`flex items-center gap-1 text-xs font-bold ${d.isActive ? 'text-green-600' : 'text-red-600'}`}
                  >
                    <FiPower /> {d.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-3">
                    <button onClick={() => { setEditingDiscount(d); setFormData(d); setIsModalOpen(true); }} className="text-blue-600 hover:text-blue-800"><FiEdit /></button>
                    <button onClick={() => handleDelete(d.id)} className="text-red-600 hover:text-red-800"><FiTrash2 /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-bold text-gray-800">{editingDiscount ? 'Edit Discount' : 'Create New Discount'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-sm font-medium text-gray-700">Apply Automatically?</span>
                <input
                  type="checkbox"
                  className="w-4 h-4"
                  checked={formData.isAutomatic}
                  onChange={(e) => setFormData({...formData, isAutomatic: e.target.checked})}
                />
              </div>

              {!formData.isAutomatic && (
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Coupon Code</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Promotion Title</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="e.g. Back to School Savings"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
                <p className="mt-1 text-xs text-gray-400">This is the customer-facing title for banners and adverts.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Type</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FLAT">Flat Amount (₦)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Value</label>
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
                    value={formData.value}
                    onChange={(e) => setFormData({...formData, value: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Min Order Amount (₦)</label>
                <input
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
                  value={formData.minOrderAmount}
                  onChange={(e) => setFormData({...formData, minOrderAmount: parseFloat(e.target.value) || 0})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Max Uses</label>
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
                    value={formData.maxUses}
                    onChange={(e) => setFormData({...formData, maxUses: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Expires At</label>
                  <input
                    type="datetime-local"
                    className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
                    value={formData.expiresAt}
                    onChange={(e) => setFormData({...formData, expiresAt: e.target.value})}
                  />
                </div>
              </div>

              <button type="submit" className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 transition shadow-md mt-4">
                {editingDiscount ? 'Update Discount' : 'Create Discount'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
