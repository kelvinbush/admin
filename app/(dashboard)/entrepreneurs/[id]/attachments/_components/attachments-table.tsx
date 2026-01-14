"use client";

import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { DocumentIcon } from "@/components/icons/document-icons";
import { DocumentStatusBadge } from "./document-status-badge";
import { DocumentActions } from "./document-actions";
import { format } from "date-fns";

export interface AttachmentDocument {
  id: string;
  name: string;
  uploadedAt?: string | null;
  status: "uploaded" | "pending" | "approved" | "rejected";
  url?: string | null;
  docType?: string;
}

interface AttachmentsTableProps {
  documents: AttachmentDocument[];
  onView?: (document: AttachmentDocument) => void;
  onUpdate?: (document: AttachmentDocument) => void;
  onDownload?: (document: AttachmentDocument) => void;
  onUpload?: (document: AttachmentDocument) => void;
  onUploadNew?: () => void; // For uploading unnamed documents
  onApprove?: (document: AttachmentDocument) => void;
  onReject?: (document: AttachmentDocument) => void;
}

export function AttachmentsTable({
  documents,
  onView,
  onUpdate,
  onDownload,
  onUpload,
  onApprove,
  onReject,
}: AttachmentsTableProps) {
  const [selectedDocuments, setSelectedDocuments] = useState<Set<string>>(new Set());

  const mapStatus = (
    status: AttachmentDocument["status"],
  ): "approved" | "rejected" | "pending_review" | "missing" => {
    switch (status) {
      case "approved":
        return "approved";
      case "rejected":
        return "rejected";
      case "uploaded":
      case "pending":
        return "pending_review";
      default:
        return "missing";
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedDocuments(new Set(documents.map((doc) => doc.id)));
    } else {
      setSelectedDocuments(new Set());
    }
  };

  const handleSelectDocument = (documentId: string, checked: boolean) => {
    const newSelected = new Set(selectedDocuments);
    if (checked) {
      newSelected.add(documentId);
    } else {
      newSelected.delete(documentId);
    }
    setSelectedDocuments(newSelected);
  };

  const allSelected = documents.length > 0 && selectedDocuments.size === documents.length;
  const someSelected = selectedDocuments.size > 0 && selectedDocuments.size < documents.length;

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return null;
    try {
      return format(new Date(dateString), "do MMMM yyyy");
    } catch {
      return null;
    }
  };

  return (
    <div className="rounded-md border border-primaryGrey-50 overflow-hidden">
      <table className="w-full">
        <thead className="bg-[#E8E9EA] border-b border-[#B6BABC]">
          <tr>
            <th className="px-6 py-4 text-left">
              <Checkbox
                checked={allSelected}
                onCheckedChange={handleSelectAll}
                className={someSelected ? "data-[state=checked]:bg-primary-green" : ""}
              />
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-midnight-blue">
              Document Name
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-midnight-blue">
              Status
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-midnight-blue">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-primaryGrey-100">
          {documents.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-6 py-12 text-center text-primaryGrey-400">
                No documents found
              </td>
            </tr>
          ) : (
            documents.map((document) => {
              const uploadedDate = formatDate(document.uploadedAt);
              return (
                <tr key={document.id} className="hover:bg-primaryGrey-50 transition-colors">
                  <td className="px-6 py-4">
                    <Checkbox
                      checked={selectedDocuments.has(document.id)}
                      onCheckedChange={(checked) =>
                        handleSelectDocument(document.id, checked as boolean)
                      }
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <DocumentIcon />
                      <div>
                        <div className="text-sm font-medium text-midnight-blue">
                          {document.name}
                        </div>
                        {uploadedDate && (
                          <div className="text-xs text-primaryGrey-400 mt-0.5">
                            Uploaded {uploadedDate}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <DocumentStatusBadge status={mapStatus(document.status)} />
                  </td>
                  <td className="px-6 py-4">
                    <DocumentActions
                      status={mapStatus(document.status)}
                      documentName={document.name}
                      onView={() => onView?.(document)}
                      onUpdate={() => onUpdate?.(document)}
                      onDownload={() => onDownload?.(document)}
                      onUpload={() => onUpload?.(document)}
                      onApprove={onApprove ? () => onApprove(document) : undefined}
                      onReject={onReject ? () => onReject(document) : undefined}
                    />
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

