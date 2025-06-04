"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Icons } from "@/components/icons";

interface EmptyStateProps {
  onCreateClick: () => void;
}

export default function EmptyState({ onCreateClick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 flex-1 h-full">
      <Icons.noLoanProductIcon className="mb-6 h-44 w-auto" />
      <p className="mb-6 text-center text-gray-600">
        No user groups have been added yet!
      </p>
      <Button
        className="flex items-center gap-2 rounded-[4px] bg-gradient-to-r from-[#0C9] to-[#F0459C] text-white transition-all duration-300 hover:bg-gradient-to-l hover:from-[#F0459C] hover:to-[#0C9] hover:shadow-lg"
        size="lg"
        onClick={onCreateClick}
      >
        <span>New User Group</span>
        <Plus />
      </Button>
    </div>
  );
}
