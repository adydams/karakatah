import React, { useState, useEffect } from "react";
import { getShippingSettings, updateShippingSettings } from "../../services/apiAdmin";
import Spinner from "../../components/Spinner";

export default function Settings() {
  const [settings, setSettings] = useState({
    internalBaseFee: 0,
    internalPricePerKm: 0,
    internalPricePerKg: 0,
  });
  const [sim, setSim] = useState({ distance: 10, weight: 2 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await getShippingSettings();
        if (res.data) {
          setSettings({
            internalBaseFee: res.data.internalBaseFee || 0,
            internalPricePerKm: res.data.internalPricePerKm || 0,
            internalPricePerKg: res.data.internalPricePerKg || 0,
          });
        }
      } catch (err) {
        console.error("Error loading settings:", err);
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
      alert("Pricing settings updated successfully!");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      alert("Error saving settings: " + message);
    } finally {
      setSaving(false);
    }
  };

  const calculateTotal = () => {
    return (
      settings.internalBaseFee +
      (sim.distance * settings.internalPricePerKm) +
      (sim.weight * settings.internalPricePerKg)
    ).toFixed(2);
  };

  if (loading) return <Spinner />;

  return (
    <div className="font-primary w-full p-5 bg-gray-50 min-h-screen">

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Config Panel */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Internal Fleet Pricing</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Base Delivery Fee (₦)</label>
              <input
                type="number"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={settings.internalBaseFee}
                onChange={(e) => setSettings({...settings, internalBaseFee: parseFloat(e.target.value) || 0})}
              />
              <p className="text-xs text-gray-400 mt-1">Fixed starting cost for every internal delivery.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Price per Kilometer (₦)</label>
              <input
                type="number"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={settings.internalPricePerKm}
                onChange={(e) => setSettings({...settings, internalPricePerKm: parseFloat(e.target.value) || 0})}
              />
              <p className="text-xs text-gray-400 mt-1">Additional cost based on travel distance.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Price per Kilogram (₦)</label>
              <input
                type="number"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={settings.internalPricePerKg}
                onChange={(e) => setSettings({...settings, internalPricePerKg: parseFloat(e.target.value) || 0})}
              />
              <p className="text-xs text-gray-400 mt-1">Additional cost based on package weight.</p>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:bg-blue-300"
            >
              {saving ? "Saving..." : "Save Pricing Settings"}
            </button>
          </div>
        </div>

        {/* Price Simulator */}
        <div className="bg-blue-900 text-white p-6 rounded-xl shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold mb-6 opacity-90">Price Simulator</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-bold opacity-60 mb-2">Simulate Distance (KM)</label>
                <input
                  type="number"
                  className="w-full p-2 bg-blue-800 border border-blue-700 rounded-md text-white outline-none"
                  value={sim.distance}
                  onChange={(e) => setSim({...sim, distance: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div>
                <label className="block text-xs uppercase font-bold opacity-60 mb-2">Simulate Weight (KG)</label>
                <input
                  type="number"
                  className="w-full p-2 bg-blue-800 border border-blue-700 rounded-md text-white outline-none"
                  value={sim.weight}
                  onChange={(e) => setSim({...sim, weight: parseFloat(e.target.value) || 0})}
                />
              </div>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-blue-800 text-center">
            <p className="text-sm opacity-70 mb-1">Estimated Customer Charge</p>
            <p className="text-4xl font-black">₦{calculateTotal()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
