"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { Briefcase, MapPin, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

const verticalTabs = [
  {
    id: "information",
    label: "Company information",
    icon: Briefcase,
    href: (applicationId: string, queryParams: URLSearchParams) => {
      const base = `/loan-applications/${applicationId}/company-details/information`;
      const query = queryParams.toString();
      return query ? `${base}?${query}` : base;
    },
  },
  {
    id: "address",
    label: "Company address",
    icon: MapPin,
    href: (applicationId: string, queryParams: URLSearchParams) => {
      const base = `/loan-applications/${applicationId}/company-details/address`;
      const query = queryParams.toString();
      return query ? `${base}?${query}` : base;
    },
  },
  {
    id: "financials",
    label: "Financial details",
    icon: DollarSign,
    href: (applicationId: string, queryParams: URLSearchParams) => {
      const base = `/loan-applications/${applicationId}/company-details/financials`;
      const query = queryParams.toString();
      return query ? `${base}?${query}` : base;
    },
  },
];

export default function CompanyDetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const applicationId = pathname.split("/")[2]; // Extract application ID from pathname

  // Preserve entrepreneurId and businessId in query params
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
    return pathname === `/loan-applications/${applicationId}/company-details/${tabId}`;
  };

  return (
    <div className="flex gap-8">
      {/* Vertical Tabs Sidebar */}
      <aside className="w-56 flex-shrink-0 border-r border-primaryGrey-100">
        <nav className="flex flex-col gap-1">
          {verticalTabs.map((tab) => {
            const active = isActive(tab.id);
            const Icon = tab.icon;
            return (
              <Link
                key={tab.id}
                href={tab.href(applicationId, preservedParams)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors",
                  active
                    ? "bg-midnight-blue text-white"
                    : "text-primaryGrey-400 hover:bg-primaryGrey-50 hover:text-primaryGrey-600"
                )}
              >
                <Icon className={cn(
                  "h-4 w-4 flex-shrink-0",
                  active ? "text-white" : "text-primaryGrey-400"
                )} />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Content Area */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
