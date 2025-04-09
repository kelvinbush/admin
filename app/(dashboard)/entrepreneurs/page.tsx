// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowDownTrayIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Progress } from "@/components/ui/progress";
import { Icons } from "@/components/icons";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/redux/hooks";
import { selectCurrentToken } from "@/lib/redux/features/authSlice";
import { useGetAllBusinessesQuery } from "@/lib/redux/services/user";
import { FileWarning } from "lucide-react";
import { calculateProfileVerification } from "../hooks/useProfileVerification";

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  bgColor: string;
  textColor?: string;
}

const StatCard = ({
  title,
  value,
  change,
  bgColor,
  textColor = "white",
}: StatCardProps) => {
  const isPositive = change >= 0;

  return (
    <Card
      className={`${bgColor} text-${textColor} shadow-md border-midnight-blue`}
    >
      <CardContent className="p-6">
        <h3 className="text-lg">{title}</h3>
        <div className="mt-2 items-baseline gap-2">
          <span className="text-2xl font-bold">{value}</span>
          <span
            className={`flex mt-2 items-center text-sm ${isPositive ? "text-primary-green" : "text-primary-red"}`}
          >
            {isPositive ? (
              <div
                className={cn(
                  "p-[3px] rounded-full bg-primary-red",
                  isPositive && "bg-primary-green",
                )}
              >
                <ArrowUpIcon className="h-3.5 w-3.5 text-black transform rotate-45" />
              </div>
            ) : (
              <div
                className={cn(
                  "p-[3px] rounded-full bg-primary-red",
                  isPositive && "bg-primary-green",
                )}
              >
                <ArrowDownIcon className="h-3.5 w-3.5 text-black rotate-[315deg]" />
              </div>
            )}
            <div className={"mx-1"}>{Math.abs(change)}%</div>
            <span className={"text-white text-xs"}> From last month</span>
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

const tabs = [
  { id: "all", label: "All SMEs" },
  { id: "complete", label: "Complete SME Profiles" },
  {
    id: "incomplete",
    label: "Incomplete SME Profiles",
  },
  { id: "verified", label: "Verified SME Profiles" },
  { id: "pending", label: "Profiles Pending Verification" },
];

const Page = () => {
  const guid = useAppSelector(selectCurrentToken);

  const {
    data: businesses,
    isLoading: isLoadingBusinesses,
    isError,
  } = useGetAllBusinessesQuery({ adminguid: guid || "" }, { skip: !guid });
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    affiliate: "all",
    sector: "all",
    verification: "all",
    progress: "all",
  });
  const [entrepreneurs, setEntrepreneurs] = useState<[]>([]);
  const router = useRouter();
  const itemsPerPage = 10;

  console.log(businesses);

  // Transform API data when businesses are available
  useEffect(() => {
    if (businesses && businesses.length > 0) {
      const transformedData = businesses.map((item, index) => {
        const { completionPercentage } = calculateProfileVerification(item);
        
        return {
          id: item.businessGuid || (index + 1).toString(),
          businessName: item.businessName,
          user: {
            name: `${item.personalProfile.firstName} ${item.personalProfile.lastName}`,
            email: item.personalProfile.email,
            phone: item.personalProfile.phoneNumber,
            image: item.personalProfile.profilePhoto || "", // Fallback image
          },
          affiliate: item.personalProfile.program || "Not specified",
          sector: item.sector,
          progress: completionPercentage,
          verificationStatus: "pending", // Set all to pending
          userId: item.personalGuid,
        };
      });

      setEntrepreneurs(transformedData);
    } else if (!isLoadingBusinesses && !isError) {
      // Reset entrepreneurs if no data and not loading/error
      setEntrepreneurs([]);
    }
  }, [businesses, isLoadingBusinesses, isError]);

  // Get unique values for filters from actual data
  const affiliates = [...new Set(entrepreneurs.map((item) => item.affiliate))];
  const sectors = [...new Set(entrepreneurs.map((item) => item.sector))];

  // Filter and search data
  const filteredData = entrepreneurs.filter((item) => {
    const matchesSearch =
      searchQuery === "" ||
      item.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.affiliate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sector.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAffiliate =
      filters.affiliate === "all" || item.affiliate === filters.affiliate;
    const matchesSector =
      filters.sector === "all" || item.sector.includes(filters.sector);
    const matchesProgress =
      filters.progress === "all" ||
      (filters.progress === "complete" && item.progress === 100) ||
      (filters.progress === "incomplete" && item.progress < 100);
    const matchesVerification =
      filters.verification === "all" ||
      item.verificationStatus === filters.verification;

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "complete" && item.progress === 100) ||
      (activeTab === "incomplete" && item.progress < 100) ||
      (activeTab === "verified" && item.verificationStatus === "verified") ||
      (activeTab === "pending" && item.verificationStatus === "pending");

    return (
      matchesSearch &&
      matchesAffiliate &&
      matchesSector &&
      matchesProgress &&
      matchesVerification &&
      matchesTab
    );
  });

  const sortedData = [...filteredData].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return b.id - a.id;
      case "oldest":
        return a.id - b.id;
      case "ascending":
        return a.businessName.localeCompare(b.businessName);
      case "descending":
        return b.businessName.localeCompare(a.businessName);
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy, filters, activeTab]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      affiliate: "all",
      sector: "all",
      verification: "all",
      progress: "all",
    });
    setSearchQuery("");
    setSortBy("");
    setCurrentPage(1);
  };

  // Calculate stats from actual data
  const totalBusinesses = entrepreneurs.length;
  const completeProfiles = entrepreneurs.filter(
    (item) => item.progress === 100,
  ).length;
  const incompleteProfiles = entrepreneurs.filter(
    (item) => item.progress < 100,
  ).length;
  const verifiedSMEs = entrepreneurs.filter(
    (item) => item.verificationStatus === "verified",
  ).length;
  const pendingVerification = entrepreneurs.filter(
    (item) => item.verificationStatus === "pending",
  ).length;

  const stats = [
    {
      title: "Registered SMEs",
      value: totalBusinesses.toString(),
      change: 10.7,
      bgColor: "bg-midnight-blue",
    },
    {
      title: "Complete Profiles",
      value: completeProfiles.toString(),
      change: -10.7,
      bgColor: "bg-midnight-blue",
    },
    {
      title: "Incomplete Profiles",
      value: incompleteProfiles.toString(),
      change: 10.7,
      bgColor: "bg-midnight-blue",
    },
    {
      title: "Verified SMEs",
      value: verifiedSMEs.toString(),
      change: -10.7,
      bgColor: "bg-midnight-blue",
    },
    {
      title: "Pending Verification",
      value: pendingVerification.toString(),
      change: 10.7,
      bgColor: "bg-midnight-blue",
    },
  ];

  return (
    <div className="p-4 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="flex flex-col space-y-4 bg-white shadow p-4 rounded">
        <div className="flex flex-wrap items-center gap-4">
          <h2 className="text-2xl font-medium mr-auto">
            Entrepreneurs ({totalBusinesses})
            {isLoadingBusinesses && (
              <span className="ml-2 text-sm font-normal text-gray-500">
                Loading...
              </span>
            )}
          </h2>
          <div className="relative min-w-[160px]">
            <Input
              type="text"
              placeholder="Search entrepreneur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-10"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <XMarkIcon className="h-5 w-5 text-gray-400" />
              </button>
            )}
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className={"w-max"}>
              <div className="flex items-center gap-2">Sort by</div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="ascending">A-Z</SelectItem>
              <SelectItem value="descending">Z-A</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="secondary"
            className="flex items-center gap-2 bg-[#E8E9EA]"
          >
            <FunnelIcon className="h-5 w-5" />
            Hide Filters
          </Button>

          <Button
            variant="secondary"
            className="flex items-center gap-2 bg-[#E8E9EA]"
          >
            <ArrowDownTrayIcon className="h-5 w-5" />
          </Button>

          <Button className="bg-midnight-blue text-white hover:bg-midnight-blue/90 flex items-center gap-2">
            <PlusIcon className="h-5 w-5" />
            New SME
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Select
            value={filters.affiliate}
            onValueChange={(value) => handleFilterChange("affiliate", value)}
          >
            <SelectTrigger className="w-[200px] bg-white">
              <SelectValue placeholder="AFFILIATE/PROGRAM" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Affiliates</SelectItem>
              {affiliates.map((affiliate) => (
                <SelectItem key={affiliate} value={affiliate}>
                  {affiliate}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.sector}
            onValueChange={(value) => handleFilterChange("sector", value)}
          >
            <SelectTrigger className="w-[200px] bg-white">
              <SelectValue placeholder="SECTOR" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sectors</SelectItem>
              {sectors.map((sector) => (
                <SelectItem key={sector} value={sector}>
                  {sector}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.verification}
            onValueChange={(value) => handleFilterChange("verification", value)}
          >
            <SelectTrigger className="w-[200px] bg-white">
              <SelectValue placeholder="VERIFICATION STATUS" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.progress}
            onValueChange={(value) => handleFilterChange("progress", value)}
          >
            <SelectTrigger className="w-[200px] bg-white">
              <SelectValue placeholder="B/S PROFILE PROGRESS" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Progress</SelectItem>
              <SelectItem value="complete">Complete</SelectItem>
              <SelectItem value="incomplete">Incomplete</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Button
              className="bg-[#00B67C] text-white hover:bg-[#00B67C]/90"
              onClick={handleApplyFilters}
            >
              APPLY
            </Button>
            {(filters.affiliate !== "all" ||
              filters.sector !== "all" ||
              filters.verification !== "all" ||
              filters.progress !== "all") && (
              <Button
                variant="outline"
                onClick={clearFilters}
                className="border-gray-300"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        <div className="border-b">
          <nav className="flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "py-4 px-1 border-b-2 font-medium text-sm",
                  activeTab === tab.id
                    ? "border-[#00B67C] text-[#00B67C]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Loading state */}
        {isLoadingBusinesses && (
          <div className="grid place-items-center h-40">
            <div className="flex flex-col items-center">
              <Icons.spinner className="h-8 w-8 animate-spin" />
              <p className="mt-2 text-gray-500">
                Loading entrepreneurs data...
              </p>
            </div>
          </div>
        )}

        {/* Error state */}
        {isError && (
          <div className="grid place-items-center h-40">
            <div className="flex flex-col items-center">
              <FileWarning className="h-8 w-8 text-red-500" />
              <p className="mt-2 text-gray-700">
                Error loading entrepreneurs data. Please try again later.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          </div>
        )}

        {/* No data from API */}
        {!isLoadingBusinesses &&
          !isError &&
          businesses &&
          businesses.length === 0 && (
            <div className="grid place-items-center h-40">
              <div className="flex flex-col items-center">
                <Icons.entreIcon />
                <p className="mt-2 text-gray-500">
                  No entrepreneurs found in the database.
                </p>
              </div>
            </div>
          )}

        {/* Show "No results found" message when there's no data after filtering */}
        {!isLoadingBusinesses &&
          !isError &&
          entrepreneurs.length > 0 &&
          paginatedData.length === 0 && (
            <div className={"grid place-items-center h-full py-16"}>
              <Icons.entreIcon />
              <div className="text-center py-8">
                No entrepreneur records found; try refining your search or
                adjusting your filters.
              </div>
            </div>
          )}

        {/* Table */}
        {!isLoadingBusinesses && !isError && paginatedData.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-[#E8E9EA] border-b border-b-[#B6BABC]">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium  uppercase tracking-wider">
                    Business Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium  uppercase tracking-wider">
                    Registered User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium  uppercase tracking-wider">
                    Affiliate/Program
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium  uppercase tracking-wider">
                    B/S Sector
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium  uppercase tracking-wider">
                    B/S Profile Progress
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                    Verification Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedData.map((item) => (
                  <tr
                    key={item.id}
                    className={
                      "hover:bg-[#E6FAF5] cursor-pointer transition duration-300"
                    }
                    onClick={() => router.push(`/entrepreneurs/${item.userId}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {item.businessName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={item.user.image}
                          alt={item.user.name}
                          className="h-8 w-8 rounded-full mr-3"
                        />
                        <div>
                          <div className="text-sm font-medium">
                            {item.user.name}
                          </div>
                          <div className="text-sm">
                            {item.user.email} | {item.user.phone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {item.affiliate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {item.sector}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative">
                        <div className="text-xs text-right mb-1 text-gray-600">
                          {item.progress}%
                        </div>
                        <Progress
                          value={item.progress}
                          className="w-24 bg-[#E8E9EA]"
                          indicatorClassName="bg-primary-green"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        variant="secondary"
                        className={cn(
                          "font-medium shadow-none hover:shadow-none",
                          item.verificationStatus === "verified"
                            ? "bg-[#B0EFDF] text-[#007054]"
                            : "bg-[#B1EFFE] text-[#1E429F]",
                        )}
                      >
                        {item.verificationStatus === "verified"
                          ? "Verified"
                          : "Pending verification"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!isLoadingBusinesses && !isError && paginatedData.length > 0 && (
          <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
            <div className="flex items-center text-sm text-gray-700">
              Showing 1 to {itemsPerPage} of {sortedData.length} results
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ),
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
