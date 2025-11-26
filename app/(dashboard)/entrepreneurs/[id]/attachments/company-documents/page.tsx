"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { AttachmentsHeader } from "../_components/attachments-header";
import { AttachmentsTable, type AttachmentDocument } from "../_components/attachments-table";
import { AttachmentsPagination } from "../_components/attachments-pagination";
import { DocumentUploadModal } from "../_components/document-upload-modal";
import { BankStatementUploadModal, type BankStatementEntry } from "../_components/bank-statement-upload-modal";
import { FinancialStatementUploadModal, type FinancialStatementEntry } from "../_components/financial-statement-upload-modal";
import {
  useSMEBusinessDocuments,
  useSaveCompanyDocuments,
  useSaveFinancialDocuments,
  useSavePermitsAndPitchDeck,
} from "@/lib/api/hooks/sme";
import { toast } from "sonner";

type SortOption = "name-asc" | "name-desc" | "date-asc" | "date-desc";
type FilterStatus = "all" | "uploaded" | "pending" | "rejected";

const COMPANY_DOC_CONFIGS: {
  id: string;
  name: string;
  docTypes: string[];
  category: "company" | "financial" | "permits";
}[] = [
  {
    id: "certificate_of_incorporation",
    name: "Certificate of Incorporation",
    docTypes: ["certificate_of_incorporation", "business_registration"],
    category: "company",
  },
  {
    id: "CR1",
    name: "CR1 - Return of Allotment",
    docTypes: ["CR1"],
    category: "company",
  },
  {
    id: "CR2",
    name: "CR2 - Register of Members",
    docTypes: ["CR2"],
    category: "company",
  },
  {
    id: "CR8",
    name: "CR8 - Register of Directors",
    docTypes: ["CR8"],
    category: "company",
  },
  {
    id: "CR12",
    name: "CR12 - Annual Return",
    docTypes: ["CR12"],
    category: "company",
  },
  {
    id: "memorandum_of_association",
    name: "Memorandum of Association",
    docTypes: ["memorandum_of_association"],
    category: "company",
  },
  {
    id: "articles_of_association",
    name: "Articles of Association",
    docTypes: ["articles_of_association"],
    category: "company",
  },
  {
    id: "tax_registration_certificate",
    name: "Company Tax Registration Certificate",
    docTypes: ["tax_registration_certificate"],
    category: "company",
  },
  {
    id: "tax_clearance_certificate",
    name: "Company Tax Clearance Certificate",
    docTypes: ["tax_clearance_certificate"],
    category: "company",
  },
  {
    id: "business_plan",
    name: "Business Plan",
    docTypes: ["business_plan"],
    category: "financial",
  },
  {
    id: "income_statements",
    name: "Management Accounts",
    docTypes: ["income_statements"],
    category: "financial",
  },
  {
    id: "business_permit",
    name: "Business Permit",
    docTypes: ["business_permit"],
    category: "permits",
  },
  {
    id: "pitch_deck",
    name: "Company Pitch Deck / Company Profile",
    docTypes: ["pitch_deck"],
    category: "permits",
  },
  {
    id: "annual_bank_statement",
    name: "Bank Statements",
    docTypes: ["annual_bank_statement"],
    category: "financial",
  },
  {
    id: "audited_financial_statements",
    name: "Financial Statements",
    docTypes: ["audited_financial_statements"],
    category: "financial",
  },
];

export default function CompanyDocumentsPage() {
  const params = useParams();
  const entrepreneurId = params.id as string;

  const [searchValue, setSearchValue] = useState("");
  const [sort, setSort] = useState<SortOption>("date-desc");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<AttachmentDocument | null>(null);
  const [bankStatementModalOpen, setBankStatementModalOpen] = useState(false);
  const [financialStatementModalOpen, setFinancialStatementModalOpen] = useState(false);

  const { data: businessDocuments, isLoading, isError } = useSMEBusinessDocuments(entrepreneurId, {
    enabled: !!entrepreneurId,
  });

  const saveCompanyDocumentsMutation = useSaveCompanyDocuments();
  const saveFinancialDocumentsMutation = useSaveFinancialDocuments();
  const savePermitsMutation = useSavePermitsAndPitchDeck();

  const allDocuments: AttachmentDocument[] = useMemo(() => {
    return COMPANY_DOC_CONFIGS.map((config) => {
      const found = businessDocuments?.find((d) => config.docTypes.includes(d.docType));
      return {
        id: config.id,
        name: config.name,
        uploadedAt: found?.createdAt ?? null,
        status: found ? "uploaded" : "pending",
        url: found?.docUrl ?? null,
        docType: found?.docType ?? config.docTypes[0],
      };
    });
  }, [businessDocuments]);

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

  const openForDocument = (document: AttachmentDocument) => {
    setSelectedDocument(document);

    if (document.name === "Bank Statements") {
      setBankStatementModalOpen(true);
    } else if (document.name === "Financial Statements") {
      setFinancialStatementModalOpen(true);
    } else {
      setUpdateModalOpen(true);
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
    if (!selectedDocument?.docType) return;

    const config = COMPANY_DOC_CONFIGS.find((c) =>
      c.docTypes.includes(selectedDocument.docType as string)
    );

    if (!config) return;

    try {
      if (config.category === "company") {
        await saveCompanyDocumentsMutation.mutateAsync({
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
      } else if (config.category === "financial") {
        await saveFinancialDocumentsMutation.mutateAsync({
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
      } else if (config.category === "permits") {
        await savePermitsMutation.mutateAsync({
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
      }

      toast.success("Document uploaded successfully.");

      setUpdateModalOpen(false);
      setSelectedDocument(null);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.error || error?.message || "Failed to upload document.";
      toast.error(errorMessage);
    }
  };

  const handleBankStatementSubmit = async (entries: BankStatementEntry[]) => {
    try {
      const documents = entries.map((entry) => {
        const bankName =
          entry.bankName === "other" ? entry.specifyBankName : entry.bankName;
        return {
          docType: "annual_bank_statement",
          docUrl: entry.statementFile,
          docBankName: bankName || undefined,
          isPasswordProtected: !!entry.password,
          docPassword: entry.password || undefined,
        };
      });

      await saveFinancialDocumentsMutation.mutateAsync({
        userId: entrepreneurId,
        data: { documents },
      });

      toast.success("Bank statements updated successfully.");

      setBankStatementModalOpen(false);
      setSelectedDocument(null);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.error || error?.message || "Failed to update bank statements.";
      toast.error(errorMessage);
    }
  };

  const handleFinancialStatementSubmit = async (entries: FinancialStatementEntry[]) => {
    try {
      const documents = entries.map((entry) => ({
        docType: "audited_financial_statements",
        docUrl: entry.statementFile,
        docYear: parseInt(entry.year, 10),
        isPasswordProtected: false,
      }));

      await saveFinancialDocumentsMutation.mutateAsync({
        userId: entrepreneurId,
        data: { documents },
      });

      toast.success("Financial statements updated successfully.");

      setFinancialStatementModalOpen(false);
      setSelectedDocument(null);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.error || error?.message || "Failed to update financial statements.";
      toast.error(errorMessage);
    }
  };

  const bankStatementInitialEntries: BankStatementEntry[] = useMemo(() => {
    if (!businessDocuments) return [];
    return businessDocuments
      .filter((d) => d.docType === "annual_bank_statement")
      .map((d) => ({
        id: d.id,
        bankName: "other",
        specifyBankName: d.docBankName || "",
        statementFile: d.docUrl,
        password: d.docPassword || "",
      }));
  }, [businessDocuments]);

  const financialStatementInitialEntries: FinancialStatementEntry[] = useMemo(() => {
    if (!businessDocuments) return [];
    return businessDocuments
      .filter((d) => d.docType === "audited_financial_statements")
      .map((d) => ({
        id: d.id,
        year: d.docYear ? d.docYear.toString() : "",
        statementFile: d.docUrl,
      }));
  }, [businessDocuments]);

  if (isLoading) {
    return (
      <div className="text-sm text-primaryGrey-500">
        Loading company documents...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-sm text-red-500">
        Failed to load company documents.
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
        onUpload={() => {}} // uploads are triggered per-row
      />

      <AttachmentsTable
        documents={paginatedDocuments}
        onView={handleView}
        onUpdate={openForDocument}
        onDownload={handleDownload}
        onUpload={openForDocument}
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

      {selectedDocument &&
        selectedDocument.name !== "Bank Statements" &&
        selectedDocument.name !== "Financial Statements" && (
          <DocumentUploadModal
            open={updateModalOpen}
            onOpenChange={setUpdateModalOpen}
            onSubmit={handleUpdateSubmit}
            documentName={selectedDocument.name}
            acceptedFormats={["PNG", "JPG", "JPEG", "PDF"]}
            maxSizeMB={2}
            isLoading={
              saveCompanyDocumentsMutation.isPending ||
              saveFinancialDocumentsMutation.isPending ||
              savePermitsMutation.isPending
            }
          />
        )}

      <BankStatementUploadModal
        open={bankStatementModalOpen}
        onOpenChange={setBankStatementModalOpen}
        onSubmit={handleBankStatementSubmit}
        initialEntries={bankStatementInitialEntries}
        isLoading={saveFinancialDocumentsMutation.isPending}
      />

      <FinancialStatementUploadModal
        open={financialStatementModalOpen}
        onOpenChange={setFinancialStatementModalOpen}
        onSubmit={handleFinancialStatementSubmit}
        initialEntries={financialStatementInitialEntries}
        isLoading={saveFinancialDocumentsMutation.isPending}
      />
    </div>
  );
}

