"use client";

import { useState } from "react";
import { AttachmentsHeader } from "../_components/attachments-header";
import { AttachmentsTable, type AttachmentDocument } from "../_components/attachments-table";
import { AttachmentsPagination } from "../_components/attachments-pagination";

type SortOption = "name-asc" | "name-desc" | "date-asc" | "date-desc";
type FilterStatus = "all" | "uploaded" | "pending" | "rejected";

export default function EntrepreneurDocumentsPage() {
  const [searchValue, setSearchValue] = useState("");
  const [sort, setSort] = useState<SortOption>("date-desc");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // TODO: Fetch documents from API
  // Placeholder data matching the image
  const allDocuments: AttachmentDocument[] = [
    {
      id: "1",
      name: "Front ID Image",
      uploadedAt: "2024-06-05",
      status: "uploaded",
    },
    {
      id: "2",
      name: "Back ID Image",
      uploadedAt: "2024-06-05",
      status: "uploaded",
    },
    {
      id: "3",
      name: "Tax registration certificate",
      uploadedAt: "2024-06-05",
      status: "uploaded",
    },
    {
      id: "4",
      name: "Passport photo",
      status: "pending",
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

  const handleUpload = () => {
    // TODO: Implement upload functionality
    console.log("Upload document");
  };

  const handleView = (document: AttachmentDocument) => {
    // TODO: Implement view functionality
    console.log("View document:", document);
  };

  const handleUpdate = (document: AttachmentDocument) => {
    // TODO: Implement update functionality
    console.log("Update document:", document);
  };

  const handleDownload = (document: AttachmentDocument) => {
    // TODO: Implement download functionality
    console.log("Download document:", document);
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
        onUpload={handleUpload}
      />

      {/* Table */}
      <AttachmentsTable
        documents={paginatedDocuments}
        onView={handleView}
        onUpdate={handleUpdate}
        onDownload={handleDownload}
        onUpload={handleUpload}
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
    </div>
  );
}

