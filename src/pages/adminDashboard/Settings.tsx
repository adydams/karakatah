import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { getShippingSettings, updateShippingSettings } from "../../services/apiAdmin";
import { FiTrendingUp, FiMapPin } from "react-icons/fi";
import Spinner from "../../components/Spinner";
import toast from "react-hot-toast";

export default function Settings() {
  const [settings, setSettings] = useState({
    defaultCommissionRate: 0,
    internalBaseFee: 0,
    internalPricePerKm: 0,
    internalPricePerKg: 0,
    pickupFeePercent: 60,
    returnWindowDays: 5,
    vatPercentage: 0,
    productApprovalRequired: false,
    productApprovalSlaEnabled: true,
    productApprovalSlaHours: 48,
    orderItemApprovalWindowHours: 24,
    missedApprovalEscalationThreshold: 3,
    missedApprovalWindowDays: 30,
    autoUnlistAfterMissedApprovals: false,
  });
  const [originalSettings, setOriginalSettings] = useState({...settings});

  // Price Simulator State
  const [sim, setSim] = useState({
    pickupAddress: "",
    destinationAddress: "",
    distance: 0,
    weight: 2
  });
  const [simLoading, setSimLoading] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await getShippingSettings();
        if (res.data) {
          const data = {
            defaultCommissionRate: res.data.defaultCommissionRate || 0,
            internalBaseFee: res.data.internalBaseFee || 0,
            internalPricePerKm: res.data.internalPricePerKm || 0,
            internalPricePerKg: res.data.internalPricePerKg || 0,
            pickupFeePercent: res.data.pickupFeePercent ?? 60,
            returnWindowDays: res.data.returnWindowDays || 5,
            vatPercentage: res.data.vatPercentage || 0,
            productApprovalRequired: Boolean(res.data.productApprovalRequired),
            productApprovalSlaEnabled: res.data.productApprovalSlaEnabled !== false,
            productApprovalSlaHours: Number(res.data.productApprovalSlaHours ?? 48),
            orderItemApprovalWindowHours: Number(res.data.orderItemApprovalWindowHours ?? 24),
            missedApprovalEscalationThreshold: Number(res.data.missedApprovalEscalationThreshold ?? 3),
            missedApprovalWindowDays: Number(res.data.missedApprovalWindowDays ?? 30),
            autoUnlistAfterMissedApprovals: Boolean(res.data.autoUnlistAfterMissedApprovals),
          };
          setSettings(data);
          setOriginalSettings(data);
        }
      } catch (err) {
        console.error("Error loading settings:", err);
        toast.error("Failed to load system settings");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateShippingSettings(settings);
      toast.success("System settings updated successfully!");
      setOriginalSettings({...settings});
    } catch (err: any) {
      toast.error("Error saving settings: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Helper to get coordinates from address using Nominatim
  const geocode = async (address: string) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
    const data = await res.json();
    if (data && data.length > 0) {
      return { lat: data[0].lat, lon: data[0].lon };
    }
    throw new Error(`Could not find location: ${address}`);
  };

  // Calculate road distance using OSRM
  const updateDistance = async () => {
    if (!sim.pickupAddress || !sim.destinationAddress) return;

    setSimLoading(true);
    try {
      const start = await geocode(sim.pickupAddress);
      const end = await geocode(sim.destinationAddress);

      const osrmUrl = `http://router.project-osrm.org/route/v1/driving/${start.lon},${start.lat};${end.lon},${end.lat}?overview=false`;
      const res = await fetch(osrmUrl);
      const data = await res.json();

      if (data.routes && data.routes.length > 0) {
        const distanceMeters = data.routes[0].distance;
        setSim(prev => ({ ...prev, distance: parseFloat((distanceMeters / 1000).toFixed(2)) }));
      } else {
        throw new Error("Could not calculate route");
      }
    } catch (err: any) {
      console.error("Distance error:", err);
    } finally {
      setSimLoading(false);
    }
  };

  // Trigger distance update when addresses change
  useEffect(() => {
    const timer = setTimeout(() => {
      updateDistance();
    }, 800); // Debounce for 800ms to avoid hitting API on every keystroke
    return () => clearTimeout(timer);
  }, [sim.pickupAddress, sim.destinationAddress]);

  const calculateTotal = () => {
    const base = Number(settings.internalBaseFee || 0) +
                 (Number(sim.distance || 0) * Number(settings.internalPricePerKm || 0)) +
                 (Number(sim.weight || 0) * Number(settings.internalPricePerKg || 0));
    const vat = base * (Number(settings.vatPercentage || 0) / 100);
    const total = base + vat;
    return isNaN(total) ? "0.00" : total.toFixed(2);
  };

  if (loading) return <Spinner />;

  return (
    <div className="font-primary w-full bg-gray-50 min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-[#574235] tracking-tight">Global Settings</h1>
            <p className="text-gray-500 text-sm">Configure platform commissions, VAT, and internal fleet pricing.</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full md:w-auto px-6 py-2 bg-[#f57c00] text-white rounded-xl font-bold hover:bg-[#e67300] transition-all shadow-md disabled:bg-gray-300"
          >
            {saving ? "Saving..." : "Apply Changes"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Config Panel */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#dec1af]">
              <h3 className="text-lg font-bold text-[#574235] mb-6 flex items-center gap-2">
                <span className="w-2 h-6 bg-[#f57c00] rounded-full"></span>
                Internal Fleet Pricing
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-600">Base Delivery Fee (₦)</label>
                  <input
                    type="number"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f57c00] outline-none transition-all"
                    value={settings.internalBaseFee}
                    onChange={(e) => setSettings({...settings, internalBaseFee: parseFloat(e.target.value) || 0})}
                  />
                  <p className="text-[10px] text-gray-400">Fixed starting cost per delivery.</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#dec1af]">
                  <h3 className="text-lg font-bold text-[#574235] mb-2 flex items-center gap-2">
                    <span className="w-2 h-6 bg-[#f57c00] rounded-full"></span>
                    Product and Order Approvals
                  </h3>
                  <p className="text-sm text-gray-500 mb-6">
                    Control review requirements and how long store owners have to respond.
                  </p>
                  <div className="space-y-5">
                    <label className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 p-4">
                      <span>
                        <span className="block text-sm font-semibold text-gray-700">Require product approval</span>
                        <span className="block text-xs text-gray-400 mt-1">
                          New products stay pending until a Super Admin approves them.
                        </span>
                      </span>
                      <input
                        type="checkbox"
                        className="h-5 w-5 accent-[#f57c00]"
                        checked={settings.productApprovalRequired}
                        onChange={(e) => setSettings({ ...settings, productApprovalRequired: e.target.checked })}
                      />
                    </label>

                    <label className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 p-4">
                      <span>
                        <span className="block text-sm font-semibold text-gray-700">Enforce product approval SLA</span>
                        <span className="block text-xs text-gray-400 mt-1">
                          Notify Super Admins when pending reviews pass their deadline.
                        </span>
                      </span>
                      <input
                        type="checkbox"
                        className="h-5 w-5 accent-[#f57c00]"
                        checked={settings.productApprovalSlaEnabled}
                        onChange={(e) => setSettings({ ...settings, productApprovalSlaEnabled: e.target.checked })}
                      />
                    </label>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-600">Product review SLA (hours)</label>
                        <input
                          type="number"
                          min="1"
                          max="720"
                          step="1"
                          className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f57c00] outline-none transition-all"
                          value={settings.productApprovalSlaHours}
                          onChange={(e) => setSettings({ ...settings, productApprovalSlaHours: Number(e.target.value) || 1 })}
                        />
                        <p className="text-[10px] text-gray-400">Default: 48 hours. Allowed range: 1–720.</p>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-600">Store order approval window (hours)</label>
                        <input
                          type="number"
                          min="1"
                          max="168"
                          step="1"
                          className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f57c00] outline-none transition-all"
                          value={settings.orderItemApprovalWindowHours}
                          onChange={(e) => setSettings({ ...settings, orderItemApprovalWindowHours: Number(e.target.value) || 1 })}
                        />
                        <p className="text-[10px] text-gray-400">Default: 24 hours. Allowed range: 1–168.</p>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-600">Missed approval threshold</label>
                        <input type="number" min="1" max="100" className="w-full p-3 border border-gray-200 rounded-xl" value={settings.missedApprovalEscalationThreshold} onChange={(e) => setSettings({ ...settings, missedApprovalEscalationThreshold: Number(e.target.value) || 1 })} />
                        <p className="text-[10px] text-gray-400">Escalate after this many misses.</p>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-600">Missed approval window (days)</label>
                        <input type="number" min="1" max="365" className="w-full p-3 border border-gray-200 rounded-xl" value={settings.missedApprovalWindowDays} onChange={(e) => setSettings({ ...settings, missedApprovalWindowDays: Number(e.target.value) || 1 })} />
                        <p className="text-[10px] text-gray-400">Period used for escalation counting.</p>
                      </div>
                      <label className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 p-4">
                        <span>
                          <span className="block text-sm font-semibold text-gray-700">Auto-unlist after threshold</span>
                          <span className="block text-xs text-gray-400 mt-1">Soft escalation by default; enable to hide repeatedly missed products.</span>
                        </span>
                        <input type="checkbox" className="h-5 w-5 accent-[#f57c00]" checked={settings.autoUnlistAfterMissedApprovals} onChange={(e) => setSettings({ ...settings, autoUnlistAfterMissedApprovals: e.target.checked })} />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-600">Price per Kilometer (₦)</label>
                  <input
                    type="number"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f57c00] outline-none transition-all"
                    value={settings.internalPricePerKm}
                    onChange={(e) => setSettings({...settings, internalPricePerKm: parseFloat(e.target.value) || 0})}
                  />
                  <p className="text-[10px] text-gray-400">Added cost for every 1km traveled.</p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-600">Price per Kilogram (₦)</label>
                  <input
                    type="number"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f57c00] outline-none transition-all"
                    value={settings.internalPricePerKg}
                    onChange={(e) => setSettings({...settings, internalPricePerKg: parseFloat(e.target.value) || 0})}
                  />
                  <p className="text-[10px] text-gray-400">Added cost for every 1kg of weight.</p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-600">Pickup Fee (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f57c00] outline-none transition-all"
                    value={settings.pickupFeePercent}
                    onChange={(e) => setSettings({...settings, pickupFeePercent: parseFloat(e.target.value) || 0})}
                  />
                  <p className="text-[10px] text-gray-400">
                    Percentage of the fleet delivery price charged for pickup orders. Set 0 to make pickup free.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-600">VAT Percentage (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f57c00] outline-none transition-all"
                    value={settings.vatPercentage}
                    onChange={(e) => setSettings({...settings, vatPercentage: parseFloat(e.target.value) || 0})}
                  />
                  <p className="text-[10px] text-gray-400">Standard tax applied to total order.</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#dec1af]">
              <h3 className="text-lg font-bold text-[#574235] mb-6 flex items-center gap-2">
                <span className="w-2 h-6 bg-[#f57c00] rounded-full"></span>
                Platform Global Rules
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-600">Default Commission Rate (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f57c00] outline-none transition-all"
                    value={settings.defaultCommissionRate}
                    onChange={(e) => setSettings({...settings, defaultCommissionRate: parseFloat(e.target.value) || 0})}
                  />
                  <p className="text-[10px] text-gray-400">Standard commission deducted from store sales.</p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-600">Return Window (Days)</label>
                  <input
                    type="number"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f57c00] outline-none transition-all"
                    value={settings.returnWindowDays}
                    onChange={(e) => setSettings({...settings, returnWindowDays: parseInt(e.target.value) || 0})}
                  />
                  <p className="text-[10px] text-gray-400">Days before pending funds become available.</p>
                </div>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#dec1af]">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Configuration Comparison</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50">
                    <tr className="text-gray-400 border-b border-gray-100">
                      <th className="pb-3 px-2 font-medium">Parameter</th>
                      <th className="pb-3 px-2 font-medium">Current</th>
                      <th className="pb-3 px-2 font-medium">Proposed</th>
                      <th className="pb-3 px-2 font-medium text-right">Change</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {[
                      { key: 'internalBaseFee', label: 'Base Fee', unit: '₦' },
                      { key: 'internalPricePerKm', label: 'Price/KM', unit: '₦' },
                      { key: 'internalPricePerKg', label: 'Price/KG', unit: '₦' },
                      { key: 'pickupFeePercent', label: 'Pickup Fee', unit: '%' },
                      { key: 'vatPercentage', label: 'VAT Rate', unit: '%' },
                      { key: 'defaultCommissionRate', label: 'Commission', unit: '%' },
                      { key: 'returnWindowDays', label: 'Return Window', unit: 'Days' },
                      { key: 'productApprovalRequired', label: 'Product Approval', unit: '' },
                      { key: 'productApprovalSlaEnabled', label: 'Approval SLA', unit: '' },
                      { key: 'productApprovalSlaHours', label: 'Product SLA', unit: ' hrs' },
                      { key: 'orderItemApprovalWindowHours', label: 'Order Approval', unit: ' hrs' },
                    ].map((item: any) => {
                      const current = originalSettings[item.key as keyof typeof settings];
                      const proposed = settings[item.key as keyof typeof settings];
                      const isChanged = current !== proposed;
                      return (
                        <tr key={item.key} className={`group ${isChanged ? 'bg-orange-50/30' : ''}`}>
                          <td className="py-3 px-2 font-medium text-gray-700">{item.label}</td>
                          <td className="py-3 px-2 text-gray-500">{item.unit}{current}</td>
                          <td className={`py-3 px-2 font-bold ${isChanged ? 'text-[#f57c00]' : 'text-gray-700'}`}>
                            {item.unit}{proposed}
                          </td>
                          <td className="py-3 px-2 text-right">
                            {isChanged ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 bg-orange-100 text-orange-600 rounded-full">
                                MODIFIED
                              </span>
                            ) : (
                              <span className="text-gray-300">-</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Price Simulator */}
          <div className="bg-[#574235] text-white p-6 md:p-8 rounded-3xl shadow-xl flex flex-col justify-between sticky top-8">
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  <FiTrendingUp className="text-orange-400" />
                </div>
                <h3 className="text-xl font-bold">Price Simulator</h3>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs uppercase font-bold opacity-60 tracking-widest">
                    <FiMapPin className="text-orange-400" /> Pickup Address
                  </label>
                  <input
                    type="text"
                    placeholder="Enter pickup location..."
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white outline-none focus:ring-2 focus:ring-orange-400 transition-all"
                    value={sim.pickupAddress}
                    onChange={(e) => setSim({...sim, pickupAddress: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs uppercase font-bold opacity-60 tracking-widest">
                    <FiMapPin className="text-orange-400" /> Destination Address
                  </label>
                  <input
                    type="text"
                    placeholder="Enter destination location..."
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white outline-none focus:ring-2 focus:ring-orange-400 transition-all"
                    value={sim.destinationAddress}
                    onChange={(e) => setSim({...sim, destinationAddress: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-xs uppercase font-bold opacity-60 tracking-widest">Distance (KM)</label>
                    <div className="relative">
                      <input
                        type="text"
                        readOnly
                        className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-orange-400 font-bold outline-none cursor-not-allowed"
                        value={simLoading ? "Calculating..." : `${sim.distance} km`}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs uppercase font-bold opacity-60 tracking-widest">Weight (KG)</label>
                    <input
                      type="number"
                      className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white outline-none focus:ring-2 focus:ring-orange-400 transition-all"
                      value={sim.weight}
                      onChange={(e) => setSim({...sim, weight: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-white/10 text-center">
              <p className="text-xs opacity-60 uppercase tracking-widest mb-2">Total Customer Charge</p>
              <p className="text-5xl font-black text-orange-400">₦{calculateTotal()}</p>
              <p className="text-[10px] opacity-40 mt-2">Including {settings.vatPercentage}% VAT</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
