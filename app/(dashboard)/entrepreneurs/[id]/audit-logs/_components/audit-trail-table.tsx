"use client";

import React from "react";
import { format } from "date-fns";
import Image from "next/image";

export interface AuditLogEntry {
  id: string;
  changeSummary: string;
  initiatedBy: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  timestamp: string;
}

interface AuditTrailTableProps {
  entries: AuditLogEntry[];
}

export function AuditTrailTable({ entries }: AuditTrailTableProps) {
  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      const dateStr = format(date, "MMM d, yyyy");
      const timeStr = format(date, "hh:mm:ss a");
      return `${dateStr} || ${timeStr}`;
    } catch {
      return timestamp;
    }
  };

  return (
    <div className="rounded-md border border-primaryGrey-50 overflow-hidden">
      <table className="w-full">
        <thead className="bg-[#E8E9EA] border-b border-[#B6BABC]">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-midnight-blue">
              CHANGE SUMMARY
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-midnight-blue">
              INITIATED BY
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-midnight-blue">
              TIMESTAMP
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-primaryGrey-100">
          {entries.length === 0 ? (
            <tr>
              <td colSpan={3} className="px-6 py-12 text-center text-primaryGrey-400">
                No audit log entries found
              </td>
            </tr>
          ) : (
            entries.map((entry) => (
              <tr key={entry.id} className="hover:bg-primaryGrey-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="text-sm text-midnight-blue">
                    {entry.changeSummary}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {entry.initiatedBy.avatar ? (
                      <Image
                        src={entry.initiatedBy.avatar}
                        alt={entry.initiatedBy.name}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primaryGrey-200 flex items-center justify-center text-sm font-medium text-midnight-blue">
                        {entry.initiatedBy.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-medium text-midnight-blue">
                        {entry.initiatedBy.name}
                      </div>
                      <div className="text-xs text-primaryGrey-400">
                        {entry.initiatedBy.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-primaryGrey-400">
                    {formatTimestamp(entry.timestamp)}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

