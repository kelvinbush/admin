"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Icons } from "@/components/icons";
import { useRouter } from "next/navigation";
import {
  ArrowDownTrayIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useGetLoanApplicationsQuery } from "@/lib/redux/services/user";
import { selectCurrentToken } from "@/lib/redux/features/authSlice";
import { useAppSelector } from "@/lib/redux/hooks";
import { LoanApplication } from "@/lib/types/user";

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

interface FiltersState {
  loanType: string;
  ecobankInterest: string;
  applicationDate: string;
}

const LoanApplicationsPage = () => {
  const guid = useAppSelector(selectCurrentToken);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FiltersState>({
    loanType: "all",
    ecobankInterest: "all",
    applicationDate: "all",
  });
  const router = useRouter();
  const itemsPerPage = 10;

  const { data: loanApplicationsResponse, isLoading } =
    useGetLoanApplicationsQuery({
      adminguid: guid as string,
    });

  const realData = loanApplicationsResponse || [];

  const loanTypes = [
    ...new Set(realData.map((item: LoanApplication) => item.loanProductName)),
  ];

  const getLoanStatusText = (status: number): string => {
    switch (status) {
      case 0:
        return "applied";
      case 1:
        return "review";
      case 2:
        return "approved";
      case 3:
        return "rejected";
      default:
        return "pending";
    }
  };

  const getLoanStatusBadgeColor = (status: number): string => {
    switch (status) {
      case 2:
        return "bg-[#B0EFDF] text-[#007054]";
      case 1:
        return "bg-[#FECACA] text-[#B91C1C]";
      case 3:
        return "bg-[#DBEAFE] text-[#1E40AF]";
      case 0:
        return "bg-[#B1EFFE] text-[#1E429F]";
      default:
        return "bg-[#B1EFFE] text-[#1E429F]";
    }
  };

  // Filter and search data using real data
  const filteredData = realData.filter((item: LoanApplication) => {
    const matchesSearch =
      searchQuery === "" ||
      item.businessProfile.businessName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      `${item.personalProfile.firstName} ${item.personalProfile.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      item.personalProfile.email
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      item.loanProductName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLoanType =
      filters.loanType === "all" || item.loanProductName === filters.loanType;

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "approved" && item.loanStatus === 2) ||
      (activeTab === "rejected" && item.loanStatus === 3) ||
      (activeTab === "pending" && item.loanStatus === 0) ||
      (activeTab === "review" && item.loanStatus === 1);

    return matchesSearch && matchesLoanType && matchesTab;
  });

  const sortedData = [...filteredData].sort(
    (a: LoanApplication, b: LoanApplication) => {
      switch (sortBy) {
        case "newest":
          return b.loanApplicationGuid.localeCompare(a.loanApplicationGuid);
        case "oldest":
          return a.loanApplicationGuid.localeCompare(b.loanApplicationGuid);
        case "ascending":
          return a.businessProfile.businessName.localeCompare(
            b.businessProfile.businessName,
          );
        case "descending":
          return b.businessProfile.businessName.localeCompare(
            a.businessProfile.businessName,
          );
        default:
          return 0;
      }
    },
  );

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
      loanType: "all",
      ecobankInterest: "all",
      applicationDate: "all",
    });
    setSearchQuery("");
    setSortBy("");
    setCurrentPage(1);
  };

  // Stat cards data based on the real data
  const stats = [
    {
      title: "Total Applications",
      value: realData.length.toString(),
      change: 10.7,
      bgColor: "bg-midnight-blue",
    },
    {
      title: "Approved Loans",
      value: realData
        .filter((item: LoanApplication) => item.loanStatus === 2)
        .length.toString(),
      change: -0.7,
      bgColor: "bg-midnight-blue",
    },
    {
      title: "Rejected Loans",
      value: realData
        .filter((item: LoanApplication) => item.loanStatus === 3)
        .length.toString(),
      change: 0.7,
      bgColor: "bg-midnight-blue",
    },
    {
      title: "Disbursed Loans",
      value: realData
        .filter((item: LoanApplication) => item.loanStatus === 4)
        .length.toString(),
      change: -0.7,
      bgColor: "bg-midnight-blue",
    },
    {
      title: "Pending Review",
      value: realData
        .filter(
          (item: LoanApplication) =>
            item.loanStatus === 0 || item.loanStatus === 1,
        )
        .length.toString(),
      change: 0.7,
      bgColor: "bg-midnight-blue",
    },
  ];

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="mb-4 text-2xl font-bold text-gray-900">
          Loan Applications
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, index) => (
            <Card key={index} className="bg-midnight-blue animate-pulse">
              <CardContent className="p-4 h-[100px]"></CardContent>
            </Card>
          ))}
        </div>
        <div className="bg-white rounded-lg shadow p-4 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Table Section */}
      <div className="flex flex-col space-y-4 bg-white shadow p-4 rounded">
        <div className="flex flex-wrap items-center gap-4">
          <h2 className="text-2xl font-medium mr-auto">Loans (30)</h2>
          {/* Search Input */}
          <div className="relative min-w-[160px]">
            <Input
              type="text"
              placeholder="Search loan..."
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

          {/* Sort Dropdown */}
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

          {/* Hide Filters Button */}
          <Button
            variant="secondary"
            className="flex items-center gap-2 bg-[#E8E9EA]"
          >
            <FunnelIcon className="h-5 w-5" />
            Hide Filters
          </Button>

          {/* Download Button */}
          <Button
            variant="secondary"
            className="flex items-center gap-2 bg-[#E8E9EA]"
          >
            <ArrowDownTrayIcon className="h-5 w-5" />
          </Button>

          {/* New Application Button */}
          <Button className="bg-midnight-blue text-white hover:bg-midnight-blue/90 flex items-center gap-2">
            <PlusIcon className="h-5 w-5" />
            New Application
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Loan Type Filter */}
          <Select
            value={filters.loanType}
            onValueChange={(value: string) =>
              handleFilterChange("loanType", value)
            }
          >
            <SelectTrigger className="w-[200px] bg-white">
              <SelectValue placeholder="LOAN TYPE" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Loan Types</SelectItem>
              {loanTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select
            value={filters.ecobankInterest}
            onValueChange={(value: string) =>
              handleFilterChange("ecobankInterest", value)
            }
          >
            <SelectTrigger className="w-[200px] bg-white">
              <SelectValue placeholder="ECOBANK INTEREST" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>

          {/* Application Date Filter */}
          <Select
            value={filters.applicationDate}
            onValueChange={(value: string) =>
              handleFilterChange("applicationDate", value)
            }
          >
            <SelectTrigger className="w-[200px] bg-white">
              <SelectValue placeholder="APPLICATION DATE" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Dates</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="thisWeek">This Week</SelectItem>
              <SelectItem value="thisMonth">This Month</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Button
              className="bg-[#00B67C] text-white hover:bg-[#00B67C]/90"
              onClick={handleApplyFilters}
            >
              APPLY
            </Button>
            {(filters.loanType !== "all" ||
              filters.ecobankInterest !== "all" ||
              filters.applicationDate !== "all") && (
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

        {/* Tabs */}
        <div className="border-b">
          <nav className="flex space-x-8" aria-label="Tabs">
            {[
              { id: "all", label: "All Applications" },
              { id: "approved", label: "Approved Loans" },
              {
                id: "rejected",
                label: "Rejected Loans",
              },
              { id: "disbursed", label: "Disbursed Loans" },
              { id: "pending", label: "Pending Loans" },
            ].map((tab) => (
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

        {/* Show "No results found" message when there's no data */}
        {paginatedData.length === 0 && (
          <div className={"grid place-items-center h-full py-16"}>
            <Icons.entreIcon />
            <div className="text-center py-8">
              No loan application records found; try refining your search or
              adjusting your filters.
            </div>
          </div>
        )}

        {/* Table */}
        {paginatedData.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-[#E8E9EA] border-b border-b-[#B6BABC]">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                    Business Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                    Loan Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                    Loan Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                    Loan Tenure
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                    Loan Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedData.map((item: LoanApplication) => (
                  <tr
                    key={item.loanApplicationGuid}
                    className={
                      "hover:bg-[#E6FAF5] cursor-pointer transition duration-300"
                    }
                    onClick={() =>
                      router.push(
                        `/loan-applications/${item.loanApplicationGuid}?userId=${item.personalGuid}`,
                      )
                    }
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {item.businessProfile.businessName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className="h-8 w-8 rounded-full mr-3 bg-gray-200 flex items-center justify-center text-gray-600"
                        >
                          {item.personalProfile.firstName.charAt(0)}
                          {item.personalProfile.lastName.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-medium">
                            {item.personalProfile.firstName}{" "}
                            {item.personalProfile.lastName}
                          </div>
                          <div className="text-sm">
                            {item.personalProfile.email} |{" "}
                            {item.personalProfile.phoneNumber}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {item.loanProductName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {item.defaultCurrency}{" "}
                      {item.loanAmount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {item.repaymentPeriod}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLoanStatusBadgeColor(item.loanStatus)}`}
                        >
                          {getLoanStatusText(item.loanStatus)}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-700">
            Showing{" "}
            <span className="font-medium">
              {(currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(currentPage * itemsPerPage, filteredData.length)}
            </span>{" "}
            of <span className="font-medium">{filteredData.length}</span>{" "}
            results
          </div>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanApplicationsPage;
