"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Plus, X, CheckCircle } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface BloodRequest {
  id: string;
  hospital_id: string;
  blood_type: string;
  quantity: number;
  urgency: string;
  status: string;
  created_at: string;
  hospital_name: string;
}

interface Hospital {
  id: string;
  name: string;
}

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const URGENCY_STYLES: Record<string, string> = {
  LOW: "bg-green-50 text-green-700 ring-green-200",
  MEDIUM: "bg-amber-50 text-amber-700 ring-amber-200",
  CRITICAL: "bg-red-50 text-red-700 ring-red-200 animate-pulse",
};

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-yellow-50 text-yellow-700 ring-yellow-200",
  FULFILLED: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

export default function RequestsPage() {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    hospital_id: "",
    blood_type: "O+",
    quantity: 1,
    urgency: "MEDIUM",
  });

  const fetchData = async () => {
    try {
      const [reqRes, hospRes] = await Promise.all([
        fetch(`${API}/api/requests`),
        fetch(`${API}/api/hospitals`),
      ]);
      setRequests(await reqRes.json());
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
      await fetch(`${API}/api/requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setShowForm(false);
      fetchData();
    } catch {
      alert("Failed to create request. Is the backend running?");
    }
  };

  const fulfill = async (id: string) => {
    try {
      await fetch(`${API}/api/requests/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "FULFILLED" }),
      });
      fetchData();
    } catch {
      alert("Failed to update request.");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-amber-600" />
            Blood Requests
          </h1>
          <p className="text-slate-500 mt-1">
            Manage urgent blood requests from hospitals
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 rounded-full bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-amber-500 transition-all"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? "Cancel" : "New Request"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-10 rounded-2xl bg-white ring-1 ring-slate-200 shadow-lg p-6 sm:p-8 space-y-5"
        >
          <h2 className="text-lg font-semibold text-slate-900">
            Create Blood Request
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Hospital
              </label>
              <select
                value={form.hospital_id}
                onChange={(e) =>
                  setForm({ ...form, hospital_id: e.target.value })
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
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
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
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
                Quantity
              </label>
              <input
                type="number"
                required
                min={1}
                value={form.quantity}
                onChange={(e) =>
                  setForm({ ...form, quantity: parseInt(e.target.value) || 1 })
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Urgency
              </label>
              <select
                value={form.urgency}
                onChange={(e) =>
                  setForm({ ...form, urgency: e.target.value })
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="rounded-full bg-amber-600 px-8 py-2.5 text-sm font-semibold text-white shadow hover:bg-amber-500 transition-all"
          >
            Submit Request
          </button>
        </form>
      )}

      {/* Request Cards */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-center text-slate-400 py-12">Loading...</p>
        ) : requests.length === 0 ? (
          <p className="text-center text-slate-400 py-12">
            No blood requests yet. Click &quot;New Request&quot; to create one.
          </p>
        ) : (
          requests.map((req) => (
            <div
              key={req.id}
              className="rounded-2xl bg-white ring-1 ring-slate-200 p-6 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <Droplet type={req.blood_type} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {req.hospital_name}
                    </h3>
                    <p className="text-sm text-slate-500 mt-0.5">
                      Needs <strong>{req.quantity}</strong> unit(s) of{" "}
                      <strong>{req.blood_type}</strong>
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(req.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ring-1 ${
                      URGENCY_STYLES[req.urgency] || "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {req.urgency}
                  </span>
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ring-1 ${
                      STATUS_STYLES[req.status] || "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {req.status}
                  </span>
                  {req.status === "PENDING" && (
                    <button
                      onClick={() => fulfill(req.id)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white shadow hover:bg-emerald-500 transition-all"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Fulfill
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function Droplet({ type }: { type: string }) {
  return (
    <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600 font-bold text-sm ring-1 ring-red-200">
      {type}
    </div>
  );
}
