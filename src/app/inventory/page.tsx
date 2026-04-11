"use client";

import { useEffect, useState } from "react";
import { Droplets, Plus, X } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface InventoryItem {
  id: string;
  hospital_id: string;
  blood_type: string;
  quantity: number;
  last_updated: string;
  hospital_name: string;
}

interface Hospital {
  id: string;
  name: string;
}

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const TYPE_COLORS: Record<string, { bg: string; text: string; ring: string }> = {
  "A+": { bg: "bg-red-50", text: "text-red-700", ring: "ring-red-200" },
  "A-": { bg: "bg-red-50", text: "text-red-600", ring: "ring-red-200" },
  "B+": { bg: "bg-blue-50", text: "text-blue-700", ring: "ring-blue-200" },
  "B-": { bg: "bg-blue-50", text: "text-blue-600", ring: "ring-blue-200" },
  "AB+": { bg: "bg-purple-50", text: "text-purple-700", ring: "ring-purple-200" },
  "AB-": { bg: "bg-purple-50", text: "text-purple-600", ring: "ring-purple-200" },
  "O+": { bg: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-200" },
  "O-": { bg: "bg-emerald-50", text: "text-emerald-600", ring: "ring-emerald-200" },
};

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    hospital_id: "",
    blood_type: "O+",
    quantity: 0,
  });

  const fetchData = async () => {
    try {
      const [invRes, hospRes] = await Promise.all([
        fetch(`${API}/api/inventory`),
        fetch(`${API}/api/hospitals`),
      ]);
      setInventory(await invRes.json());
      const hospData = await hospRes.json();
      setHospitals(hospData);
      if (hospData.length > 0 && !form.hospital_id)
        setForm((f) => ({ ...f, hospital_id: hospData[0].id }));
    } catch {
      /* backend offline */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`${API}/api/inventory`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setShowForm(false);
      fetchData();
    } catch {
      alert("Failed to add inventory. Is the backend running?");
    }
  };

  // Group by blood type for summary
  const summary = BLOOD_TYPES.map((bt) => {
    const total = inventory
      .filter((i) => i.blood_type === bt)
      .reduce((sum, i) => sum + i.quantity, 0);
    return { type: bt, total };
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Droplets className="w-8 h-8 text-red-600" />
            Blood Inventory
          </h1>
          <p className="text-slate-500 mt-1">
            Track available blood units across all hospitals
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-red-500 transition-all"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? "Cancel" : "Add Stock"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-10 rounded-2xl bg-white ring-1 ring-slate-200 shadow-lg p-6 sm:p-8 space-y-5"
        >
          <h2 className="text-lg font-semibold text-slate-900">
            Add Blood Stock
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Hospital
              </label>
              <select
                value={form.hospital_id}
                onChange={(e) =>
                  setForm({ ...form, hospital_id: e.target.value })
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                {hospitals.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Blood Type
              </label>
              <select
                value={form.blood_type}
                onChange={(e) =>
                  setForm({ ...form, blood_type: e.target.value })
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                {BLOOD_TYPES.map((bt) => (
                  <option key={bt} value={bt}>
                    {bt}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Quantity (Units)
              </label>
              <input
                type="number"
                required
                min={1}
                value={form.quantity || ""}
                onChange={(e) =>
                  setForm({ ...form, quantity: parseInt(e.target.value) || 0 })
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="10"
              />
            </div>
          </div>
          <button
            type="submit"
            className="rounded-full bg-red-600 px-8 py-2.5 text-sm font-semibold text-white shadow hover:bg-red-500 transition-all"
          >
            Add Stock
          </button>
        </form>
      )}

      {/* Summary Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 mb-10">
        {summary.map((s) => {
          const colors = TYPE_COLORS[s.type] || {
            bg: "bg-slate-50",
            text: "text-slate-600",
            ring: "ring-slate-200",
          };
          return (
            <div
              key={s.type}
              className={`rounded-2xl p-4 ${colors.bg} ring-1 ${colors.ring} text-center shadow-sm`}
            >
              <p className={`text-2xl font-bold ${colors.text}`}>{s.total}</p>
              <p className="text-xs font-semibold text-slate-500 mt-1">
                {s.type}
              </p>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left">
                <th className="px-6 py-4 font-semibold text-slate-600">Hospital</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Blood Type</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Units</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Last Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                    Loading...
                  </td>
                </tr>
              ) : inventory.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                    No inventory records. Add stock to get started.
                  </td>
                </tr>
              ) : (
                inventory.map((item) => {
                  const colors = TYPE_COLORS[item.blood_type] || {
                    bg: "bg-slate-100",
                    text: "text-slate-600",
                    ring: "",
                  };
                  return (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {item.hospital_name}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${colors.bg} ${colors.text}`}
                        >
                          {item.blood_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {new Date(item.last_updated).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
