"use client";

import { useEffect, useState } from "react";
import { Activity, Plus, X } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Donation {
  id: string;
  donor_id: string;
  hospital_id: string;
  quantity: number;
  date: string;
  status: string;
  donor_name: string;
  hospital_name: string;
}

interface Donor {
  id: string;
  name: string;
  blood_type: string;
}

interface Hospital {
  id: string;
  name: string;
}

const STATUS_COLORS: Record<string, string> = {
  SUCCESS: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  PENDING: "bg-yellow-50 text-yellow-700 ring-yellow-200",
  REJECTED: "bg-red-50 text-red-700 ring-red-200",
};

export default function DonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    donor_id: "",
    hospital_id: "",
    quantity: 1,
  });

  const fetchData = async () => {
    try {
      const [donRes, donorRes, hospRes] = await Promise.all([
        fetch(`${API}/api/donations`),
        fetch(`${API}/api/donors`),
        fetch(`${API}/api/hospitals`),
      ]);
      setDonations(await donRes.json());
      const donorData = await donorRes.json();
      const hospData = await hospRes.json();
      setDonors(donorData);
      setHospitals(hospData);
      if (donorData.length > 0 && !form.donor_id)
        setForm((f) => ({ ...f, donor_id: donorData[0].id }));
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
      await fetch(`${API}/api/donations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setShowForm(false);
      fetchData();
    } catch {
      alert("Failed to log donation. Is the backend running?");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Activity className="w-8 h-8 text-emerald-600" />
            Donation Logs
          </h1>
          <p className="text-slate-500 mt-1">
            Track all blood donation records
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-emerald-500 transition-all"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? "Cancel" : "Log Donation"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-10 rounded-2xl bg-white ring-1 ring-slate-200 shadow-lg p-6 sm:p-8 space-y-5"
        >
          <h2 className="text-lg font-semibold text-slate-900">
            Log New Donation
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Donor
              </label>
              <select
                value={form.donor_id}
                onChange={(e) =>
                  setForm({ ...form, donor_id: e.target.value })
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                {donors.length === 0 && (
                  <option value="">No donors available</option>
                )}
                {donors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.blood_type})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Hospital
              </label>
              <select
                value={form.hospital_id}
                onChange={(e) =>
                  setForm({ ...form, hospital_id: e.target.value })
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                {hospitals.length === 0 && (
                  <option value="">No hospitals available</option>
                )}
                {hospitals.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Units Donated
              </label>
              <input
                type="number"
                required
                min={1}
                value={form.quantity}
                onChange={(e) =>
                  setForm({ ...form, quantity: parseInt(e.target.value) || 1 })
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>
          <button
            type="submit"
            className="rounded-full bg-emerald-600 px-8 py-2.5 text-sm font-semibold text-white shadow hover:bg-emerald-500 transition-all"
          >
            Log Donation
          </button>
        </form>
      )}

      {/* Timeline */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-center text-slate-400 py-12">Loading...</p>
        ) : donations.length === 0 ? (
          <p className="text-center text-slate-400 py-12">
            No donations logged yet. Click &quot;Log Donation&quot; to record one.
          </p>
        ) : (
          donations.map((d) => (
            <div
              key={d.id}
              className="rounded-2xl bg-white ring-1 ring-slate-200 p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 ring-1 ring-emerald-200">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">
                    {d.donor_name}{" "}
                    <span className="font-normal text-slate-500">donated to</span>{" "}
                    {d.hospital_name}
                  </p>
                  <p className="text-sm text-slate-500 mt-0.5">
                    <strong>{d.quantity}</strong> unit(s) •{" "}
                    {new Date(d.date).toLocaleString()}
                  </p>
                </div>
              </div>
              <span
                className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ring-1 self-start sm:self-center ${
                  STATUS_COLORS[d.status] || "bg-slate-100 text-slate-600"
                }`}
              >
                {d.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
