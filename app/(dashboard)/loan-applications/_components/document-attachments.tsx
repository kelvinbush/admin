"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Eye, Check, X, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { userApiSlice } from "@/lib/redux/services/user";

// Using our own enum and interface to match the API response
enum DocumentType {
  NationalIdFront = 0,
  NationalIdBack = 1,
  Passport = 2,
  TaxComplaintDocument = 3,
}

// Define our own PersonalDocument interface to match the component needs
interface PersonalDocument {
  id: number;
  docType: DocumentType;
  docPath: string;
  createdDate: string;
  modifiedDate: string | null;
  status?: string;
  remarks?: string;
}

// Document type mapping for display names
const documentTypeNames: Record<DocumentType, string> = {
  [DocumentType.NationalIdFront]: "National ID (Front)",
  [DocumentType.NationalIdBack]: "National ID (Back)",
  [DocumentType.Passport]: "Passport",
  [DocumentType.TaxComplaintDocument]: "Personal Tax Complaint Document",
};

// List of required documents
const requiredDocuments = [
  DocumentType.NationalIdFront,
  DocumentType.NationalIdBack,
  DocumentType.Passport,
  DocumentType.TaxComplaintDocument,
];

const DocumentAttachments = ({ loanId }: { loanId: string }) => {
  const [activeTab, setActiveTab] = useState<"personal" | "company" | "missing">("personal");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDocs, setSelectedDocs] = useState<Set<string>>(new Set());
  const itemsPerPage = 5;
  
  // Fetch personal documents using the API
  const { data: documentResponse } = userApiSlice.endpoints.getPersonalDocuments.useQuery(
    { personalGuid: loanId || "" },
    { skip: !loanId }
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
      documentMap.set(doc.docType, doc);
    });

    return documentMap;
  }, [documents]);

  // Filter documents based on active tab
  const filteredDocuments = useMemo(() => {
    const entries = Array.from(allDocuments.entries());
    
    switch (activeTab) {
      case "personal":
        // Show all personal documents
        return entries;
      case "company":
        // In a real implementation, this would filter for company documents
        // For now, we'll return an empty array as this is just for personal documents
        return [];
      case "missing":
        // Show only missing documents (where doc is null)
        return entries.filter(([_, doc]) => doc === null);
      default:
        return entries;
    }
  }, [allDocuments, activeTab]);

  // Pagination
  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredDocuments.length);
  const currentDocuments = filteredDocuments.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleViewDocument = (doc: PersonalDocument) => {
    window.open(doc.docPath, "_blank");
  };

  // Helper function to get status badge
  const getStatusBadge = (doc: PersonalDocument | null) => {
    if (!doc) {
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
          Pending
        </Badge>
      );
    }

    const status = doc.status?.toLowerCase();
    
    switch (status) {
      case "verified":
        return (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
            Verified
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200">
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            Under Review
          </Badge>
        );
    }
  };

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="border-b">
        <div className="flex">
          <button
            onClick={() => setActiveTab("personal")}
            className={cn(
              "px-4 py-2 text-sm font-medium",
              activeTab === "personal"
                ? "border-b-2 border-emerald-500 text-emerald-600"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            Personal Documents
          </button>
          <button
            onClick={() => setActiveTab("company")}
            className={cn(
              "px-4 py-2 text-sm font-medium",
              activeTab === "company"
                ? "border-b-2 border-emerald-500 text-emerald-600"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            Company Documents
          </button>
          <button
            onClick={() => setActiveTab("missing")}
            className={cn(
              "px-4 py-2 text-sm font-medium",
              activeTab === "missing"
                ? "border-b-2 border-emerald-500 text-emerald-600"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            Missing Documents
          </button>
        </div>
      </div>

      {/* Document List */}
      <div className="mt-4">
        <div className="rounded-md border">
          {/* Header */}
          <div className="grid grid-cols-12 bg-gray-50 p-4 text-sm font-medium text-gray-500">
            <div className="col-span-1"></div>
            <div className="col-span-3">DOCUMENT NAME</div>
            <div className="col-span-2">STATUS</div>
            <div className="col-span-3">STATUS REMARKS</div>
            <div className="col-span-3 text-right">ACTIONS</div>
          </div>

          {/* Document Items */}
          {currentDocuments.length > 0 ? (
            currentDocuments.map(([docType, doc]) => (
              <div key={docType} className="grid grid-cols-12 items-center border-t p-4">
                <div className="col-span-1">
                  <Checkbox 
                    id={`select-${docType}`} 
                    checked={selectedDocs.has(docType.toString())}
                    onCheckedChange={(checked) => {
                      const newSelected = new Set(selectedDocs);
                      if (checked) {
                        newSelected.add(docType.toString());
                      } else {
                        newSelected.delete(docType.toString());
                      }
                      setSelectedDocs(newSelected);
                    }}
                    disabled={!doc}
                  />
                </div>
                <div className="col-span-3 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium">{documentTypeNames[docType]}</div>
                    {doc && (
                      <div className="text-xs text-gray-500">
                        Uploaded {new Date(doc.createdDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-span-2">{getStatusBadge(doc)}</div>
                <div className="col-span-3 text-sm">{doc?.remarks || "-"}</div>
                <div className="col-span-3 flex justify-end gap-2">
                  {doc ? (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-1"
                        onClick={() => handleViewDocument(doc)}
                      >
                        <Eye className="h-4 w-4" /> View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-1 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                      >
                        <Check className="h-4 w-4" /> Approve
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-1 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                      >
                        <X className="h-4 w-4" /> Reject
                      </Button>
                    </>
                  ) : null}
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-500"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <h3 className="mb-1 text-lg font-medium">No documents found</h3>
              <p className="text-sm text-gray-500">
                {activeTab === "personal" && "No personal documents have been uploaded yet."}
                {activeTab === "company" && "No company documents have been uploaded yet."}
                {activeTab === "missing" && "There are no missing documents."}
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredDocuments.length)} of {filteredDocuments.length} results
          </div>
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </Button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button 
                  key={page}
                  variant="outline" 
                  size="sm" 
                  className={cn(
                    currentPage === page && "bg-emerald-50 text-emerald-600"
                  )}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              ))}
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentAttachments;