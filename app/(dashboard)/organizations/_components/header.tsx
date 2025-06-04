import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  totalOrganizations: number;
  onSearch: (query: string) => void;
  onCreateClick: () => void;
}

const Header = ({
  totalOrganizations,
  onSearch,
  onCreateClick,
}: HeaderProps) => {
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
          Organizations ({totalOrganizations})
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
          <Button
            onClick={onCreateClick}
            className="flex h-9 items-center space-x-1 transition-all duration-300hover:shadow-lg rounded font-medium"
          >
            <span>New Organization</span>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Header;
