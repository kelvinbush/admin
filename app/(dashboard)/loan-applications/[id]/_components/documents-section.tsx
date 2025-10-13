"use client";

import React from "react";
import { FileText, Upload, Download, Eye, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useLoanApplicationDocumentRequests, useLoanApplicationDocumentStats } from "@/lib/api/hooks/loan-applications";

interface DocumentsSectionProps {
  applicationId: string;
}

export function DocumentsSection({ applicationId }: DocumentsSectionProps) {
  const { data: documents = [], isLoading: documentsLoading, error: documentsError } = useLoanApplicationDocumentRequests(applicationId);
  const { data: stats, isLoading: statsLoading, error: statsError } = useLoanApplicationDocumentStats(applicationId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "fulfilled":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "overdue":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const formatDocumentType = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (documentsLoading || statsLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-8 py-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Documents
          </h2>
          
          {/* Stats Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <Skeleton className="h-4 w-16 mb-2" />
                <Skeleton className="h-6 w-8" />
              </div>
            ))}
          </div>
          
          {/* Documents Skeleton */}
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-5 h-5" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="w-8 h-8" />
                  <Skeleton className="w-8 h-8" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (documentsError || statsError) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-8 py-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Documents
          </h2>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-red-600 font-medium">Failed to load documents</p>
              <p className="text-gray-500 text-sm">Please try refreshing the page</p>
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
          <FileText className="h-5 w-5" />
          Documents
        </h2>
        
        {/* Document Statistics */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-600">Total</p>
              <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <p className="text-sm font-medium text-yellow-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-900">{stats.pending}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm font-medium text-green-600">Fulfilled</p>
              <p className="text-2xl font-bold text-green-900">{stats.fulfilled}</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <p className="text-sm font-medium text-red-600">Overdue</p>
              <p className="text-2xl font-bold text-red-900">{stats.overdue}</p>
            </div>
          </div>
        )}

        {/* Document List */}
        {documents.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No document requests found</p>
            <p className="text-gray-400 text-sm">Document requests will appear here when created</p>
          </div>
        ) : (
          <div className="space-y-4">
            {documents.map((doc: any, index: number) => (
              <div key={doc.id || index} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {formatDocumentType(doc.documentType || doc.type || "Unknown Document")}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={`text-xs font-medium rounded-full border ${getStatusColor(doc.status)}`}>
                        {doc.status?.charAt(0).toUpperCase() + doc.status?.slice(1) || "Unknown"}
                      </Badge>
                      {doc.size && (
                        <span className="text-xs text-gray-500">{doc.size}</span>
                      )}
                      {doc.uploadedAt && (
                        <span className="text-xs text-gray-500">
                          Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {doc.status === "fulfilled" ? (
                    <>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Download className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Upload className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}