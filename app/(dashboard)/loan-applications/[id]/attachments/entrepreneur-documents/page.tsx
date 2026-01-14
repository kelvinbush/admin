"use client";

import { useState, useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { AttachmentsHeader } from "@/app/(dashboard)/entrepreneurs/[id]/attachments/_components/attachments-header";
import { AttachmentsTable, type AttachmentDocument } from "@/app/(dashboard)/entrepreneurs/[id]/attachments/_components/attachments-table";
import { AttachmentsPagination } from "@/app/(dashboard)/entrepreneurs/[id]/attachments/_components/attachments-pagination";
import { DocumentUploadModal } from "@/app/(dashboard)/entrepreneurs/[id]/attachments/_components/document-upload-modal";
import { useSavePersonalDocuments } from "@/lib/api/hooks/sme";
import { useKycKybDocuments, useVerifyKycKybDocument } from "@/lib/api/hooks/kyc-kyb";
import { ConfirmActionModal } from "@/app/(dashboard)/internal-users/_components/confirm-action-modal";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type SortOption = "name-asc" | "name-desc" | "date-asc" | "date-desc";
type FilterStatus = "all" | "uploaded" | "pending" | "rejected";

const PERSONAL_DOC_CONFIGS: { id: string; name: string; docType: string }[] = [
  { id: "national_id_front", name: "Front ID Image", docType: "national_id_front" },
  { id: "national_id_back", name: "Back ID Image", docType: "national_id_back" },
  { id: "passport_bio_page", name: "Passport bio page", docType: "passport_bio_page" },
  { id: "user_photo", name: "Passport photo", docType: "user_photo" },
  { id: "personal_tax_document", name: "Tax registration certificate", docType: "personal_tax_document" },
];

export default function EntrepreneurDocumentsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const entrepreneurId = searchParams.get("entrepreneurId");
  const applicationId = params.id as string;

  const [searchValue, setSearchValue] = useState("");
  const [sort, setSort] = useState<SortOption>("date-desc");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<AttachmentDocument | null>(null);

  const { data: kycData, isLoading, isError } = useKycKybDocuments(applicationId);
  const verifyMutation = useVerifyKycKybDocument(applicationId);

  const savePersonalDocumentsMutation = useSavePersonalDocuments();

  const allDocuments: AttachmentDocument[] = useMemo(() => {
    const personalDocs = kycData?.personalDocuments || [];
    return PERSONAL_DOC_CONFIGS.map((config) => {
      const found = personalDocs.find((d: any) => d.docType === config.docType);
      const status = found ? (found.verificationStatus || "uploaded") : "pending";
      return {
        id: found?.id || config.id,
        name: config.name,
        uploadedAt: found?.createdAt ?? null,
        status: status as any,
        url: found?.docUrl ?? null,
        docType: config.docType,
      } as AttachmentDocument;
    });
  }, [kycData]);

  const filteredDocuments = allDocuments.filter((doc) => {
    if (filterStatus !== "all" && doc.status !== filterStatus) return false;
    if (searchValue && !doc.name.toLowerCase().includes(searchValue.toLowerCase())) return false;
    return true;
  });

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    if (sort === "name-asc") return a.name.localeCompare(b.name);
    if (sort === "name-desc") return b.name.localeCompare(a.name);
    if (sort === "date-asc") {
      const dateA = a.uploadedAt ? new Date(a.uploadedAt).getTime() : 0;
      const dateB = b.uploadedAt ? new Date(b.uploadedAt).getTime() : 0;
      return dateA - dateB;
    }
    if (sort === "date-desc") {
      const dateA = a.uploadedAt ? new Date(a.uploadedAt).getTime() : 0;
      const dateB = b.uploadedAt ? new Date(b.uploadedAt).getTime() : 0;
      return dateB - dateA;
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedDocuments.length / itemsPerPage);
  const paginatedDocuments = sortedDocuments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleUploadOrUpdate = (document: AttachmentDocument) => {
    setSelectedDocument(document);
    setUpdateModalOpen(true);
  };

  // Approval/Rejection state and handlers
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [decisionDoc, setDecisionDoc] = useState<AttachmentDocument | null>(null);

  const onApprove = (doc: AttachmentDocument) => {
    setDecisionDoc(doc);
    setApproveOpen(true);
  };

  const onReject = (doc: AttachmentDocument) => {
    setDecisionDoc(doc);
    setRejectOpen(true);
  };

  const confirmApprove = async () => {
    if (!decisionDoc?.id) return;
    try {
      await verifyMutation.mutateAsync({
        documentId: decisionDoc.id,
        documentType: "personal",
        status: "approved",
      });
      toast.success("Document approved");
    } catch (e: any) {
      toast.error(e?.response?.data?.error || "Failed to approve document");
    } finally {
      setApproveOpen(false);
      setDecisionDoc(null);
    }
  };

  const confirmReject = async () => {
    if (!decisionDoc?.id) return;
    if (!reason.trim()) {
      toast.error("Rejection reason is required");
      return;
    }
    try {
      await verifyMutation.mutateAsync({
        documentId: decisionDoc.id,
        documentType: "personal",
        status: "rejected",
        rejectionReason: reason.trim(),
      });
      toast.success("Document rejected");
    } catch (e: any) {
      toast.error(e?.response?.data?.error || "Failed to reject document");
    } finally {
      setRejectOpen(false);
      setReason("");
      setDecisionDoc(null);
    }
  };

  const handleView = (document: AttachmentDocument) => {
    if (document.url) {
      window.open(document.url, "_blank", "noopener,noreferrer");
    } else {
      toast.error("Document not available. This document has not been uploaded yet.");
    }
  };

  const handleDownload = (document: AttachmentDocument) => {
    if (document.url) {
      window.open(document.url, "_blank", "noopener,noreferrer");
    } else {
      toast.error("Document not available. This document has not been uploaded yet.");
    }
  };

  const handleUpdateSubmit = async (fileUrl: string) => {
    if (!selectedDocument?.docType || !entrepreneurId) return;

    try {
      await savePersonalDocumentsMutation.mutateAsync({
        userId: entrepreneurId,
        data: {
          documents: [
            {
              docType: selectedDocument.docType,
              docUrl: fileUrl,
            },
          ],
        },
      });

      toast.success("Document uploaded successfully.");

      setUpdateModalOpen(false);
      setSelectedDocument(null);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.error || error?.message || "Failed to upload document.";
      toast.error(errorMessage);
    }
  };

  if (!entrepreneurId) {
    return (
      <div className="text-sm text-red-500">
        Entrepreneur ID is required. Please navigate from the loan application list.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-sm text-primaryGrey-500">
        Loading entrepreneur documents...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-sm text-red-500">
        Failed to load entrepreneur documents.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AttachmentsHeader
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onClearSearch={() => setSearchValue("")}
        sort={sort}
        onSortChange={setSort}
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
        onUpload={() => {}} // Not used for personal docs; uploads are per-row
      />

      <AttachmentsTable
        documents={paginatedDocuments}
        onView={handleView}
        onUpdate={handleUploadOrUpdate}
        onDownload={handleDownload}
        onUpload={handleUploadOrUpdate}
        onApprove={onApprove}
        onReject={onReject}
      />

      {totalPages > 1 && (
        <AttachmentsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={sortedDocuments.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Approve modal */}
      <ConfirmActionModal
        open={approveOpen}
        onOpenChange={setApproveOpen}
        onConfirm={confirmApprove}
        title="Are you sure you want to approve this document?"
        description="Approving this document confirms it is valid and meets all required criteria. You may still reject or update later if needed."
        confirmButtonText="Yes, Approve"
      />

      {/* Reject modal */}
      <Dialog open={rejectOpen} onOpenChange={(o) => { setRejectOpen(o); if (!o) setReason(""); }}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Are you sure you want to reject this document?</DialogTitle>
          </DialogHeader>
          <div className="mt-2">
            <Textarea
              placeholder="Please provide a clear reason for rejecting this document to help the user understand what needs to be provided"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              maxLength={1000}
              className="min-h-[120px]"
            />
            <div className="text-right text-xs text-primaryGrey-400 mt-1">{reason.length}/1000</div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)}>No, Cancel</Button>
            <Button className="bg-red-600 text-white" onClick={confirmReject} disabled={verifyMutation.isPending}>Yes, Reject</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {selectedDocument && (
        <DocumentUploadModal
          open={updateModalOpen}
          onOpenChange={setUpdateModalOpen}
          onSubmit={handleUpdateSubmit}
          documentName={selectedDocument.name}
          acceptedFormats={["PNG", "JPG", "JPEG", "PDF"]}
          maxSizeMB={2}
          isLoading={savePersonalDocumentsMutation.isPending}
        />
      )}
    </div>
  );
}
