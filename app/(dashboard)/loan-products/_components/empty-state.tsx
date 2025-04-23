import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Plus } from "lucide-react";

interface EmptyStateProps {
  onCreateClick?: () => void;
}

const EmptyState = ({ onCreateClick }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 flex-1">
      <Icons.noLoanProductIcon className="mb-6 h-44 w-auto" />
      <p className="mb-6 text-center text-gray-600">
        No loan products have been added yet!
      </p>
      <div className="flex flex-col gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="flex items-center gap-2 rounded-[4px] bg-gradient-to-r from-[#0C9] to-[#F0459C] text-white transition-all duration-300 hover:bg-gradient-to-l hover:from-[#F0459C] hover:to-[#0C9] hover:shadow-lg"
              size="lg"
            >
              <span>New Loan Product</span>
              <Plus />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-56">
            <DropdownMenuItem asChild>
              <Link
                href="/loan-productss/create?type=mk"
                className="flex w-full cursor-pointer"
              >
                MK Loan Product
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href="/loan-productss/create?type=partner"
                className="flex w-full cursor-pointer"
              >
                Partner Loan Product
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default EmptyState;
