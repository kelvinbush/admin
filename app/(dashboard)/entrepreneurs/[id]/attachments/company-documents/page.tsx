"use client";

import { useState } from "react";
import { AttachmentsHeader } from "../_components/attachments-header";
import { AttachmentsTable, type AttachmentDocument } from "../_components/attachments-table";
import { AttachmentsPagination } from "../_components/attachments-pagination";
import { DocumentUploadModal } from "../_components/document-upload-modal";
import { BankStatementUploadModal, type BankStatementEntry } from "../_components/bank-statement-upload-modal";
import { FinancialStatementUploadModal, type FinancialStatementEntry } from "../_components/financial-statement-upload-modal";

type SortOption = "name-asc" | "name-desc" | "date-asc" | "date-desc";
type FilterStatus = "all" | "uploaded" | "pending" | "rejected";

export default function CompanyDocumentsPage() {
  const [searchValue, setSearchValue] = useState("");
  const [sort, setSort] = useState<SortOption>("date-desc");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<AttachmentDocument | null>(null);
  const [uploadNewModalOpen, setUploadNewModalOpen] = useState(false);
  const [bankStatementModalOpen, setBankStatementModalOpen] = useState(false);
  const [financialStatementModalOpen, setFinancialStatementModalOpen] = useState(false);

  // TODO: Fetch documents from API
  // Placeholder data for testing
  const allDocuments: AttachmentDocument[] = [
    {
      id: "1",
      name: "Certificate of Incorporation",
      uploadedAt: "2024-06-20",
      status: "uploaded",
    },
    {
      id: "2",
      name: "Tax registration certificate",
      uploadedAt: "2024-06-20",
      status: "uploaded",
    },
    {
      id: "3",
      name: "Tax clearance certificate",
      uploadedAt: "2024-06-20",
      status: "uploaded",
    },
    {
      id: "4",
      name: "CR1 - Return of Allotment",
      uploadedAt: "2024-06-20",
      status: "uploaded",
    },
    {
      id: "5",
      name: "CR2 - Register of Members",
      uploadedAt: "2024-06-20",
      status: "uploaded",
    },
    {
      id: "6",
      name: "CR8 - Register of Directors",
      uploadedAt: "2024-06-20",
      status: "uploaded",
    },
    {
      id: "7",
      name: "CR12 - Annual Return",
      uploadedAt: "2024-06-20",
      status: "uploaded",
    },
    {
      id: "8",
      name: "Memorandum of Association",
      uploadedAt: "2024-06-20",
      status: "uploaded",
    },
    {
      id: "9",
      name: "Articles of Association",
      uploadedAt: "2024-06-20",
      status: "uploaded",
    },
    {
      id: "10",
      name: "Company Tax Registration Certificate",
      uploadedAt: "2024-06-20",
      status: "uploaded",
    },
    {
      id: "11",
      name: "Company Tax Clearance Certificate",
      uploadedAt: "2024-06-20",
      status: "uploaded",
    },
    {
      id: "12",
      name: "Business Plan",
      uploadedAt: "2024-06-20",
      status: "uploaded",
    },
    {
      id: "13",
      name: "Management Accounts",
      uploadedAt: "2024-06-20",
      status: "uploaded",
    },
    {
      id: "14",
      name: "Business Permit",
      uploadedAt: "2024-06-20",
      status: "uploaded",
    },
    {
      id: "15",
      name: "Company Pitch Deck / Company Profile",
      uploadedAt: "2024-06-20",
      status: "uploaded",
    },
    {
      id: "16",
      name: "Bank Statements",
      uploadedAt: "2024-06-20",
      status: "uploaded",
    },
    {
      id: "17",
      name: "Financial Statements",
      uploadedAt: "2024-06-20",
      status: "uploaded",
    },
    {
      id: "18",
      name: "CR8 - Register of Directors",
      status: "pending",
    },
    {
      id: "19",
      name: "Bank Statements",
      status: "pending",
    },
    {
      id: "20",
      name: "Financial Statements",
      status: "pending",
    },
    {
      id: "21",
      name: "Business Permit",
      status: "rejected",
    },
  ];

  // Filter and sort documents
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

  // Paginate
  const totalPages = Math.ceil(sortedDocuments.length / itemsPerPage);
  const paginatedDocuments = sortedDocuments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleUploadNew = () => {
    setUploadNewModalOpen(true);
  };

  const handleView = (document: AttachmentDocument) => {
    // TODO: Implement view functionality
    console.log("View document:", document);
  };

  const handleUpdate = (document: AttachmentDocument) => {
    setSelectedDocument(document);
    
    // Check if it's a special document type
    if (document.name === "Bank Statements") {
      setBankStatementModalOpen(true);
    } else if (document.name === "Financial Statements") {
      setFinancialStatementModalOpen(true);
    } else {
      setUpdateModalOpen(true);
    }
  };

  const handleUpload = (document: AttachmentDocument) => {
    setSelectedDocument(document);
    
    // Check if it's a special document type
    if (document.name === "Bank Statements") {
      setBankStatementModalOpen(true);
    } else if (document.name === "Financial Statements") {
      setFinancialStatementModalOpen(true);
    } else {
      // For regular documents, use the update modal (same functionality)
      setUpdateModalOpen(true);
    }
  };

  const handleDownload = (document: AttachmentDocument) => {
    // TODO: Implement download functionality
    console.log("Download document:", document);
  };

  const handleUploadSubmit = (fileUrl: string, documentName?: string) => {
    // TODO: Submit to API
    console.log("Upload document:", { fileUrl, documentName });
    setUploadNewModalOpen(false);
    // Refresh documents list
  };

  const handleUpdateSubmit = (fileUrl: string) => {
    // TODO: Submit to API
    console.log("Update document:", { documentId: selectedDocument?.id, fileUrl });
    setUpdateModalOpen(false);
    setSelectedDocument(null);
    // Refresh documents list
  };

  const handleBankStatementSubmit = (entries: BankStatementEntry[]) => {
    // TODO: Submit to API
    console.log("Update bank statements:", entries);
    setBankStatementModalOpen(false);
    setSelectedDocument(null);
    // Refresh documents list
  };

  const handleFinancialStatementSubmit = (entries: FinancialStatementEntry[]) => {
    // TODO: Submit to API
    console.log("Update financial statements:", entries);
    setFinancialStatementModalOpen(false);
    setSelectedDocument(null);
    // Refresh documents list
  };

  return (
    <div className="space-y-4">
      {/* Header with Filters */}
      <AttachmentsHeader
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onClearSearch={() => setSearchValue("")}
        sort={sort}
        onSortChange={setSort}
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
        onUpload={handleUploadNew}
      />

      {/* Table */}
      <AttachmentsTable
        documents={paginatedDocuments}
        onView={handleView}
        onUpdate={handleUpdate}
        onDownload={handleDownload}
        onUpload={handleUpload}
        onUploadNew={handleUpload}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <AttachmentsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={sortedDocuments.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Upload New Document Modal (unnamed) */}
      <DocumentUploadModal
        open={uploadNewModalOpen}
        onOpenChange={setUploadNewModalOpen}
        onSubmit={handleUploadSubmit}
        requireDocumentName={true}
        acceptedFormats={["PNG", "JPG", "JPEG", "PDF"]}
        maxSizeMB={2}
      />

      {/* Update Document Modal (named) */}
      {selectedDocument && selectedDocument.name !== "Bank Statements" && selectedDocument.name !== "Financial Statements" && (
        <DocumentUploadModal
          open={updateModalOpen}
          onOpenChange={setUpdateModalOpen}
          onSubmit={handleUpdateSubmit}
          documentName={selectedDocument.name}
          acceptedFormats={["PNG", "JPG", "JPEG", "PDF"]}
          maxSizeMB={2}
        />
      )}

      {/* Bank Statement Upload Modal */}
      <BankStatementUploadModal
        open={bankStatementModalOpen}
        onOpenChange={setBankStatementModalOpen}
        onSubmit={handleBankStatementSubmit}
      />

      {/* Financial Statement Upload Modal */}
      <FinancialStatementUploadModal
        open={financialStatementModalOpen}
        onOpenChange={setFinancialStatementModalOpen}
        onSubmit={handleFinancialStatementSubmit}
      />
    </div>
  );
}

