"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  {
    id: "loan-summary",
    label: "Loan Summary",
    href: (id: string) => `/loan-applications/${id}/loan-summary`,
  },
  {
    id: "entrepreneur-details",
    label: "Entrepreneur Details",
    href: (id: string) => `/loan-applications/${id}/entrepreneur-details`,
  },
  {
    id: "company-details",
    label: "Company Details",
    href: (id: string) => `/loan-applications/${id}/company-details`,
  },
  {
    id: "attachments",
    label: "Attachments",
    href: (id: string) => `/loan-applications/${id}/attachments`,
  },
  {
    id: "loan-timeline",
    label: "Loan Timeline",
    href: (id: string) => `/loan-applications/${id}/loan-timeline`,
  },
  {
    id: "repayment-schedule",
    label: "Repayment Schedule",
    href: (id: string) => `/loan-applications/${id}/repayment-schedule`,
  },
  {
    id: "contract-timeline",
    label: "Contract Timeline",
    href: (id: string) => `/loan-applications/${id}/contract-timeline`,
  },
];

interface LoanApplicationTabsProps {
  applicationId: string;
}

export function LoanApplicationTabs({ applicationId }: LoanApplicationTabsProps) {
  const pathname = usePathname();

  const isActive = (tabId: string) => {
    const tab = tabs.find((t) => t.id === tabId);
    if (!tab) return false;
    // Handle base route - treat it as loan-summary
    if (pathname === `/loan-applications/${applicationId}` && tabId === "loan-summary") {
      return true;
    }
    return pathname === tab.href(applicationId);
  };

  return (
    <div className="border-b border-primaryGrey-100">
      <nav className="flex gap-8 -mb-px overflow-x-auto">
        {tabs.map((tab) => {
          const active = isActive(tab.id);
          return (
            <Link
              key={tab.id}
              href={tab.href(applicationId)}
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
