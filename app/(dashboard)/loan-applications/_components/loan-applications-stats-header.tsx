"use client";

import { ArrowUpRight } from "lucide-react";

interface StatCard {
  label: string;
  value: string;
  delta: string;
}

interface LoanApplicationsStatsHeaderProps {
  stats?: StatCard[];
}

export function LoanApplicationsStatsHeader({
  stats: providedStats,
}: LoanApplicationsStatsHeaderProps) {
  // Dummy data for now
  const defaultStats: StatCard[] = [
    {
      label: "Total Applications",
      value: "0",
      delta: "0%",
    },
    {
      label: "Approved Loans",
      value: "0",
      delta: "0%",
    },
    {
      label: "Pending Approval",
      value: "0",
      delta: "0%",
    },
    {
      label: "Rejected Loans",
      value: "0",
      delta: "0%",
    },
    {
      label: "Disbursed Loans",
      value: "0",
      delta: "0%",
    },
    {
      label: "Cancelled Loans",
      value: "0",
      delta: "0%",
    },
  ];

  const stats = providedStats || defaultStats;

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {stats.map((card) => (
        <div
          key={card.label}
          className="rounded-md bg-primaryGrey-500 text-white px-5 py-3.5 shadow-lg border border-white/5"
        >
          <p className="text-base tracking-tight">{card.label}</p>
          <p className="text-3xl font-semibold mt-4">{card.value}</p>
          <div className="mt-5 flex items-center gap-2 text-sm">
            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-primary-green/30 bg-primary-green">
              <ArrowUpRight className="h-3.5 w-3.5 text-black" />
            </span>
            <span className="text-primary-green font-medium">{card.delta}</span>
            <span className="text-primaryGrey-200">From last month</span>
          </div>
        </div>
      ))}
    </section>
  );
}
