import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 flex-1">
      <Icons.noLoanProductIcon className="mb-6 h-44 w-auto" />
      <p className="mb-6 text-center text-gray-600">
        No loan fees have been added yet!
      </p>
      <div className="flex flex-col gap-2">
        <Button
          className="flex items-center gap-2 rounded-[4px] bg-gradient-to-r from-[#0C9] to-[#F0459C] text-white transition-all duration-300 hover:bg-gradient-to-l hover:from-[#F0459C] hover:to-[#0C9] hover:shadow-lg"
          size="lg"
          asChild
        >
          <Link href="/loan-fees/create">
            <span>New Loan Fee</span>
            <Plus />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default EmptyState;
