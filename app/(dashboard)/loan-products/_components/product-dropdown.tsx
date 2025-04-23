import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface ProductDropdownProps {
  align?: "start" | "center" | "end";
}

const ProductDropdown = ({ align = "end" }: ProductDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="flex items-center gap-2">
          <span>New Loan Product</span>
          <Icons.plusIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-56">
        <DropdownMenuItem asChild>
          <Link href="/loan-productss/create?type=mk" className="flex w-full cursor-pointer">
            MK Loan Product
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/loan-productss/create?type=partner" className="flex w-full cursor-pointer">
            Partner Loan Product
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProductDropdown;
