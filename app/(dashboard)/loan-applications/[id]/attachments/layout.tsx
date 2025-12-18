"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const attachmentTabs = [
  {
    id: "entrepreneur-documents",
    label: "Entrepreneur Documents",
    href: (applicationId: string, queryParams: URLSearchParams) => {
      const base = `/loan-applications/${applicationId}/attachments/entrepreneur-documents`;
      const query = queryParams.toString();
      return query ? `${base}?${query}` : base;
    },
  },
  {
    id: "company-documents",
    label: "Company Documents",
    href: (applicationId: string, queryParams: URLSearchParams) => {
      const base = `/loan-applications/${applicationId}/attachments/company-documents`;
      const query = queryParams.toString();
      return query ? `${base}?${query}` : base;
    },
  },
];

export default function AttachmentsLayout({
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
    return pathname === `/loan-applications/${applicationId}/attachments/${tabId}`;
  };

  return (
    <div className="space-y-4">
      <div>      
        {/* Tabs */}
        <div className="border-b border-primaryGrey-100">
          <nav className="flex gap-8 -mb-px">
            {attachmentTabs.map((tab) => {
              const active = isActive(tab.id);
              return (
                <Link
                  key={tab.id}
                  href={tab.href(applicationId, preservedParams)}
                  className={cn(
                    "px-1 py-4 text-sm font-medium border-b-2 transition-colors",
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
      </div>

      {/* Content */}
      <div>
        {children}
      </div>
    </div>
  );
}
