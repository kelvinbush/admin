"use client";

import { cn } from "@/lib/utils";

export type EntrepreneurTab = "all" | "complete" | "incomplete" | "pending";

type EntrepreneursTabsProps = {
  activeTab: EntrepreneurTab;
  onTabChange: (tab: EntrepreneurTab) => void;
};

const tabs: Array<{ value: EntrepreneurTab; label: string }> = [
  { value: "all", label: "All SMEs" },
  { value: "complete", label: "Complete SME Profiles" },
  { value: "incomplete", label: "Incomplete SME Profiles" },
  { value: "pending", label: "Pending Activation" },
];

export function EntrepreneursTabs({
  activeTab,
  onTabChange,
}: EntrepreneursTabsProps) {
  return (
    <div className="flex gap-6 border-b border-primaryGrey-100 w-max pr-5">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onTabChange(tab.value)}
          className={cn(
            "pb-3 text-sm font-medium transition-colors relative",
            activeTab === tab.value
              ? "text-midnight-blue"
              : "text-primaryGrey-400 hover:text-midnight-blue"
          )}
        >
          {tab.label}
          {activeTab === tab.value && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-green" />
          )}
        </button>
      ))}
    </div>
  );
}

