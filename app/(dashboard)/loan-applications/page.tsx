"use client";
import React, { useEffect, useMemo, useState } from "react";
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
import { useLoanApplications } from "@/lib/api/hooks/loan-applications";
import { useTitle } from "@/context/title-context";
import { formatCurrency, formatStatusText } from "@/lib/utils/currency";
import type {
  LoanApplicationsFilters,
  LoanApplicationStatus,
} from "@/lib/api/types";

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
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium opacity-90">{title}</p>
            <p className="text-3xl font-bold mt-2">{value}</p>
          </div>
        </div>
        <div className="mt-4 flex items-center">
          {isPositive ? (
            <ArrowUpIcon className="h-4 w-4 text-green-400" />
          ) : (
            <ArrowDownIcon className="h-4 w-4 text-red-400" />
          )}
          <span
            className={`ml-1 text-sm ${isPositive ? "text-green-400" : "text-red-400"}`}
          >
            {Math.abs(change)}%
          </span>
          <span className={"text-white text-xs ml-2"}> From last month</span>
        </div>
      </CardContent>
    </Card>
  );
};

const LoanApplicationsPage = () => {
  const router = useRouter();
  const { setTitle } = useTitle();

  // State for filters and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<LoanApplicationStatus | "all">(
    "all",
  );
  const [filters, setFilters] = useState<LoanApplicationsFilters>({
    page: 1,
    limit: 10,
  });

  // Build API filters based on UI state
  const apiFilters = useMemo(() => {
    const baseFilters: LoanApplicationsFilters = {
      ...filters,
      page: filters.page || 1,
      limit: filters.limit || 10,
    };

    // Add status filter based on active tab
    if (activeTab !== "all") {
      baseFilters.status = activeTab as LoanApplicationStatus;
    }

    return baseFilters;
  }, [filters, activeTab]);

  const {
    data: loanApplicationsResponse,
    error,
    isLoading,
  } = useLoanApplications(apiFilters);

  const loanApplications = loanApplicationsResponse?.data || [];
  const pagination = loanApplicationsResponse?.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  };

  // Set page title
  useEffect(() => {
    setTitle("Loan Applications");
  }, [setTitle]);

  // Get unique loan product names for filter dropdown
  const loanProductNames = useMemo(() => {
    if (!loanApplications.length) return [];
    return Array.from(
      new Set(
        loanApplications
          .map((app) => app.loanProduct?.name)
          .filter((name): name is string => Boolean(name)),
      ),
    );
  }, [loanApplications]);

  const getLoanStatusColor = (status: LoanApplicationStatus): string => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "submitted":
        return "bg-blue-100 text-blue-800";
      case "under_review":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "offer_letter_sent":
        return "bg-purple-100 text-purple-800";
      case "offer_letter_signed":
        return "bg-indigo-100 text-indigo-800";
      case "offer_letter_declined":
        return "bg-orange-100 text-orange-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "withdrawn":
        return "bg-gray-100 text-gray-800";
      case "disbursed":
        return "bg-emerald-100 text-emerald-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Handler functions
  const handleFilterChange = (
    key: keyof LoanApplicationsFilters,
    value: any,
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filters change
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    // TODO: Implement debounced search if needed
  };

  const handleTabChange = (tab: LoanApplicationStatus | "all") => {
    setActiveTab(tab);
    setFilters((prev) => ({ ...prev, page: 1 })); // Reset to first page
  };

  const clearFilters = () => {
    setFilters({ page: 1, limit: 10 });
    setSearchTerm("");
    setActiveTab("all");
  };

  const handleRowClick = (applicationId: string) => {
    router.push(`/loan-applications/${applicationId}`);
  };

  // Calculate stats from current data
  const stats = useMemo(() => {
    const total = pagination.total;
    const approved = loanApplications.filter(
      (app) => app.status === "approved",
    ).length;
    const rejected = loanApplications.filter(
      (app) => app.status === "rejected",
    ).length;
    const pending = loanApplications.filter((app) =>
      ["submitted", "under_review"].includes(app.status),
    ).length;

    return {
      total,
      approved,
      rejected,
      pending,
    };
  }, [loanApplications, pagination.total]);

  // Stat cards data based on the real data
  const statCards = [
    {
      title: "Total Applications",
      value: stats.total.toString(),
      change: 10.7, // TODO: Calculate actual change
      bgColor: "bg-midnight-blue",
    },
    {
      title: "Approved Loans",
      value: stats.approved.toString(),
      change: -0.7, // TODO: Calculate actual change
      bgColor: "bg-midnight-blue",
    },
    {
      title: "Rejected Loans",
      value: stats.rejected.toString(),
      change: 0.7, // TODO: Calculate actual change
      bgColor: "bg-midnight-blue",
    },
    {
      title: "Pending Loans",
      value: stats.pending.toString(),
      change: 1.7, // TODO: Calculate actual change
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

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">Failed to load loan applications</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Table Section */}
      <div className="flex flex-col space-y-4 bg-white shadow p-4 rounded">
        <div className="flex flex-wrap items-center gap-4">
          <h2 className="text-2xl font-medium mr-auto">
            Loans ({pagination.total})
          </h2>
          {/* Search Input */}
          <div className="relative min-w-[160px]">
            <Input
              type="text"
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-8 h-10"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            {searchTerm && (
              <button
                onClick={() => handleSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <XMarkIcon className="h-5 w-5 text-gray-400" />
              </button>
            )}
          </div>

          {/* Filter Button */}
          <Button
            variant="secondary"
            className="flex items-center gap-2 bg-[#E8E9EA]"
          >
            <FunnelIcon className="h-5 w-5" />
            Filters
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

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Loan Product Filter */}
          <Select
            value={filters.loanProductId || "all"}
            onValueChange={(value: string) =>
              handleFilterChange(
                "loanProductId",
                value === "all" ? undefined : value,
              )
            }
          >
            <SelectTrigger className="w-[200px] bg-white">
              <SelectValue placeholder="LOAN PRODUCT" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Products</SelectItem>
              {loanProductNames.map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Business Loan Filter */}
          <Select
            value={
              filters.isBusinessLoan === undefined
                ? "all"
                : filters.isBusinessLoan.toString()
            }
            onValueChange={(value: string) =>
              handleFilterChange(
                "isBusinessLoan",
                value === "all" ? undefined : value === "true",
              )
            }
          >
            <SelectTrigger className="w-[200px] bg-white">
              <SelectValue placeholder="LOAN TYPE" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="true">Business Loans</SelectItem>
              <SelectItem value="false">Personal Loans</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={clearFilters}
              className="border-gray-300"
            >
              Clear Filters
            </Button>
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
              {
                id: "under_review",
                label: "Under Review",
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() =>
                  handleTabChange(tab.id as LoanApplicationStatus | "all")
                }
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
        {loanApplications.length === 0 && (
          <div className={"grid place-items-center h-full py-16"}>
            <Icons.entreIcon />
            <div className="text-center py-8">
              No loan application records found; try refining your search or
              adjusting your filters.
            </div>
          </div>
        )}

        {/* Table */}
        {loanApplications.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-[#E8E9EA] border-b border-b-[#B6BABC]">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                    Application #
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                    Loan Product
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                    Loan Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                    Loan Term
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                    Submitted Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loanApplications.map((application) => (
                  <tr
                    key={application.id}
                    onClick={() => handleRowClick(application.id)}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {application.applicationNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {application.user?.firstName}{" "}
                        {application.user?.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {application.user?.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {application.loanProduct?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(
                        application.loanAmount,
                        application.currency || "USD",
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {application.loanTerm}{" "}
                      {application.loanProduct?.termUnit || "months"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLoanStatusColor(application.status)}`}
                      >
                        {formatStatusText(application.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {application.submittedAt
                        ? new Date(application.submittedAt).toLocaleDateString()
                        : "Not submitted"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-gray-200">
            <div className="flex items-center justify-between w-full">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {(pagination.page - 1) * pagination.limit + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total,
                    )}
                  </span>{" "}
                  of <span className="font-medium">{pagination.total}</span>{" "}
                  results
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-700">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanApplicationsPage;
