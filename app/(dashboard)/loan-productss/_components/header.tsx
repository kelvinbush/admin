import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useState } from "react";
import { Plus } from "lucide-react";

interface HeaderProps {
  totalProducts: number;
  onSearch: (query: string) => void;
  onCreateClick: () => void;
}

const Header = ({ totalProducts, onSearch, onCreateClick }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    onSearch("");
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium">
          Loan Products ({totalProducts})
        </h1>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearch}
              className="h-9 w-56 pl-9 pr-9 text-sm"
            />
            <span className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400">
              🔍
            </span>
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <Icons.deleteIcon className="h-4 w-4 text-gray-400" />
              </button>
            )}
          </div>
          <Button
            variant="outline"
            className="h-9 flex items-center space-x-1 text-sm rounded font-medium"
          >
            <span>Sort by</span>
            <span className="h-3 w-3">▼</span>
          </Button>
          <Button
            variant="outline"
            className="h-9 flex items-center space-x-1 text-sm bg-[#E8E9EA] shadow-none border-none rounded"
          >
            <Icons.filter className="h-4 w-4 mr-1" />
            <span>Show Filters</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 bg-[#E8E9EA] shadow-none border-none rounded font-medium"
            aria-label="Download"
          >
            <Icons.download className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="flex h-9 items-center space-x-1 bg-black text-white hover:bg-black/90 rounded font-medium">
                <span>New Loan Product</span>
                <Plus />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
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
    </div>
  );
};

export default Header;
