"use client";

import React from "react";
import { AlertCircle, History, User } from "lucide-react";
import { useLoanApplicationAuditTrail } from "@/lib/api/hooks/loan-applications";
import { Skeleton } from "@/components/ui/skeleton";

interface AuditTrailProps {
  applicationId: string;
}

export function AuditTrail({ applicationId }: AuditTrailProps) {
  const {
    data: auditEntries = [],
    isLoading,
    error,
  } = useLoanApplicationAuditTrail(applicationId);

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "application_submitted":
        return "📝";
      case "status_updated":
        return "🔄";
      case "application_approved":
        return "✅";
      case "application_rejected":
        return "❌";
      case "document_requested":
        return "📄";
      case "offer_letter_sent":
        return "📧";
      case "snapshot_created":
        return "📸";
      default:
        return "📋";
    }
  };

  const formatActionText = (action: string) => {
    return action.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-8 py-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <History className="h-5 w-5" />
            Audit Trail
          </h2>
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex items-start gap-4">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-3 w-20" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-8 py-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <History className="h-5 w-5" />
            Audit Trail
          </h2>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-red-600 font-medium">
                Failed to load audit trail
              </p>
              <p className="text-gray-500 text-sm">
                Please try refreshing the page
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="px-8 py-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <History className="h-5 w-5" />
          Audit Trail
        </h2>

        {auditEntries.length === 0 ? (
          <div className="text-center py-8">
            <History className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No audit entries found</p>
            <p className="text-gray-400 text-sm">
              Audit trail will appear here as actions are taken
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {auditEntries.map((entry: any, index: number) => (
              <div key={entry.id || index} className="flex items-start gap-4">
                {/* Action Icon */}
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-lg">
                  {getActionIcon(entry.action)}
                </div>

                {/* Entry Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-semibold text-gray-900">
                      {formatActionText(entry.action)}
                    </h4>
                    <span className="text-xs text-gray-500 font-medium">
                      {formatDate(entry.createdAt)}
                    </span>
                  </div>

                  {entry.details && (
                    <p className="text-sm text-gray-600 mb-2">
                      {entry.details}
                    </p>
                  )}

                  {entry.reason && (
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">Reason:</span>{" "}
                      {entry.reason}
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <User className="h-3 w-3" />
                    <span>User ID: {entry.userId}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
