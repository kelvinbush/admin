"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface OrganizationsPaginationProps {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  onPageChange: (page: number) => void;
}

export function OrganizationsPagination({
  currentPage,
  totalPages,
  totalResults,
  onPageChange,
}: OrganizationsPaginationProps) {
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    // Always show page 1
    pages.push(
      <Button
        key={1}
        variant={currentPage === 1 ? "default" : "outline"}
        size="sm"
        onClick={() => handlePageChange(1)}
        className={currentPage === 1 ? "bg-blue-600 text-white" : ""}
      >
        1
      </Button>
    );

    // Calculate start and end page numbers
    let startPage = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 3);
    
    // Adjust start page if end page is maxed out
    if (endPage === totalPages - 1) {
      startPage = Math.max(2, endPage - maxVisiblePages + 3);
    }
    
    // Add ellipsis after page 1 if needed
    if (startPage > 2) {
      pages.push(<span key="ellipsis-1">...</span>);
    }
    
    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(i)}
          className={currentPage === i ? "bg-blue-600 text-white" : ""}
        >
          {i}
        </Button>
      );
    }
    
    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      pages.push(<span key="ellipsis-2">...</span>);
    }
    
    // Always show last page if there is more than one page
    if (totalPages > 1) {
      pages.push(
        <Button
          key={totalPages}
          variant={currentPage === totalPages ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(totalPages)}
          className={currentPage === totalPages ? "bg-blue-600 text-white" : ""}
        >
          {totalPages}
        </Button>
      );
    }
    
    return pages;
  };

  return (
    <div className="flex items-center justify-between py-4">
      <div className="text-sm text-gray-500">
        Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, totalResults)} of {totalResults} results
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {renderPageNumbers()}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
