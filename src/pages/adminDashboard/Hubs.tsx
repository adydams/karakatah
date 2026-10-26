import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import toast from "react-hot-toast";
import { FaSearch, FaPlus, FaTimes } from "react-icons/fa";
import { IoMdArrowBack, IoMdArrowForward } from "react-icons/io";
import {
  createHub,
  deleteHub,
  getAdminHubs,
  getHubs,
  updateHub,
} from "../../services/apiAdmin";
import type { Hub } from "../../services/apiAdmin";
import DashboardPagination from "../../components/adminDashboard/DashboardPagination";
import { locations } from "../../data/locations";

type HubForm = Omit<Hub, "id">;
const createEmptyForm = (): HubForm => ({
  code: "",
  name: "",
  address: "",
  state: "",
  country: "",
  lga: "",
  phone: "",
  email: "",
  latitude: "",
  longitude: "",
  isActive: true,
});

export default function Hubs() {
  const [hubs, setHubs] = useState<Hub[]>([]);
  const [form, setForm] = useState<HubForm>(createEmptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [tempSearch, setTempSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const response = await getAdminHubs();
      setHubs(response.data || []);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Unable to load hubs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setForm(createEmptyForm());
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setEditingId(null);
    setForm(createEmptyForm());
    setIsFormOpen(false);
  };

  const applyFilters = () => {
    setSearch(tempSearch.trim());
    setPage(1);
  };

  const filteredHubs = hubs.filter((hub) => {
    const query = search.toLowerCase();
    return !query || `${hub.name} ${hub.address}`.toLowerCase().includes(query);
  });
  const totalPages = Math.max(1, Math.ceil(filteredHubs.length / limit));
  const visibleHubs = filteredHubs.slice((page - 1) * limit, page * limit);
  const selectedCountry = locations.find((country) => country.name === form.country);
  const selectedState = selectedCountry?.states.find((state) => state.name === form.state);

  const updateLocation = (field: "country" | "state" | "lga", value: string) => {
    setForm((current) => {
      if (field === "country") return { ...current, country: value, state: "", lga: "" };
      if (field === "state") return { ...current, state: value, lga: "" };
      return { ...current, lga: value };
    });
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const requiredFields = [
      ["hub code", form.code],
      ["hub name", form.name],
      ["hub address", form.address],
      ["state", form.state],
      ["country", form.country],
      ["latitude", form.latitude],
      ["longitude", form.longitude],
      ["phone contact", form.phone],
      ["email", form.email],
    ];
    const missingField = requiredFields.find(([, value]) => !String(value ?? "").trim());
    if (missingField) {
      toast.error(`Enter ${missingField[0]}`);
      return;
    }

    const payload: HubForm = {
      ...form,
      code: form.code.trim().toUpperCase(),
      name: form.name.trim(),
      address: form.address.trim(),
      state: form.state.trim(),
      country: form.country.trim(),
      lga: form.lga?.trim() || "",
      phone: form.phone.trim(),
      email: form.email.trim().toLowerCase(),
    };

    try {
      if (editingId) await updateHub(editingId, payload);
      else await createHub(payload);
      toast.success(editingId ? "Hub updated" : "Hub created");
      closeForm();
      await load();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Unable to save hub");
    }
  };

  const remove = async (hub: Hub) => {
    if (!window.confirm(`Delete ${hub.name}?`)) return;
    try {
      await deleteHub(hub.id);
      toast.success("Hub deleted");
      setPage(1);
      await load();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Unable to delete hub");
    }
  };

  return (
    <section className="min-h-screen bg-gray-50 p-3 sm:p-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#574235] sm:text-2xl">Hubs</h1>
            <p className="mt-1 text-sm text-gray-500">Manage rider collection and drop-off hubs.</p>
          </div>
          <button type="button" onClick={openCreateModal} className="flex min-h-10 items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-700">
            <FaPlus size={12} />
            Add hub
          </button>
        </div>
        <div className="mt-5 flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between sm:p-5">
          <div className="relative flex w-full max-w-xl items-center">
            <FaSearch className="absolute left-3 text-gray-400" size={14} />
            <input type="search" value={tempSearch} onChange={(event) => setTempSearch(event.target.value)} onKeyDown={(event) => event.key === "Enter" && applyFilters()} placeholder="Search hubs by name or address..." className="min-h-10 w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-100" />
          </div>
          <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto">
            <button type="button" onClick={applyFilters} className="min-h-10 rounded-lg bg-orange-500 px-4 py-2 text-xs font-bold text-white transition hover:bg-orange-600">Apply</button>
            <select value={limit} onChange={(event) => { setLimit(Number(event.target.value)); setPage(1); }} className="min-h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-orange-500">
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-3 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <span>Total: <strong className="text-gray-800">{filteredHubs.length}</strong> hubs</span>
          {filteredHubs.length > 0 && <span>Page <strong className="text-gray-800">{page}</strong> of <strong className="text-gray-800">{totalPages}</strong></span>}
        </div>
        {isFormOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-labelledby="hub-form-title">
            <form onSubmit={submit} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-xl sm:p-6">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <h2 id="hub-form-title" className="text-lg font-bold text-gray-900">{editingId ? "Edit hub" : "Add hub"}</h2>
                  <p className="mt-1 text-sm text-gray-500">Enter the collection hub details.</p>
                </div>
                <button type="button" onClick={closeForm} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100" aria-label="Close hub form"><FaTimes /></button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex min-w-0 flex-col gap-1 text-xs font-semibold text-gray-600">
            Hub code
            <input className="min-h-10 rounded-lg border border-gray-200 p-2 text-sm font-normal uppercase text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100" name="code" required placeholder="e.g. IKE-001" value={form.code} onChange={(e) => setForm((current) => ({ ...current, code: e.target.value }))} />
          </label>
          <label className="flex min-w-0 flex-col gap-1 text-xs font-semibold text-gray-600">
            Hub name
            <input className="min-h-10 rounded-lg border border-gray-200 p-2 text-sm font-normal text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100" name="name" required placeholder="e.g. Ikeja Hub" value={form.name} onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))} />
          </label>
          <label className="flex min-w-0 flex-col gap-1 text-xs font-semibold text-gray-600 sm:col-span-2 xl:col-span-2">
            Address
            <input className="min-h-10 rounded-lg border border-gray-200 p-2 text-sm font-normal text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100" name="address" required placeholder="Full hub address" value={form.address} onChange={(e) => setForm((current) => ({ ...current, address: e.target.value }))} />
          </label>
          <label className="flex min-w-0 flex-col gap-1 text-xs font-semibold text-gray-600">
            State
            <select className="min-h-10 rounded-lg border border-gray-200 bg-white p-2 text-sm font-normal text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:bg-gray-100" name="state" required value={form.state} disabled={!selectedCountry} onChange={(e) => updateLocation("state", e.target.value)}>
              <option value="">Select state</option>
              {selectedCountry?.states.map((state) => <option key={state.id} value={state.name}>{state.name}</option>)}
            </select>
          </label>
          <label className="flex min-w-0 flex-col gap-1 text-xs font-semibold text-gray-600">
            Country
            <select className="min-h-10 rounded-lg border border-gray-200 bg-white p-2 text-sm font-normal text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100" name="country" required value={form.country} onChange={(e) => updateLocation("country", e.target.value)}>
              <option value="">Select country</option>
              {locations.map((country) => <option key={country.id} value={country.name}>{country.name}</option>)}
            </select>
          </label>
          <label className="flex min-w-0 flex-col gap-1 text-xs font-semibold text-gray-600">
            LGA <span className="font-normal text-gray-400">(optional)</span>
            <select className="min-h-10 rounded-lg border border-gray-200 bg-white p-2 text-sm font-normal text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:bg-gray-100" name="lga" value={form.lga ?? ""} disabled={!selectedState} onChange={(e) => updateLocation("lga", e.target.value)}>
              <option value="">Select LGA (optional)</option>
              {selectedState?.localAreas.map((localArea) => <option key={localArea.id} value={localArea.name}>{localArea.name}</option>)}
            </select>
          </label>
          <label className="flex min-w-0 flex-col gap-1 text-xs font-semibold text-gray-600">
            Phone contact
            <input className="min-h-10 rounded-lg border border-gray-200 p-2 text-sm font-normal text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100" name="phone" type="tel" required placeholder="e.g. 08012345678" value={form.phone} onChange={(e) => setForm((current) => ({ ...current, phone: e.target.value }))} />
          </label>
          <label className="flex min-w-0 flex-col gap-1 text-xs font-semibold text-gray-600 sm:col-span-2">
            Email
            <input className="min-h-10 rounded-lg border border-gray-200 p-2 text-sm font-normal text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100" name="email" type="email" required placeholder="hub@example.com" value={form.email} onChange={(e) => setForm((current) => ({ ...current, email: e.target.value }))} />
          </label>
          <label className="flex min-w-0 flex-col gap-1 text-xs font-semibold text-gray-600">
            Latitude
            <input className="min-h-10 rounded-lg border border-gray-200 p-2 text-sm font-normal text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100" name="latitude" inputMode="decimal" required placeholder="e.g. 6.5244" value={form.latitude ?? ""} onChange={(e) => setForm((current) => ({ ...current, latitude: e.target.value }))} />
          </label>
          <label className="flex min-w-0 flex-col gap-1 text-xs font-semibold text-gray-600">
            Longitude
            <input className="min-h-10 rounded-lg border border-gray-200 p-2 text-sm font-normal text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100" name="longitude" inputMode="decimal" required placeholder="e.g. 3.3792" value={form.longitude ?? ""} onChange={(e) => setForm((current) => ({ ...current, longitude: e.target.value }))} />
          </label>
          <label className="flex min-h-10 items-center gap-2 text-sm text-gray-700 sm:col-span-2">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((current) => ({ ...current, isActive: e.target.checked }))} />
            Active
          </label>
              </div>
              <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            {editingId && <button type="button" className="min-h-10 rounded-lg border px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50" onClick={closeForm}>Cancel</button>}
            <button type="submit" className="min-h-10 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-700">{editingId ? "Update hub" : "Add hub"}</button>
              </div>
            </form>
          </div>
        )}
        <div className="mt-5 overflow-hidden rounded-2xl bg-white shadow-sm sm:mt-6">
          <div className="overflow-x-auto">
          <table className="min-w-[680px] w-full text-left text-sm">
            <thead><tr className="border-b bg-gray-50 text-xs text-gray-500"><th className="p-3 sm:p-4">Name</th><th className="p-3 sm:p-4">Address</th><th className="p-3 sm:p-4">Coordinates</th><th className="p-3 sm:p-4">Status</th><th className="p-3 sm:p-4">Actions</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={5} className="p-8 text-center text-gray-500">Loading hubs...</td></tr> : visibleHubs.length > 0 ? visibleHubs.map((hub) => (
                <tr key={hub.id} className="border-b last:border-0">
                  <td className="p-3 sm:p-4"><div className="font-medium">{hub.name}</div><div className="text-xs text-gray-400">{hub.code}</div></td><td className="max-w-[260px] truncate p-3 sm:p-4" title={hub.address}>{hub.address}</td>
                  <td className="whitespace-nowrap p-3 sm:p-4">{hub.latitude ?? "—"}, {hub.longitude ?? "—"}</td>
                  <td className="p-3 sm:p-4"><div>{hub.isActive ? "Active" : "Inactive"}</div><div className="text-xs text-gray-400">{hub.phone}</div></td>
                  <td className="p-3 sm:p-4"><div className="flex gap-2"><button type="button" className="rounded border px-3 py-1.5" onClick={() => { setEditingId(hub.id); setForm({ code: hub.code ?? "", name: hub.name, address: hub.address, state: hub.state ?? "", country: hub.country ?? "", lga: hub.lga ?? "", phone: hub.phone ?? "", email: hub.email ?? "", latitude: hub.latitude ?? "", longitude: hub.longitude ?? "", isActive: hub.isActive }); setIsFormOpen(true); }}>Edit</button><button type="button" className="rounded border border-red-200 px-3 py-1.5 text-red-600" onClick={() => remove(hub)}>Delete</button></div></td>
                </tr>
              )) : <tr><td colSpan={5} className="p-8 text-center text-gray-500">{search ? "No hubs match your search." : "No hubs configured."}</td></tr>}
            </tbody>
          </table>
          </div>
          {filteredHubs.length > 0 && (
            <div className="flex flex-col gap-3 border-t border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-xs text-gray-500">Showing {(page - 1) * limit + 1}-{Math.min(page * limit, filteredHubs.length)} of {filteredHubs.length}</span>
              <div className="flex items-center justify-between gap-2">
                <button type="button" disabled={page === 1} onClick={() => setPage((current) => current - 1)} className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-30" aria-label="Previous page"><IoMdArrowBack size={18} /></button>
                <DashboardPagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
                <button type="button" disabled={page === totalPages} onClick={() => setPage((current) => current + 1)} className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-30" aria-label="Next page"><IoMdArrowForward size={18} /></button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
