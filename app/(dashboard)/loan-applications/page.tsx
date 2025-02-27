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

// Define interfaces for the backend data structure
interface BusinessProfile {
  businessName: string;
  businessDescription: string;
  typeOfIncorporation: string;
  sector: string;
  location: string;
  city: string;
  country: string;
  street1: string;
  street2: string;
  postalCode: string;
  currency: string;
  averageAnnualTurnover: number;
  averageMonthlyTurnover: number;
  previousLoans: boolean;
  loanAmount: number;
  defaultCurrency: string;
  recentLoanStatus: string;
  defaultReason: string;
  businessLogo: string;
  yearOfRegistration: string;
  isBeneficalOwner: boolean;
  personalGuid: string;
  businessGuid: string;
  personalProfile: PersonalProfile | null;
}

interface PersonalProfile {
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  phoneNumber: string;
  address: string;
  city: string;
  county: string;
  birthDate: string;
  guid: string;
  verifiedEmail: number;
  verifiedPhoneNumber: number;
  business: number;
  positionHeld: string;
  profilePhoto: string;
  identityDocType: string;
  identityDocNumber: string;
  taxIdNumber: string;
  program: string;
}

interface LoanApplication {
  loanApplicationGuid: string;
  loanProductName: string;
  loanAmount: number;
  defaultCurrency: string;
  repaymentPeriod: string;
  loanPurpose: string;
  interestRate: number;
  ecobankSubscription: boolean;
  loanStatus: number;
  businessGuid: string;
  personalGuid: string;
  businessProfile: BusinessProfile;
  personalProfile: PersonalProfile;
}

// Mock data for the loan applications table based on the backend structure
const tableData: LoanApplication[] = [
  {
    loanApplicationGuid: "c0ae1ea1-f144-465c-a6e2-c8f331756922",
    loanProductName: "Working Capital Financing",
    loanAmount: 5000.0,
    defaultCurrency: "USD",
    repaymentPeriod: "3 months",
    loanPurpose: "Cooling stuff",
    interestRate: 10.0,
    ecobankSubscription: true,
    loanStatus: 0, // Pending
    businessGuid: "3e8f9b45-db54-44e4-adb7-0e1dc42f938b",
    personalGuid: "59a9716b-c3a5-4b9d-b490-bf5df90cc02b",
    businessProfile: {
      businessName: "EcoTech",
      businessDescription: "Business description",
      typeOfIncorporation: "sole-proprietorship",
      sector: "technology",
      location: "kenya",
      city: "Nairobi",
      country: "kenya",
      street1: "Ngong ROad",
      street2: "",
      postalCode: "00100",
      currency: "UGX",
      averageAnnualTurnover: 202020.0,
      averageMonthlyTurnover: 10000.0,
      previousLoans: false,
      loanAmount: 0.0,
      defaultCurrency: "KES",
      recentLoanStatus: "NONE",
      defaultReason: "",
      businessLogo:
        "https://files.edgestore.dev/bqiq1ldogyqmeec4/publicFiles/_public/40ab6873-667e-4de2-9d71-61f6a2a6d779.jpg",
      yearOfRegistration: "2025",
      isBeneficalOwner: false,
      personalGuid: "59a9716b-c3a5-4b9d-b490-bf5df90cc02b",
      businessGuid: "3e8f9b45-db54-44e4-adb7-0e1dc42f938b",
      personalProfile: null,
    },
    personalProfile: {
      firstName: "Kelvin",
      lastName: "Wachiye",
      email: "kelybush@gmail.com",
      gender: "other",
      phoneNumber: "+254795778730",
      address: "",
      city: "",
      county: "",
      birthDate: "1999-08-20T00:00:00Z",
      guid: "59a9716b-c3a5-4b9d-b490-bf5df90cc02b",
      verifiedEmail: 1,
      verifiedPhoneNumber: 1,
      business: 0,
      positionHeld: "cofounder",
      profilePhoto:
        "https://files.edgestore.dev/bqiq1ldogyqmeec4/publicFiles/_public/9b20486a-81df-4c09-a521-ec63f320a0ce.jpg",
      identityDocType: "identity_card",
      identityDocNumber: "848487",
      taxIdNumber: "9484848",
      program: "",
    },
  },
  // Add more mock data with different statuses
  {
    loanApplicationGuid: "c0ae1ea1-f144-465c-a6e2-c8f331756923",
    loanProductName: "Working Capital Financing",
    loanAmount: 10000.0,
    defaultCurrency: "EUR",
    repaymentPeriod: "6 months",
    loanPurpose: "Inventory purchase",
    interestRate: 12.0,
    ecobankSubscription: true,
    loanStatus: 1, // Approved
    businessGuid: "3e8f9b45-db54-44e4-adb7-0e1dc42f938c",
    personalGuid: "59a9716b-c3a5-4b9d-b490-bf5df90cc02c",
    businessProfile: {
      businessName: "DMA Limited",
      businessDescription: "Business description",
      typeOfIncorporation: "limited-company",
      sector: "agriculture",
      location: "tanzania",
      city: "Dar es Salaam",
      country: "tanzania",
      street1: "Main Street",
      street2: "",
      postalCode: "00200",
      currency: "TZS",
      averageAnnualTurnover: 350000.0,
      averageMonthlyTurnover: 29000.0,
      previousLoans: false,
      loanAmount: 0.0,
      defaultCurrency: "TZS",
      recentLoanStatus: "NONE",
      defaultReason: "",
      businessLogo: "https://randomuser.me/api/portraits/men/1.jpg",
      yearOfRegistration: "2020",
      isBeneficalOwner: true,
      personalGuid: "59a9716b-c3a5-4b9d-b490-bf5df90cc02c",
      businessGuid: "3e8f9b45-db54-44e4-adb7-0e1dc42f938c",
      personalProfile: null,
    },
    personalProfile: {
      firstName: "Robert",
      lastName: "Mugabe",
      email: "robert.mugabe@gmail.com",
      gender: "male",
      phoneNumber: "+255712345678",
      address: "",
      city: "",
      county: "",
      birthDate: "1988-05-15T00:00:00Z",
      guid: "59a9716b-c3a5-4b9d-b490-bf5df90cc02c",
      verifiedEmail: 1,
      verifiedPhoneNumber: 1,
      business: 0,
      positionHeld: "ceo",
      profilePhoto: "https://randomuser.me/api/portraits/men/1.jpg",
      identityDocType: "passport",
      identityDocNumber: "AB123456",
      taxIdNumber: "123456789",
      program: "",
    },
  },
  {
    loanApplicationGuid: "c0ae1ea1-f144-465c-a6e2-c8f331756924",
    loanProductName: "Invoice Financing",
    loanAmount: 24000.0,
    defaultCurrency: "EUR",
    repaymentPeriod: "6 months",
    loanPurpose: "Operations",
    interestRate: 8.0,
    ecobankSubscription: false,
    loanStatus: 2, // Rejected
    businessGuid: "3e8f9b45-db54-44e4-adb7-0e1dc42f938d",
    personalGuid: "59a9716b-c3a5-4b9d-b490-bf5df90cc02d",
    businessProfile: {
      businessName: "Funke Science",
      businessDescription: "Business description",
      typeOfIncorporation: "limited-company",
      sector: "financial-services",
      location: "kenya",
      city: "Nairobi",
      country: "kenya",
      street1: "Financial Street",
      street2: "",
      postalCode: "00100",
      currency: "KES",
      averageAnnualTurnover: 500000.0,
      averageMonthlyTurnover: 42000.0,
      previousLoans: true,
      loanAmount: 15000.0,
      defaultCurrency: "KES",
      recentLoanStatus: "PAID",
      defaultReason: "",
      businessLogo: "https://randomuser.me/api/portraits/men/4.jpg",
      yearOfRegistration: "2019",
      isBeneficalOwner: false,
      personalGuid: "59a9716b-c3a5-4b9d-b490-bf5df90cc02d",
      businessGuid: "3e8f9b45-db54-44e4-adb7-0e1dc42f938d",
      personalProfile: null,
    },
    personalProfile: {
      firstName: "Shem",
      lastName: "Minjire",
      email: "shem.minjire@gmail.com",
      gender: "male",
      phoneNumber: "+254712445678",
      address: "",
      city: "",
      county: "",
      birthDate: "1991-02-20T00:00:00Z",
      guid: "59a9716b-c3a5-4b9d-b490-bf5df90cc02d",
      verifiedEmail: 1,
      verifiedPhoneNumber: 1,
      business: 0,
      positionHeld: "cfo",
      profilePhoto: "https://randomuser.me/api/portraits/men/4.jpg",
      identityDocType: "identity_card",
      identityDocNumber: "29384756",
      taxIdNumber: "938475612",
      program: "",
    },
  },
  {
    loanApplicationGuid: "c0ae1ea1-f144-465c-a6e2-c8f331756925",
    loanProductName: "Invoice Financing",
    loanAmount: 5000.0,
    defaultCurrency: "EUR",
    repaymentPeriod: "3 months",
    loanPurpose: "Expansion",
    interestRate: 9.5,
    ecobankSubscription: true,
    loanStatus: 3, // Disbursed
    businessGuid: "3e8f9b45-db54-44e4-adb7-0e1dc42f938e",
    personalGuid: "59a9716b-c3a5-4b9d-b490-bf5df90cc02e",
    businessProfile: {
      businessName: "Farm2Feed",
      businessDescription: "Business description",
      typeOfIncorporation: "limited-company",
      sector: "agriculture",
      location: "kenya",
      city: "Nakuru",
      country: "kenya",
      street1: "Farm Street",
      street2: "",
      postalCode: "20100",
      currency: "KES",
      averageAnnualTurnover: 120000.0,
      averageMonthlyTurnover: 10000.0,
      previousLoans: false,
      loanAmount: 0.0,
      defaultCurrency: "KES",
      recentLoanStatus: "NONE",
      defaultReason: "",
      businessLogo: "https://randomuser.me/api/portraits/women/6.jpg",
      yearOfRegistration: "2023",
      isBeneficalOwner: true,
      personalGuid: "59a9716b-c3a5-4b9d-b490-bf5df90cc02e",
      businessGuid: "3e8f9b45-db54-44e4-adb7-0e1dc42f938e",
      personalProfile: null,
    },
    personalProfile: {
      firstName: "Soraya",
      lastName: "Ngure",
      email: "soraya.ngure@gmail.com",
      gender: "female",
      phoneNumber: "+254712448878",
      address: "",
      city: "",
      county: "",
      birthDate: "1993-08-12T00:00:00Z",
      guid: "59a9716b-c3a5-4b9d-b490-bf5df90cc02e",
      verifiedEmail: 1,
      verifiedPhoneNumber: 1,
      business: 0,
      positionHeld: "ceo",
      profilePhoto: "https://randomuser.me/api/portraits/women/6.jpg",
      identityDocType: "identity_card",
      identityDocNumber: "29874563",
      taxIdNumber: "987654321",
      program: "",
    },
  },
];

// Define tabs
const tabs = [
  { id: "all", label: "All Applications" },
  { id: "approved", label: "Approved Loans" },
  { id: "rejected", label: "Rejected Loans" },
  { id: "disbursed", label: "Disbursed Loans" },
  { id: "pending", label: "Pending Loans" },
];

const LoanDetailsPage = () => {
  const guid = useAppSelector(selectCurrentToken);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    loanType: "all",
    ecobankInterest: "all",
    applicationDate: "all",
  });
  const router = useRouter();
  const itemsPerPage = 10;

  const { data: loanApplications, isLoading } = useGetLoanApplicationsQuery({
    adminguid: guid as string,
  });

  console.log(loanApplications);

  const loanTypes = [...new Set(tableData.map((item) => item.loanProductName))];

  const getLoanStatusText = (status: number): string => {
    switch (status) {
      case 0:
        return "pending";
      case 1:
        return "approved";
      case 2:
        return "rejected";
      case 3:
        return "disbursed";
      default:
        return "pending";
    }
  };

  const filteredData = tableData.filter((item) => {
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

    // Tab filtering
    const statusText = getLoanStatusText(item.loanStatus);
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "approved" && statusText === "approved") ||
      (activeTab === "rejected" && statusText === "rejected") ||
      (activeTab === "disbursed" && statusText === "disbursed") ||
      (activeTab === "pending" && statusText === "pending");

    return matchesSearch && matchesLoanType && matchesTab;
  });

  const sortedData = [...filteredData].sort((a, b) => {
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
      loanType: "all",
      ecobankInterest: "all",
      applicationDate: "all",
    });
    setSearchQuery("");
    setSortBy("");
    setCurrentPage(1);
  };

  const stats = [
    {
      title: "Total Applications",
      value: "30",
      change: 10.7,
      bgColor: "bg-midnight-blue",
    },
    {
      title: "Approved Loans",
      value: "10",
      change: -0.7,
      bgColor: "bg-midnight-blue",
    },
    {
      title: "Rejected Loans",
      value: "2",
      change: 0.7,
      bgColor: "bg-midnight-blue",
    },
    {
      title: "Disbursed Loans",
      value: "5",
      change: -0.7,
      bgColor: "bg-midnight-blue",
    },
    {
      title: "Pending Review",
      value: "13",
      change: 0.7,
      bgColor: "bg-midnight-blue",
    },
  ];

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
            onValueChange={(value) => handleFilterChange("loanType", value)}
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
            onValueChange={(value) =>
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
            onValueChange={(value) =>
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
                {paginatedData.map((item) => (
                  <tr
                    key={item.loanApplicationGuid}
                    className={
                      "hover:bg-[#E6FAF5] cursor-pointer transition duration-300"
                    }
                    onClick={() =>
                      router.push(
                        `/loan-applications/${item.loanApplicationGuid}?userId=${item.personalGuid}&businessId=${item.businessGuid}`,
                      )
                    }
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {item.businessProfile.businessName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={item.personalProfile.profilePhoto}
                          alt={`${item.personalProfile.firstName} ${item.personalProfile.lastName}`}
                          className="h-8 w-8 rounded-full mr-3"
                        />
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
                      <Badge
                        variant="secondary"
                        className={cn(
                          "font-medium shadow-none hover:shadow-none",
                          item.loanStatus === 1
                            ? "bg-[#B0EFDF] text-[#007054]"
                            : item.loanStatus === 2
                              ? "bg-[#FECACA] text-[#B91C1C]"
                              : item.loanStatus === 3
                                ? "bg-[#DBEAFE] text-[#1E40AF]"
                                : "bg-[#B1EFFE] text-[#1E429F]",
                        )}
                      >
                        {item.loanStatus === 1
                          ? "Approved"
                          : item.loanStatus === 2
                            ? "Rejected"
                            : item.loanStatus === 3
                              ? "Disbursed"
                              : "Pending"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
          <div className="flex items-center text-sm text-gray-700">
            Showing 1 to {paginatedData.length} of {filteredData.length} results
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
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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

export default LoanDetailsPage;
