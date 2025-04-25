"use client";

import { useState } from "react";
import EmptyState from "./_components/empty-state";
import Header from "./_components/header";

export default function LoanProductsPage() {
  const [, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // This will be replaced with actual data fetching
  const loanProducts = [];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Implement search functionality
  };

  const handleCreateClick = () => {
    setShowDropdown(!showDropdown);
  };
  return (
    <div className="container mx-auto p-6 bg-white min-h-[80svh] flex flex-col">
      <Header
        totalProducts={loanProducts.length}
        onSearch={handleSearch}
        onCreateClick={handleCreateClick}
      />

      {loanProducts.length === 0 ? (
        <EmptyState onCreateClick={handleCreateClick} />
      ) : (
        <div className="rounded-lg border">
          {/* Loan products table will be implemented here */}
          <div className="p-4">
            <p className="text-center text-gray-500">
              Loan products table will be displayed here
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
