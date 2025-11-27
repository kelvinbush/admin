"use client";

import React from "react";
import { format } from "date-fns";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { SMEAuditTrailEntry } from "@/lib/api/types";

interface AuditTrailDetailsSheetProps {
  entry: SMEAuditTrailEntry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatAction(action: string): string {
  return action
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

function renderJsonObject(obj: Record<string, any> | null, title: string) {
  if (!obj || Object.keys(obj).length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-midnight-blue">{title}</h4>
      <div className="rounded-md border border-primaryGrey-200 bg-primaryGrey-50 p-4">
        <pre className="text-xs text-midnight-blue whitespace-pre-wrap break-words font-mono">
          {JSON.stringify(obj, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export function AuditTrailDetailsSheet({
  entry,
  open,
  onOpenChange,
}: AuditTrailDetailsSheetProps) {
  if (!entry) return null;

  const adminName =
    entry.adminUser.firstName && entry.adminUser.lastName
      ? `${entry.adminUser.firstName} ${entry.adminUser.lastName}`
      : entry.adminUser.email || "Unknown User";

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      const dateStr = format(date, "MMMM d, yyyy");
      const timeStr = format(date, "hh:mm:ss a");
      return { date: dateStr, time: timeStr, full: `${dateStr} at ${timeStr}` };
    } catch {
      return { date: timestamp, time: "", full: timestamp };
    }
  };

  const timestamp = formatTimestamp(entry.createdAt);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl text-midnight-blue">
            Audit Trail Details
          </SheetTitle>
          <SheetDescription>
            Complete information about this audit trail entry
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Action & Description */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-primaryGrey-400">
                Action
              </label>
              <div className="mt-1">
                <Badge className="bg-primary-green/10 text-primary-green border-primary-green/20">
                  {formatAction(entry.action)}
                </Badge>
              </div>
            </div>

            {entry.description && (
              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-primaryGrey-400">
                  Description
                </label>
                <p className="mt-1 text-sm text-midnight-blue">{entry.description}</p>
              </div>
            )}
          </div>

          <Separator />

          {/* Timestamp */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-primaryGrey-400">
                Date & Time
              </label>
              <p className="mt-1 text-sm text-midnight-blue">{timestamp.full}</p>
            </div>
          </div>

          <Separator />

          {/* Admin User */}
          <div className="space-y-3">
            <label className="text-xs font-medium uppercase tracking-wide text-primaryGrey-400">
              Initiated By
            </label>
            <div className="space-y-1">
              <p className="text-sm font-medium text-midnight-blue">{adminName}</p>
              <p className="text-xs text-primaryGrey-400">{entry.adminUser.email}</p>
            </div>
          </div>

          {/* Technical Details */}
          {(entry.ipAddress || entry.userAgent) && (
            <>
              <Separator />
              <div className="space-y-3">
                <label className="text-xs font-medium uppercase tracking-wide text-primaryGrey-400">
                  Technical Details
                </label>
                <div className="space-y-2">
                  {entry.ipAddress && (
                    <div>
                      <span className="text-xs text-primaryGrey-500">IP Address: </span>
                      <span className="text-xs text-midnight-blue font-mono">
                        {entry.ipAddress}
                      </span>
                    </div>
                  )}
                  {entry.userAgent && (
                    <div>
                      <span className="text-xs text-primaryGrey-500">User Agent: </span>
                      <span className="text-xs text-midnight-blue break-words">
                        {entry.userAgent}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Details */}
          {renderJsonObject(entry.details, "Details") && (
            <>
              <Separator />
              {renderJsonObject(entry.details, "Details")}
            </>
          )}

          {/* Before Data */}
          {renderJsonObject(entry.beforeData, "Before Data") && (
            <>
              <Separator />
              {renderJsonObject(entry.beforeData, "Before Data")}
            </>
          )}

          {/* After Data */}
          {renderJsonObject(entry.afterData, "After Data") && (
            <>
              <Separator />
              {renderJsonObject(entry.afterData, "After Data")}
            </>
          )}

          {/* Entry ID */}
          <Separator />
          <div className="space-y-1">
            <label className="text-xs font-medium uppercase tracking-wide text-primaryGrey-400">
              Entry ID
            </label>
            <p className="text-xs text-primaryGrey-500 font-mono break-all">{entry.id}</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

