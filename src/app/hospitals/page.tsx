"use client";

import { useEffect, useState } from "react";
import { Building2, Plus, X } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Hospital {
  id: string;
  name: string;
  location: string;
  contact: string;
}

export default function HospitalsPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", location: "", contact: "" });

  const fetchHospitals = async () => {
    try {
      const res = await fetch(`${API}/api/hospitals`);
      const data = await res.json();
      setHospitals(data);
    } catch {
      /* backend offline */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`${API}/api/hospitals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setForm({ name: "", location: "", contact: "" });
      setShowForm(false);
      fetchHospitals();
    } catch {
      alert("Failed to add hospital. Is the backend running?");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Building2 className="w-8 h-8 text-blue-600" />
            Hospitals
          </h1>
          <p className="text-slate-500 mt-1">
            Manage partner hospitals in the LifeLink network
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-500 transition-all"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? "Cancel" : "Add Hospital"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-10 rounded-2xl bg-white ring-1 ring-slate-200 shadow-lg p-6 sm:p-8 space-y-5"
        >
          <h2 className="text-lg font-semibold text-slate-900">
            Add New Hospital
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Hospital Name
              </label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="City General Hospital"
              />
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
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Phone or Email"
              />
            </div>
          </div>
          <button
            type="submit"
            className="rounded-full bg-blue-600 px-8 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-500 transition-all"
          >
            Add Hospital
          </button>
        </form>
      )}

      {/* Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="col-span-full text-center text-slate-400 py-12">
            Loading...
          </p>
        ) : hospitals.length === 0 ? (
          <p className="col-span-full text-center text-slate-400 py-12">
            No hospitals registered yet. Click &quot;Add Hospital&quot; to get started.
          </p>
        ) : (
          hospitals.map((h) => (
            <div
              key={h.id}
              className="rounded-2xl bg-white ring-1 ring-slate-200 p-6 shadow-sm hover:shadow-md hover:ring-blue-300 transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 inline-flex items-center justify-center w-11 h-11 rounded-xl bg-blue-50 text-blue-600">
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-900 truncate">{h.name}</h3>
                  <p className="text-sm text-slate-500 mt-1">{h.location}</p>
                  <p className="text-sm text-slate-400 mt-0.5">{h.contact}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
