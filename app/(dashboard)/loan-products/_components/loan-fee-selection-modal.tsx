"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Link from "next/link";

// Dummy data for loan fees - replace with actual API call
const dummyLoanFees = [
  {
    id: "1",
    name: "Processing Fee",
    calculationMethod: "Rate",
    amount: 2.5,
    description: "2.5% of loan amount charged upfront",
  },
  {
    id: "2",
    name: "Late Payment Fee",
    calculationMethod: "Fixed Amount",
    amount: 25,
    description: "€25 charged for late payments",
  },
  {
    id: "3",
    name: "Origination Fee",
    calculationMethod: "Rate",
    amount: 1.5,
    description: "1.5% of loan amount charged upfront",
  },
  {
    id: "4",
    name: "Administration Fee",
    calculationMethod: "Fixed Amount Per Installment",
    amount: 5,
    description: "€5 per installment",
  },
];

export interface LoanFee {
  id: string;
  name: string;
  calculationMethod: string;
  amount: number;
  description: string;
}

interface LoanFeeSelectionModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (fee: LoanFee) => void;
}

export function LoanFeeSelectionModal({
  open,
  onClose,
  onSelect,
}: LoanFeeSelectionModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [loanFees, setLoanFees] = useState<LoanFee[]>(dummyLoanFees);

  // Filter loan fees based on search query
  const filteredFees = loanFees.filter(
    (fee) =>
      fee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fee.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // In a real implementation, you would fetch loan fees from an API
  // useEffect(() => {
  //   // Fetch loan fees from API
  //   // setLoanFees(data);
  // }, []);

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-medium">
            Select Loan Fee
          </DialogTitle>
          <DialogDescription className="text-primaryGrey-400 text-xl">
            Choose an existing loan fee or create a new one
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search bar */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <Input
              placeholder="Search loan fees..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Loan fees list */}
          <div className="max-h-[400px] overflow-y-auto border rounded-md">
            {filteredFees.length > 0 ? (
              <div className="divide-y">
                {filteredFees.map((fee) => (
                  <div
                    key={fee.id}
                    className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => {
                      onSelect(fee);
                      onClose();
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{fee.name}</h3>
                        <p className="text-sm text-gray-500">
                          {fee.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium">
                          {fee.calculationMethod === "Rate"
                            ? `${fee.amount}%`
                            : `€${fee.amount}`}
                        </span>
                        <p className="text-xs text-gray-500">
                          {fee.calculationMethod}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-500">
                  No loan fees found matching your search.
                </p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex justify-between items-center">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Link href="/loan-fees/create" target="_blank">
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
              Create New Loan Fee
            </Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
