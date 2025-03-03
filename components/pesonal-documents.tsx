"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { ChevronLeft, ChevronRight, Download, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { userApiSlice } from "@/lib/redux/services/user";
import { Icons } from "@/components/icons";

enum DocumentType {
  NationalIdFront = 0,
  NationalIdBack = 1,
  Passport = 2,
  TaxComplaintDocument = 3,
}

interface PersonalDocument {
  id: number;
  docType: DocumentType;
  docPath: string;
  createdDate: string;
  modifiedDate: string | null;
  status?: string;
  remarks?: string;
}

const documentTypeNames: Record<DocumentType, string> = {
  [DocumentType.NationalIdFront]: "National ID (Front)",
  [DocumentType.NationalIdBack]: "National ID (Back)",
  [DocumentType.Passport]: "Passport",
  [DocumentType.TaxComplaintDocument]: "Personal Tax Complaint Document",
};

const requiredDocuments = [
  DocumentType.NationalIdFront,
  DocumentType.NationalIdBack,
  DocumentType.Passport,
  DocumentType.TaxComplaintDocument,
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

const getDocumentStatus = (doc: PersonalDocument | null) => {
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

function PersonalDocuments({ userId }: { userId: string }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [, setIsDownloadModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDocs, setSelectedDocs] = useState<Set<string>>(new Set());
  const itemsPerPage = 5;

  const { data: documentResponse } = userApiSlice.useGetPersonalDocumentsQuery(
    { personalGuid: userId || "" },
    { skip: !userId },
  );

  const documents = documentResponse?.documents || [];

  // Create a map of all required documents, including missing ones
  const allDocuments = useMemo(() => {
    const documentMap = new Map<DocumentType, PersonalDocument | null>();

    // Initialize with all required documents as null (missing)
    requiredDocuments.forEach((docType) => {
      documentMap.set(docType, null);
    });

    // Update with existing documents
    documents.forEach((doc) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      documentMap.set(doc.docType, doc);
    });

    return documentMap;
  }, [documents]);

  const filteredDocuments = useMemo(() => {
    return Array.from(allDocuments.entries()).filter(([docType, doc]) => {
      const name = documentTypeNames[docType]?.toLowerCase();
      const matchesSearch = name?.includes(searchQuery.toLowerCase());

      if (filter === "all") return matchesSearch;

      const status = doc ? "uploaded" : "pending";
      return matchesSearch && status === filter.toLowerCase();
    });
  }, [allDocuments, searchQuery, filter]);

  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(
    startIndex + itemsPerPage,
    filteredDocuments.length,
  );
  const currentDocuments = filteredDocuments.slice(startIndex, endIndex);

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

  const handleViewDocument = (doc: PersonalDocument) => {
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

  const handleDownloadDocument = async (doc: PersonalDocument) => {
    try {
      const filename = `${documentTypeNames[doc.docType]}.${doc.docPath.split(".").pop()}`;
      await downloadFile(doc.docPath, filename);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <div className={cn("space-y-6 py-6")}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium">Personal Documents</h2>
        </div>
        <div className="flex items-center gap-4">
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
                    {filter === "all"
                      ? "All Documents"
                      : filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuRadioGroup
                    value={filter}
                    onValueChange={setFilter}
                  >
                    <DropdownMenuRadioItem value="all">
                      All Documents
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="uploaded">
                      Uploaded
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
                <TableHead className="w-[50%] text-xs text-[#151F28]">
                  Document Name
                </TableHead>
                <TableHead className="w-[20%] text-xs text-[#151F28]">
                  Status
                </TableHead>
                <TableHead className="w-[20%] text-xs text-[#151F28]">
                  Status Remarks
                </TableHead>
                <TableHead className="w-[30%] text-xs text-[#151F28] text-right">
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
                          {documentTypeNames[docType]}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {doc && (
                      <Badge
                        variant="outline"
                        className={cn(
                          "rounded-md font-medium border-none",
                          getDocumentStatus(doc).style,
                        )}
                      >
                        {getDocumentStatus(doc).text}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{doc?.remarks || "--"}</TableCell>
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
                  Previous
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
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Download Button */}
      {selectedDocs.size > 0 && (
        <div className="fixed bottom-8 right-[40%] z-50">
          <Button
            onClick={() => setIsDownloadModalOpen(true)}
            className="shadow-lg flex items-center gap-2 bg-primary-green hover:bg-primary-green/90"
          >
            <Download className="h-4 w-4" />
            Download Selected ({selectedDocs.size})
          </Button>
        </div>
      )}
    </div>
  );
}

export default PersonalDocuments;
