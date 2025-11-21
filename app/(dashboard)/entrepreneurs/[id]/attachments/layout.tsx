"use client";

import React from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const attachmentTabs = [
  {
    id: "entrepreneur-documents",
    label: "Entrepreneur Documents",
    href: (id: string) => `/entrepreneurs/${id}/attachments/entrepreneur-documents`,
  },
  {
    id: "company-documents",
    label: "Company Documents",
    href: (id: string) => `/entrepreneurs/${id}/attachments/company-documents`,
  },
];

export default function AttachmentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const pathname = usePathname();
  const entrepreneurId = params.id as string;

  const isActive = (tabId: string) => {
    return pathname === `/entrepreneurs/${entrepreneurId}/attachments/${tabId}`;
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
                  href={tab.href(entrepreneurId)}
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

