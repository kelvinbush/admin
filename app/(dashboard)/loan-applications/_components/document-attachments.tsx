"use client";

import { useState, useMemo } from "react";
import { Search, X, ChevronLeft, ChevronRight, Check, X as XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Loader2 } from "lucide-react";
import { userApiSlice } from "@/lib/redux/services/user";
import { BusinessDocument } from "@/lib/types/user";

// EmptyState Component for when no documents are found
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
          No documents have been uploaded for this application.
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

export default function DocumentAttachments({ loanId }: { loanId: string }) {
  // Get the loan application data
  const { data: loanApplication, isLoading: isLoanLoading } = 
    userApiSlice.useGetLoanApplicationQuery(
      { guid: loanId },
      { skip: !loanId }
    );
  
  // State for active tab
  const [activeTab, setActiveTab] = useState("company");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedDocument, setSelectedDocument] = useState<BusinessDocument | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDocs, setSelectedDocs] = useState<Set<string>>(new Set());
  const itemsPerPage = 5;

  // Get business documents
  const { data: documentResponse, isLoading: isDocumentsLoading } = userApiSlice.useGetBusinessDocumentsQuery(
    { businessGuid: loanApplication?.businessProfile?.businessGuid || "" },
    { skip: !loanApplication?.businessProfile?.businessGuid }
  );

  const documents = documentResponse?.documents || [];
  
  // Get status badge styles
  const getStatusBadgeStyles = (status: string | undefined) => {
    switch (status?.toLowerCase()) {
      case "pending verification":
      case "pending":
        return "text-[#8C5E00] bg-[#FFE5B0] hover:text-[#8C5E00] hover:bg-[#FFE5B0]";
      case "verified":
        return "text-[#007054] bg-[#B0EFDF] hover:text-[#007054] hover:bg-[#B0EFDF]";
      case "rejected":
        return "text-[#650D17] bg-[#E9B7BD] hover:text-[#650D17] hover:bg-[#E9B7BD]";
      case "under review":
        return "text-[#1E429F] bg-[#E1EFFE] hover:text-[#1E429F] hover:bg-[#E1EFFE]";
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

  // List of document names by type
  const documentTypeNames: Record<number, string> = {
    0: "Business Registration",
    1: "Articles of Association",
    2: "Business Permit",
    3: "Tax Registration Certificate",
    4: "Annual Bank Statement",
    5: "Business Plan",
    6: "Certificate of Incorporation",
    7: "Pitch Deck",
    8: "Tax Clearance Document",
    9: "Partnership Deed",
    10: "Memorandum of Association",
    11: "Audited Financial Statement",
    12: "Balance Cash Flow Income Statement",
    13: "Audited Financial Statement (2024)",
    14: "Audited Financial Statement (2023)"
  };
  
  // Filter documents based on search and status
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const name = documentTypeNames[doc.docType]?.toLowerCase() || '';
      const matchesSearch = name.includes(searchQuery.toLowerCase());

      if (filterStatus === "all") return matchesSearch;

      const status = getDocumentStatus(doc).text.toLowerCase();
      return matchesSearch && status === filterStatus.toLowerCase();
    });
  }, [documents, searchQuery, filterStatus]);
  
  // Pagination
  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredDocuments.length);
  const currentDocuments = filteredDocuments.slice(startIndex, endIndex);
  
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };
  
  const handleViewDocument = (doc: BusinessDocument) => {
    setSelectedDocument(doc);
    window.open(doc.docPath, "_blank");
  };
  
  // Generate pagination numbers
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
  
  if (isLoanLoading || isDocumentsLoading) {
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
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Attachments</h1>
      
      {/* Search and Filter */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search document..." 
              className="pl-8 w-64" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              className="gap-2"
            >
              <span>Sort by</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="outline" 
              className="gap-2"
            >
              <span>Filter status</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
      {/* Tabs */}
      <div className="border-b flex space-x-6">
        <button
          className={cn(
            "pb-2 font-medium text-sm",
            activeTab === "personal" 
              ? "border-b-2 border-primary text-primary" 
              : "text-gray-600 hover:text-primary"
          )}
          onClick={() => setActiveTab("personal")}
        >
          Personal Documents
        </button>
        <button
          className={cn(
            "pb-2 font-medium text-sm",
            activeTab === "company" 
              ? "border-b-2 border-primary text-primary" 
              : "text-gray-600 hover:text-primary"
          )}
          onClick={() => setActiveTab("company")}
        >
          Company Documents
        </button>
        <button
          className={cn(
            "pb-2 font-medium text-sm",
            activeTab === "missing" 
              ? "border-b-2 border-primary text-primary" 
              : "text-gray-600 hover:text-primary"
          )}
          onClick={() => setActiveTab("missing")}
        >
          Missing Documents
        </button>
      </div>
      
      {/* Search and filter controls */}
      <div className="flex justify-between items-center gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            placeholder="Search documents"
            className="pl-9 bg-transparent border-gray-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Status:</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-9 px-3 flex items-center justify-between min-w-[120px]">
                {filterStatus === "all" ? "All" : 
                 filterStatus === "pending" ? "Pending" : 
                 filterStatus === "verified" ? "Verified" : 
                 filterStatus === "rejected" ? "Rejected" : "Unknown"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40">
              <DropdownMenuRadioGroup value={filterStatus} onValueChange={setFilterStatus}>
                <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="pending">Pending</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="verified">Verified</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="rejected">Rejected</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Empty states */}
      {(noDocuments || noFilteredResults) && (
        <EmptyState 
          hasDocuments={!noDocuments} 
          hasFilters={hasActiveFilters} 
          onReset={() => {
            setSearchQuery("");
            setFilterStatus("all");
          }} 
        />
      )}
      
      {/* Documents Table */}
      {!noDocuments && !noFilteredResults && (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                  <input 
                    type="checkbox"
                    className="h-4 w-4"
                    onChange={(e) => {
                      if (e.target.checked) {
                        const newSelected = new Set(selectedDocs);
                        currentDocuments.forEach(doc => newSelected.add(String(doc.id)));
                        setSelectedDocs(newSelected);
                      } else {
                        setSelectedDocs(new Set());
                      }
                    }}
                    checked={currentDocuments.length > 0 && selectedDocs.size === currentDocuments.length}
                  />
                </TableHead>
                <TableHead>Document Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Status Remarks</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentDocuments.map((doc) => {
                const docStatus = getDocumentStatus(doc);
                return (
                  <TableRow key={doc.id}>
                    <TableCell>
                      <input 
                        type="checkbox"
                        className="h-4 w-4"
                        checked={selectedDocs.has(String(doc.id))}
                        onChange={(e) => {
                          const newSelected = new Set(selectedDocs);
                          if (e.target.checked) {
                            newSelected.add(String(doc.id));
                          } else {
                            newSelected.delete(String(doc.id));
                          }
                          setSelectedDocs(newSelected);
                        }}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {documentTypeNames[doc.docType] || `Document Type ${doc.docType}`}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={docStatus.style}>
                        {docStatus.text}
                      </Badge>
                    </TableCell>
                    <TableCell>{doc.statusRemarks || '-'}</TableCell>
                    <TableCell>
                      {new Date(doc.createdDate).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          className="h-7 px-2 text-xs" 
                          variant="default"
                          onClick={() => handleViewDocument(doc)}
                        >
                          <Search className="h-3 w-3 mr-1" /> View
                        </Button>
                        {docStatus.text === "Pending" && (
                          <>
                            <Button className="h-7 px-2 text-xs" variant="outline">
                              <Check className="h-3 w-3 mr-1" /> Approve
                            </Button>
                            <Button className="h-7 px-2 text-xs" variant="outline">
                              <XIcon className="h-3 w-3 mr-1" /> Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          
          {/* Pagination */}
          {filteredDocuments.length > 0 && (
            <div className="flex justify-between items-center border-t p-4">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {endIndex} of {filteredDocuments.length} documents
              </div>
              <div className="flex items-center gap-1">
                <Button 
                  variant="outline" 
                  className="h-8 w-8 p-0"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {generatePaginationNumbers().map((page, index) => (
                  typeof page === 'string' ? (
                    <span key={`dots-${index}`} className="mx-1">...</span>
                  ) : (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      className={cn(
                        "h-8 w-8 p-0",
                        currentPage === page ? "bg-primary text-white" : "text-gray-600"
                      )}
                      onClick={() => handlePageChange(Number(page))}
                    >
                      {page}
                    </Button>
                  )
                ))}
                <Button 
                  variant="outline" 
                  className="h-8 w-8 p-0"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
        </div>
      </div>
    </div>
  );
}
