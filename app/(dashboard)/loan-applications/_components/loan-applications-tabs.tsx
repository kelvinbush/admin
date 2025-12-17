"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Table, LayoutGrid } from "lucide-react";
import type { ViewMode } from "./loan-applications-header";

export type LoanApplicationTab =
  | "all"
  | "approved"
  | "pending_approval"
  | "rejected"
  | "disbursed"
  | "cancelled";

type LoanApplicationsTabsProps = {
  activeTab: LoanApplicationTab;
  viewMode: ViewMode;
  onTabChange: (tab: LoanApplicationTab) => void;
  onViewModeChange: (mode: ViewMode) => void;
};

const tabs: Array<{ value: LoanApplicationTab; label: string }> = [
  { value: "all", label: "All" },
  { value: "approved", label: "Approved" },
  { value: "pending_approval", label: "Pending Approval" },
  { value: "rejected", label: "Rejected" },
  { value: "disbursed", label: "Disbursed" },
  { value: "cancelled", label: "Cancelled" },
];

export function LoanApplicationsTabs({
  activeTab,
  viewMode,
  onTabChange,
  onViewModeChange,
}: LoanApplicationsTabsProps) {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex gap-6 border-b border-primaryGrey-100 w-max pr-5">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            className={cn(
              "pb-3 text-sm font-medium transition-colors relative",
              activeTab === tab.value
                ? "text-midnight-blue"
                : "text-primaryGrey-400 hover:text-midnight-blue",
            )}
          >
            {tab.label}
            {activeTab === tab.value && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-green" />
            )}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          className={cn(
            "h-9 gap-2",
            viewMode === "table"
              ? "bg-midnight-blue text-white border-midnight-blue"
              : "border-primaryGrey-100 text-primaryGrey-500",
          )}
          onClick={() => onViewModeChange("table")}
        >
          <Table className="h-4 w-4" />
          <span>Table View</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "h-9 gap-2",
            viewMode === "board"
              ? "bg-midnight-blue text-white border-midnight-blue"
              : "border-primaryGrey-100 text-primaryGrey-500",
          )}
          onClick={() => onViewModeChange("board")}
        >
          <LayoutGrid className="h-4 w-4" />
          <span>Board View</span>
        </Button>
      </div>
    </div>
  );
}
