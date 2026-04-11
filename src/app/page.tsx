"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Heart, Building2, Droplets, AlertTriangle, Activity } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Stats {
  total_donors: number;
  total_hospitals: number;
  total_units: number;
  pending_requests: number;
  total_donations: number;
}

const STAT_CARDS = [
  { key: "total_donors", label: "Registered Donors", icon: Heart, color: "text-rose-600", bg: "bg-rose-50", ring: "ring-rose-200" },
  { key: "total_hospitals", label: "Partner Hospitals", icon: Building2, color: "text-blue-600", bg: "bg-blue-50", ring: "ring-blue-200" },
  { key: "total_units", label: "Blood Units Available", icon: Droplets, color: "text-red-600", bg: "bg-red-50", ring: "ring-red-200" },
  { key: "pending_requests", label: "Pending Requests", icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50", ring: "ring-amber-200" },
  { key: "total_donations", label: "Total Donations", icon: Activity, color: "text-emerald-600", bg: "bg-emerald-50", ring: "ring-emerald-200" },
];

const QUICK_LINKS = [
  { href: "/donors", label: "Manage Donors", desc: "Register new donors & view records", icon: Heart, color: "bg-rose-600 hover:bg-rose-500" },
  { href: "/hospitals", label: "Hospitals", desc: "View & add partner hospitals", icon: Building2, color: "bg-blue-600 hover:bg-blue-500" },
  { href: "/inventory", label: "Blood Inventory", desc: "Track available blood units", icon: Droplets, color: "bg-red-600 hover:bg-red-500" },
  { href: "/requests", label: "Blood Requests", desc: "Manage urgent blood requests", icon: AlertTriangle, color: "bg-amber-600 hover:bg-amber-500" },
  { href: "/donations", label: "Donation Logs", desc: "View donation history", icon: Activity, color: "bg-emerald-600 hover:bg-emerald-500" },
];

export default function Home() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch(`${API}/api/stats`)
      .then((r) => r.json())
      .then(setStats)
      .catch(() => setStats(null));
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50/60 via-white to-rose-50/40" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center rounded-full px-4 py-1.5 mb-6 text-sm font-semibold text-red-600 ring-1 ring-inset ring-red-200 bg-red-50 shadow-sm">
            ❤️ Introducing LifeLink
          </div>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900">
            Save a life,{" "}
            <span className="bg-gradient-to-r from-red-600 to-rose-500 bg-clip-text text-transparent">
              donate blood.
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl leading-8 text-slate-600 max-w-2xl mx-auto">
            A comprehensive blood donation management platform. Connect donors,
            hospitals, and admins seamlessly to ensure blood is always available
            for those in need.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/donors"
              className="rounded-full bg-red-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg hover:bg-red-500 hover:shadow-xl transition-all duration-200"
            >
              Register as Donor
            </Link>
            <Link
              href="/requests"
              className="text-sm font-semibold leading-6 text-slate-900 hover:text-red-600 transition-colors group"
            >
              View Requests{" "}
              <span
                aria-hidden="true"
                className="inline-block transition-transform group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-slate-900 mb-10">
            Platform Overview
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {STAT_CARDS.map((card) => {
              const Icon = card.icon;
              const value = stats ? (stats as Record<string, number>)[card.key] : "—";
              return (
                <div
                  key={card.key}
                  className={`rounded-2xl p-5 ${card.bg} ring-1 ${card.ring} shadow-sm hover:shadow-md transition-shadow duration-200`}
                >
                  <Icon className={`w-7 h-7 ${card.color} mb-3`} />
                  <p className="text-3xl font-bold text-slate-900">{value}</p>
                  <p className="text-sm text-slate-600 mt-1">{card.label}</p>
                </div>
              );
            })}
          </div>
          {!stats && (
            <p className="text-center text-sm text-slate-400 mt-4">
              Connect the backend to see live stats
            </p>
          )}
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-slate-900 mb-10">
            Quick Access
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {QUICK_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-start gap-4 rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-200 hover:ring-red-300 hover:shadow-lg hover:bg-white transition-all duration-200"
                >
                  <div
                    className={`flex-shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-xl text-white shadow-md ${link.color} transition-transform group-hover:scale-110`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 group-hover:text-red-600 transition-colors">
                      {link.label}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">{link.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
