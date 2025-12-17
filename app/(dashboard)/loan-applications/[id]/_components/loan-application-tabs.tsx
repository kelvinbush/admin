"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  {
    id: "loan-summary",
    label: "Loan Summary",
    href: (id: string, queryParams: URLSearchParams) => {
      const base = `/loan-applications/${id}/loan-summary`;
      const query = queryParams.toString();
      return query ? `${base}?${query}` : base;
    },
  },
  {
    id: "entrepreneur-details",
    label: "Entrepreneur Details",
    href: (id: string, queryParams: URLSearchParams) => {
      const base = `/loan-applications/${id}/entrepreneur-details`;
      const query = queryParams.toString();
      return query ? `${base}?${query}` : base;
    },
  },
  {
    id: "company-details",
    label: "Company Details",
    href: (id: string, queryParams: URLSearchParams) => {
      const base = `/loan-applications/${id}/company-details`;
      const query = queryParams.toString();
      return query ? `${base}?${query}` : base;
    },
  },
  {
    id: "attachments",
    label: "Attachments",
    href: (id: string, queryParams: URLSearchParams) => {
      const base = `/loan-applications/${id}/attachments`;
      const query = queryParams.toString();
      return query ? `${base}?${query}` : base;
    },
  },
  {
    id: "loan-timeline",
    label: "Loan Timeline",
    href: (id: string, queryParams: URLSearchParams) => {
      const base = `/loan-applications/${id}/loan-timeline`;
      const query = queryParams.toString();
      return query ? `${base}?${query}` : base;
    },
  },
  {
    id: "repayment-schedule",
    label: "Repayment Schedule",
    href: (id: string, queryParams: URLSearchParams) => {
      const base = `/loan-applications/${id}/repayment-schedule`;
      const query = queryParams.toString();
      return query ? `${base}?${query}` : base;
    },
  },
  {
    id: "contract-timeline",
    label: "Contract Timeline",
    href: (id: string, queryParams: URLSearchParams) => {
      const base = `/loan-applications/${id}/contract-timeline`;
      const query = queryParams.toString();
      return query ? `${base}?${query}` : base;
    },
  },
];

interface LoanApplicationTabsProps {
  applicationId: string;
}

export function LoanApplicationTabs({ applicationId }: LoanApplicationTabsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Create a new URLSearchParams with only the IDs we want to preserve
  const preservedParams = new URLSearchParams();
  const entrepreneurId = searchParams.get("entrepreneurId");
  const businessId = searchParams.get("businessId");
  
  if (entrepreneurId) {
    preservedParams.set("entrepreneurId", entrepreneurId);
  }
  if (businessId) {
    preservedParams.set("businessId", businessId);
  }

  const isActive = (tabId: string) => {
    const tab = tabs.find((t) => t.id === tabId);
    if (!tab) return false;
    // Handle base route - treat it as loan-summary
    if (pathname === `/loan-applications/${applicationId}` && tabId === "loan-summary") {
      return true;
    }
    const tabPath = `/loan-applications/${applicationId}/${tabId === "loan-summary" ? "loan-summary" : tabId}`;
    return pathname === tabPath || pathname.startsWith(tabPath);
  };

  return (
    <div className="border-b border-primaryGrey-100">
      <nav className="flex gap-8 -mb-px overflow-x-auto">
        {tabs.map((tab) => {
          const active = isActive(tab.id);
          return (
            <Link
              key={tab.id}
              href={tab.href(applicationId, preservedParams)}
              className={cn(
                "px-1 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex-shrink-0",
                active
                  ? "border-primary-green text-primary-green"
                  : "border-transparent text-primaryGrey-400 hover:text-primaryGrey-600 hover:border-primaryGrey-300"
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
