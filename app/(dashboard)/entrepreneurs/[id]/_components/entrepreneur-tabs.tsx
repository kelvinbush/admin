"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  {
    id: "entrepreneur-details",
    label: "Entrepreneur Details",
    href: (id: string) => `/entrepreneurs/${id}/entrepreneur-details`,
  },
  {
    id: "company-details",
    label: "Company Details",
    href: (id: string) => `/entrepreneurs/${id}/company-details`,
  },
  {
    id: "attachments",
    label: "Attachments",
    href: (id: string) => `/entrepreneurs/${id}/attachments`,
  },
  {
    id: "audit-logs",
    label: "Audit Logs",
    href: (id: string) => `/entrepreneurs/${id}/audit-logs`,
  },
];

interface EntrepreneurTabsProps {
  entrepreneurId: string;
}

export function EntrepreneurTabs({ entrepreneurId }: EntrepreneurTabsProps) {
  const pathname = usePathname();

  const isActive = (tabId: string) => {
    if (tabId === "entrepreneur-details") {
      return pathname === `/entrepreneurs/${entrepreneurId}/entrepreneur-details`;
    }
    if (tabId === "company-details") {
      return pathname.startsWith(`/entrepreneurs/${entrepreneurId}/company-details`);
    }
    if (tabId === "attachments") {
      return pathname.startsWith(`/entrepreneurs/${entrepreneurId}/attachments`);
    }
    if (tabId === "audit-logs") {
      return pathname === `/entrepreneurs/${entrepreneurId}/audit-logs`;
    }
    return false;
  };

  return (
    <div className="border-b border-primaryGrey-100">
      <nav className="grid grid-cols-4 justify-items-center gap-2 -mb-px">
        {tabs.map((tab) => {
          const active = isActive(tab.id);
          return (
            <Link
              key={tab.id}
              href={tab.href(entrepreneurId)}
              className={cn(
                "px-1 py-4 text-sm font-medium border-b-2 transition-colors text-center w-full",
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

