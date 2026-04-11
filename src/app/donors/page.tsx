"use client";

import { useEffect, useState } from "react";
import { Heart, Plus, X } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Donor {
  id: string;
  name: string;
  blood_type: string;
  location: string;
  contact: string;
  last_donation_date: string | null;
}

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const BLOOD_TYPE_COLORS: Record<string, string> = {
  "A+": "bg-red-100 text-red-700",
  "A-": "bg-red-50 text-red-600",
  "B+": "bg-blue-100 text-blue-700",
  "B-": "bg-blue-50 text-blue-600",
  "AB+": "bg-purple-100 text-purple-700",
  "AB-": "bg-purple-50 text-purple-600",
  "O+": "bg-emerald-100 text-emerald-700",
  "O-": "bg-emerald-50 text-emerald-600",
};

export default function DonorsPage() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    blood_type: "O+",
    location: "",
    contact: "",
  });

  const fetchDonors = async () => {
    try {
      const res = await fetch(`${API}/api/donors`);
      const data = await res.json();
      setDonors(data);
    } catch {
      /* backend offline */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`${API}/api/donors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setForm({ name: "", blood_type: "O+", location: "", contact: "" });
      setShowForm(false);
      fetchDonors();
    } catch {
      alert("Failed to register donor. Is the backend running?");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Heart className="w-8 h-8 text-red-600" />
            Donor Management
          </h1>
          <p className="text-slate-500 mt-1">
            Register new donors and manage existing records
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-red-500 transition-all"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? "Cancel" : "Register Donor"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-10 rounded-2xl bg-white ring-1 ring-slate-200 shadow-lg p-6 sm:p-8 space-y-5 animate-in slide-in-from-top-2"
        >
          <h2 className="text-lg font-semibold text-slate-900">
            New Donor Registration
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Full Name
              </label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-shadow"
                placeholder="John Doe"
              />
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
                Location
              </label>
              <input
                required
                value={form.location}
                onChange={(e) =>
                  setForm({ ...form, location: e.target.value })
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-shadow"
                placeholder="City, State"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Contact
              </label>
              <input
                required
                value={form.contact}
                onChange={(e) =>
                  setForm({ ...form, contact: e.target.value })
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-shadow"
                placeholder="Phone or Email"
              />
            </div>
          </div>
          <button
            type="submit"
            className="rounded-full bg-red-600 px-8 py-2.5 text-sm font-semibold text-white shadow hover:bg-red-500 transition-all"
          >
            Register Donor
          </button>
        </form>
      )}

      {/* Table */}
      <div className="rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left">
                <th className="px-6 py-4 font-semibold text-slate-600">Name</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Blood Type</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Location</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Contact</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Last Donation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    Loading...
                  </td>
                </tr>
              ) : donors.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    No donors registered yet. Click &quot;Register Donor&quot; to add one.
                  </td>
                </tr>
              ) : (
                donors.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{d.name}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                          BLOOD_TYPE_COLORS[d.blood_type] || "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {d.blood_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{d.location}</td>
                    <td className="px-6 py-4 text-slate-600">{d.contact}</td>
                    <td className="px-6 py-4 text-slate-500">
                      {d.last_donation_date
                        ? new Date(d.last_donation_date).toLocaleDateString()
                        : "Never"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
