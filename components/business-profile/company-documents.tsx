"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight, Loader2, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { userApiSlice } from "@/lib/redux/services/user";
import { BusinessDocument, DocType } from "@/lib/types/user";
import { Icons } from "@/components/icons";

const documentTypeNames: Record<DocType, string> = {
  [DocType.BusinessRegistration]: "Business Registration",
  [DocType.ArticlesOfAssociation]: "Articles of Association",
  [DocType.BusinessPermit]: "Business Permit",
  [DocType.TaxRegistrationDocument]: "Tax Registration Certificate",
  [DocType.AnnualBankStatement]: "Annual Bank Statement",
  [DocType.AuditedFinancialStatement]: "Management Accounts for the year 2025",
  [DocType.CertificateOfIncorporation]: "Certificate of Incorporation",
  [DocType.BusinessPlan]: "Business Plan",
  [DocType.PitchDeck]: "Pitch Deck or Company Profile",
  [DocType.TaxClearanceDocument]: "Tax Clearance Document",
  [DocType.BalanceCahsFlowIncomeStatement]: "Income Statements",
  [DocType.MemorandumOfAssociation]: "Memorandum of Association",
  [DocType.PartnershipDeed]: "Partnership Deed",
  [DocType.AuditedFinancialStatementyear2]:
    "Audited Financial Statement for the year 2024",
  [DocType.AuditedFinancialStatementyear3]:
    "Audited Financial Statement for the year 2023",
};

const soleProprietorRequiredDocuments = [
  DocType.BusinessRegistration,
  DocType.TaxRegistrationDocument,
  DocType.TaxClearanceDocument,
  DocType.AnnualBankStatement,
  DocType.BusinessPermit,
  DocType.PitchDeck,
  DocType.BusinessPlan,
];

const companyRequiredDocuments = [
  DocType.CertificateOfIncorporation,
  DocType.MemorandumOfAssociation,
  DocType.TaxClearanceDocument,
  DocType.AnnualBankStatement,
  DocType.BusinessPermit,
  DocType.PitchDeck,
  DocType.BusinessPlan,
];

const partnerRequiredDocuments = [
  DocType.BusinessRegistration,
  DocType.PartnershipDeed,
  DocType.TaxClearanceDocument,
  DocType.AnnualBankStatement,
  DocType.BusinessPermit,
  DocType.PitchDeck,
  DocType.BusinessPlan,
];

const getStatusBadgeStyles = (status: string | undefined) => {
  switch (status?.toLowerCase()) {
    case "under review":
      return "text-[#1E429F] bg-[#E1EFFE] hover:text-[#1E429F] hover:bg-[#E1EFFE]";
    case "verified":
      return "text-[#007054] bg-[#B0EFDF] hover:text-[#007054] hover:bg-[#B0EFDF]";
    case "rejected":
      return "text-[#650D17] bg-[#E9B7BD] hover:text-[#650D17] hover:bg-[#E9B7BD]";
    case "pending":
      return "text-[#8C5E00] bg-[#FFE5B0] hover:text-[#8C5E00] hover:bg-[#FFE5B0]";
    default:
      return "text-[#1E429F] bg-[#E1EFFE] hover:text-[#1E429F] hover:bg-[#E1EFFE]";
  }
};

const getDocumentStatus = (doc: BusinessDocument | null) => {
  if (!doc)
    return {
      text: "Pending",
      style:
        "text-[#8C5E00] bg-[#FFE5B0] hover:text-[#8C5E00] hover:bg-[#FFE5B0]",
    };

  if (!doc.status) {
    return {
      text: "Under Review",
      style:
        "text-[#1E429F] bg-[#E1EFFE] hover:text-[#1E429F] hover:bg-[#E1EFFE]",
    };
  }

  return {
    text: doc.status,
    style: getStatusBadgeStyles(doc.status),
  };
};

const EmptyState = ({
  hasDocuments,
  hasFilters,
  onReset,
}: {
  hasDocuments: boolean;
  hasFilters: boolean;
  onReset: () => void;
}) => {
  if (!hasDocuments) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Icons.emptyFunds className="h-32 w-32 mb-6 text-gray-400" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No Documents Available
        </h3>
        <p className="text-gray-500">
          Upload your company documents to get started.
        </p>
      </div>
    );
  }

  if (hasFilters) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Icons.emptyFunds className="h-32 w-32 mb-6 text-gray-400" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No documents found
        </h3>
        <p className="text-gray-500">
          Try adjusting your filters or search terms.
        </p>
        <Button
          variant="outline"
          onClick={onReset}
          className="mt-4 flex items-center gap-2 bg-gray-50 hover:bg-gray-100"
        >
          Reset Filters
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return null;
};

export default function CompanyDocuments({ userId }: { userId: string }) {
  const { data: businessProfile, isLoading } =
    userApiSlice.useGetBusinessProfileByPersonalGuidQuery(
      { guid: userId as string },
      { skip: !userId },
    );

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [, setSelectedDocument] = useState<BusinessDocument | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDocs, setSelectedDocs] = useState<Set<string>>(new Set());
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const itemsPerPage = 5;

  useEffect(() => {
    if (!businessProfile) {
      console.log("No business profile found");
    } else {
      console.log("Business profile:", businessProfile);
    }
  }, [businessProfile]);

  const { data: documentResponse } = userApiSlice.useGetBusinessDocumentsQuery(
    { businessGuid: businessProfile?.business?.businessGuid || "" },
    { skip: !businessProfile?.business?.businessGuid },
  );

  const documents = documentResponse?.documents || [];

  // Create a map of all required documents, including missing ones
  const allDocuments = useMemo(() => {
    const documentMap = new Map<number, BusinessDocument | null>();

    // Get required documents based on business type
    const getRequiredDocuments = () => {
      const incorporationType =
        businessProfile?.business?.typeOfIncorporation?.toLowerCase();

      switch (incorporationType) {
        case "private-limited-company":
        case "public-limited-company":
        case "limited-liability-company-llc":
        case "s-corporation":
        case "c-corporation":
          return companyRequiredDocuments;
        case "general-partnership":
        case "limited-liability-partnership-llp":
          return partnerRequiredDocuments;
        case "sole-proprietorship":
          return soleProprietorRequiredDocuments;
        default:
          return soleProprietorRequiredDocuments; // Default to sole proprietor if type is unknown
      }
    };

    // Initialize with all required documents as null (missing)
    const requiredDocuments = getRequiredDocuments();
    requiredDocuments.forEach((docType) => {
      documentMap.set(docType, null);
    });

    // Update with existing documents
    documents.forEach((doc: BusinessDocument | null) => {
      if (doc && typeof doc.docType === "number") {
        documentMap.set(doc.docType, doc);
      }
    });

    return documentMap;
  }, [documents, businessProfile?.business?.typeOfIncorporation]);

  const filteredDocuments = useMemo(() => {
    return Array.from(allDocuments.entries()).filter(([docType, doc]) => {
      const name =
        documentTypeNames[docType as unknown as DocType]?.toLowerCase();
      const matchesSearch = name?.includes(searchQuery.toLowerCase());

      if (filterStatus === "all") return matchesSearch;

      const status = getDocumentStatus(doc).text.toLowerCase();
      return matchesSearch && status === filterStatus.toLowerCase();
    });
  }, [allDocuments, searchQuery, filterStatus]);

  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(
    startIndex + itemsPerPage,
    filteredDocuments.length,
  );
  const currentDocuments = filteredDocuments.slice(startIndex, endIndex);

  const handleViewDocument = (doc: BusinessDocument) => {
    setSelectedDocument(doc);
    window.open(doc.docPath, "_blank");
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const downloadFile = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const handleDownloadDocument = async (doc: BusinessDocument) => {
    try {
      const filename = `${documentTypeNames[doc.docType as unknown as DocType]}.${doc.docPath.split(".").pop()}`;
      await downloadFile(doc.docPath, filename);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const generatePaginationNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    range.push(1);

    if (totalPages <= 1) return range;

    for (let i = currentPage - delta; i <= currentPage + delta; i++) {
      if (i < totalPages && i > 1) {
        range.push(i);
      }
    }
    range.push(totalPages);

    for (const i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const hasActiveFilters = searchQuery.length > 0 || filterStatus !== "all";
  const noDocuments = !documents?.length;
  const noFilteredResults = filteredDocuments.length === 0;

  return (
    <div className={cn("space-y-6 p-6")}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-medium">Company Documents</h2>
        </div>
        <div className="flex items-center gap-4 justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative w-64">
                <Search className="absolute left-2 top-4 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search document..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-12"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="lg"
                    className="gap-2 bg-[#E8E9EA]"
                  >
                    <Icons.filter className="h-4 w-4" />
                    {filterStatus === "all"
                      ? "All Documents"
                      : filterStatus.charAt(0).toUpperCase() +
                        filterStatus.slice(1)}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuRadioGroup
                    value={filterStatus}
                    onValueChange={setFilterStatus}
                  >
                    <DropdownMenuRadioItem value="all">
                      All Documents
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="under review">
                      Under Review
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="verified">
                      Verified
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="rejected">
                      Rejected
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="pending">
                      Pending
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <div>
          {noDocuments || (noFilteredResults && hasActiveFilters) ? (
            <EmptyState
              hasDocuments={!noDocuments}
              hasFilters={hasActiveFilters && noFilteredResults}
              onReset={() => {
                setSearchQuery("");
                setFilterStatus("all");
              }}
            />
          ) : (
            <Table>
              <TableHeader className={"bg-[#E8E9EA]"}>
                <TableRow className="hover:bg-transparent uppercase">
                  <TableHead className="w-[40px]">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300"
                      checked={
                        currentDocuments.length > 0 &&
                        currentDocuments.every(([docType]) =>
                          selectedDocs.has(docType.toString()),
                        )
                      }
                      onChange={(e) => {
                        const newSelected = new Set(selectedDocs);
                        if (e.target.checked) {
                          currentDocuments.forEach(([docType]) =>
                            newSelected.add(docType.toString()),
                          );
                        } else {
                          currentDocuments.forEach(([docType]) =>
                            newSelected.delete(docType.toString()),
                          );
                        }
                        setSelectedDocs(newSelected);
                      }}
                    />
                  </TableHead>
                  <TableHead className="w-[40%] text-xs text-[#151F28]">
                    Document Name
                  </TableHead>
                  <TableHead className="w-[20%] text-xs text-[#151F28]">
                    Status
                  </TableHead>
                  <TableHead className="w-[20%] text-xs text-[#151F28]">
                    Status Remarks
                  </TableHead>
                  <TableHead className="w-[20%] text-xs text-[#151F28] text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentDocuments.map(([docType, doc]) => (
                  <TableRow key={docType} className="hover:bg-gray-50">
                    <TableCell className="w-[40px]">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300"
                        checked={selectedDocs.has(docType.toString())}
                        onChange={(e) => {
                          const newSelected = new Set(selectedDocs);
                          if (e.target.checked) {
                            newSelected.add(docType.toString());
                          } else {
                            newSelected.delete(docType.toString());
                          }
                          setSelectedDocs(newSelected);
                        }}
                        disabled={!doc}
                      />
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-start gap-x-4">
                        <Icons.docIcon className="h-4 w-4" />
                        <div className={"-mt-1"}>
                          <p className="font-medium text-midnight-blue text-sm">
                            {documentTypeNames[docType as unknown as DocType]}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {doc ? (
                        <Badge
                          className={cn(
                            "font-medium shadow-none rounded-md",
                            getDocumentStatus(doc).style,
                          )}
                        >
                          {getDocumentStatus(doc).text}
                        </Badge>
                      ) : (
                        <Badge
                          className={cn(
                            "font-medium shadow-none rounded-md",
                            "text-[#8C5E00] bg-[#FFE5B0]",
                          )}
                        >
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {doc?.statusRemarks || "--"}
                    </TableCell>
                    <TableCell className="text-right">
                      {doc && (
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDocument(doc)}
                            className="gap-1 text-deep-blue-500 hover:text-deep-blue-400 text-sm"
                          >
                            <Icons.view className="h-4 w-4" />
                            View
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadDocument(doc)}
                            className="gap-2 text-midnight-blue hover:text-midnight-blue/80 text-sm"
                          >
                            <Icons.download className="h-4 w-4" />
                            Download
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-700">
                Showing {startIndex + 1} to{" "}
                {Math.min(endIndex, filteredDocuments.length)} of{" "}
                {filteredDocuments.length} results
              </span>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {generatePaginationNumbers().map((pageNum, index) => (
                  <Button
                    key={index}
                    variant={pageNum === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      typeof pageNum === "number" && handlePageChange(pageNum)
                    }
                    disabled={pageNum === "..."}
                    className={cn(
                      "h-8 w-8 p-0",
                      pageNum === currentPage &&
                        "bg-gradient-to-r from-[#8AF2F2] to-[#54DDBB] text-midnight-blue hover:from-[#8AF2F2] hover:to-[#54DDBB] hover:text-midnight-blue",
                      pageNum === "..." &&
                        "cursor-default hover:bg-transparent",
                    )}
                  >
                    {pageNum}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Download Modal */}
          <Dialog
            open={isDownloadModalOpen}
            onOpenChange={setIsDownloadModalOpen}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Download Selected Documents</DialogTitle>
                <DialogDescription>
                  You have selected {selectedDocs.size} document(s) to download.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="max-h-[200px] overflow-y-auto space-y-2">
                  {Array.from(selectedDocs).map((docType) => {
                    allDocuments.get(docType as unknown as number);
                    return (
                      <div key={docType} className="flex items-center gap-2">
                        <Icons.docIcon className="h-4 w-4" />
                        <span className="text-sm">
                          {documentTypeNames[docType as unknown as DocType]}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-end gap-2">
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button
                    onClick={() => {
                      // Download all selected documents
                      Array.from(selectedDocs).forEach(async (docType) => {
                        const doc = allDocuments.get(
                          docType as unknown as number,
                        );
                        if (doc?.docPath) {
                          const filename = `${documentTypeNames[docType as unknown as DocType]}.${doc.docPath.split(".").pop()}`;
                          await downloadFile(doc.docPath, filename);
                        }
                      });
                      setIsDownloadModalOpen(false);
                    }}
                  >
                    Download
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Floating Download Button */}
          {selectedDocs.size > 0 && (
            <div className="fixed bottom-8 right-[40%] z-50">
              <Button
                onClick={() => setIsDownloadModalOpen(true)}
                className="shadow-lg flex items-center gap-2 bg-primary-green hover:bg-primary-green/90"
              >
                <Icons.download className="h-4 w-4" />
                Download Selected ({selectedDocs.size})
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
