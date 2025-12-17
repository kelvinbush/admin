"use client";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type LoanApplicationStatus =
  | "kyc_kyb_verification"
  | "credit_analysis"
  | "head_of_credit_review"
  | "rejected"
  | "cancelled"
  | "approved"
  | "disbursed";

type LoanApplication = {
  id: string;
  loanId: string;
  loanSource: string;
  businessName: string;
  applicant: {
    name: string;
    email: string;
    phone: string;
    avatar?: string;
  };
  loanProduct: string;
  loanRequested: number;
  loanTenure: number;
  status: LoanApplicationStatus;
  createdAt: string;
  createdBy: string;
  lastUpdated: string;
};

type LoanApplicationsTableProps = {
  data?: LoanApplication[];
  isLoading?: boolean;
  onRowClick?: (application: LoanApplication) => void;
};

// Dummy data
const dummyData: LoanApplication[] = [
  {
    id: "1",
    loanId: "LN-48291",
    loanSource: "SME Platform",
    businessName: "DMA Limited",
    applicant: {
      name: "Robert Mugabe",
      email: "robert.mugabe@gmail.com",
      phone: "+255712345678",
    },
    loanProduct: "LPO Financing",
    loanRequested: 50000,
    loanTenure: 3,
    status: "kyc_kyb_verification",
    createdAt: "2025-01-28",
    createdBy: "Robert Mugabe",
    lastUpdated: "2025-01-28",
  },
  {
    id: "2",
    loanId: "LN-90357",
    loanSource: "Admin Platform",
    businessName: "Duhqa",
    applicant: {
      name: "Mariame Bamba",
      email: "mariame.bamba@gmail.com",
      phone: "+255712345679",
    },
    loanProduct: "Term Loan",
    loanRequested: 10000,
    loanTenure: 10,
    status: "rejected",
    createdAt: "2025-02-01",
    createdBy: "Mariame Bamba",
    lastUpdated: "2025-02-03",
  },
  {
    id: "3",
    loanId: "LN-12345",
    loanSource: "SME Platform",
    businessName: "Lineter Enterprise Ltd",
    applicant: {
      name: "John Doe",
      email: "john.doe@gmail.com",
      phone: "+255712345680",
    },
    loanProduct: "Invoice Discount Facility",
    loanRequested: 25000,
    loanTenure: 6,
    status: "credit_analysis",
    createdAt: "2025-01-15",
    createdBy: "John Doe",
    lastUpdated: "2025-01-20",
  },
  {
    id: "4",
    loanId: "LN-67890",
    loanSource: "Admin Platform",
    businessName: "Tech Solutions Inc",
    applicant: {
      name: "Jane Smith",
      email: "jane.smith@gmail.com",
      phone: "+255712345681",
    },
    loanProduct: "Asset Financing",
    loanRequested: 75000,
    loanTenure: 12,
    status: "approved",
    createdAt: "2025-01-10",
    createdBy: "Jane Smith",
    lastUpdated: "2025-01-25",
  },
  {
    id: "5",
    loanId: "LN-65938",
    loanSource: "SME Platform",
    businessName: "Green Energy Co",
    applicant: {
      name: "Cecile Soul",
      email: "cecile.soul@gmail.com",
      phone: "+255712345682",
    },
    loanProduct: "LPO Financing",
    loanRequested: 30000,
    loanTenure: 4,
    status: "head_of_credit_review",
    createdAt: "2025-01-05",
    createdBy: "Cecile Soul",
    lastUpdated: "2025-01-18",
  },
  {
    id: "6",
    loanId: "LN-24680",
    loanSource: "Admin Platform",
    businessName: "Food & Beverage Ltd",
    applicant: {
      name: "Michael Brown",
      email: "michael.brown@gmail.com",
      phone: "+255712345683",
    },
    loanProduct: "Term Loan",
    loanRequested: 15000,
    loanTenure: 8,
    status: "disbursed",
    createdAt: "2024-12-20",
    createdBy: "Michael Brown",
    lastUpdated: "2025-01-15",
  },
  {
    id: "7",
    loanId: "LN-13579",
    loanSource: "SME Platform",
    businessName: "Retail Solutions",
    applicant: {
      name: "Sarah Johnson",
      email: "sarah.johnson@gmail.com",
      phone: "+255712345684",
    },
    loanProduct: "Invoice Discount Facility",
    loanRequested: 20000,
    loanTenure: 5,
    status: "cancelled",
    createdAt: "2024-12-15",
    createdBy: "Sarah Johnson",
    lastUpdated: "2025-01-10",
  },
];

function getStatusBadge(status: LoanApplicationStatus) {
  switch (status) {
    case "kyc_kyb_verification":
    case "credit_analysis":
    case "head_of_credit_review":
      return {
        label:
          status === "kyc_kyb_verification"
            ? "KYC-KYB Verification"
            : status === "credit_analysis"
              ? "Credit Analysis"
              : "Head of Credit Review",
        className: "border-0",
        style: {
          backgroundColor: "#FFE5B0",
          color: "#8C5E00",
        },
      };
    case "rejected":
      return {
        label: "Rejected",
        className: "border-0",
        style: {
          backgroundColor: "#E9B7BD",
          color: "#650D17",
        },
      };
    case "cancelled":
      return {
        label: "Cancelled",
        className: "border-0",
        style: {
          backgroundColor: "#151F28",
          color: "#FFF",
        },
      };
    case "approved":
      return {
        label: "Approved",
        className: "border-0",
        style: {
          backgroundColor: "#B0EFDF",
          color: "#007054",
        },
      };
    case "disbursed":
      return {
        label: "Disbursed",
        className: "border-0",
        style: {
          backgroundColor: "#E1EFFE",
          color: "#1E429F",
        },
      };
    default:
      return {
        label: status,
        className: "border-0",
        style: {
          backgroundColor: "#E8E9EA",
          color: "#000",
        },
      };
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function getInitials(name: string): string {
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

export function LoanApplicationsTable({
  data = dummyData,
  isLoading = false,
  onRowClick,
}: LoanApplicationsTableProps) {
  const handleRowClick = (application: LoanApplication) => {
    if (onRowClick) {
      onRowClick(application);
    }
  };

  return (
    <div className="border border-primaryGrey-100 rounded-md overflow-hidden">
      <Table className="min-w-full">
        <TableHeader className="bg-[#E8E9EA]">
          <TableRow>
            <TableHead className="px-6 py-3 text-xs font-semibold text-primaryGrey-400">
              LOAN ID
            </TableHead>
            <TableHead className="px-6 py-3 text-xs font-semibold text-primaryGrey-400">
              LOAN SOURCE
            </TableHead>
            <TableHead className="px-6 py-3 text-xs font-semibold text-primaryGrey-400">
              BUSINESS NAME
            </TableHead>
            <TableHead className="px-6 py-3 text-xs font-semibold text-primaryGrey-400">
              LOAN APPLICANT
            </TableHead>
            <TableHead className="px-6 py-3 text-xs font-semibold text-primaryGrey-400">
              LOAN PRODUCT
            </TableHead>
            <TableHead className="px-6 py-3 text-xs font-semibold text-primaryGrey-400">
              LOAN REQUESTED
            </TableHead>
            <TableHead className="px-6 py-3 text-xs font-semibold text-primaryGrey-400">
              LOAN TENURE
            </TableHead>
            <TableHead className="px-6 py-3 text-xs font-semibold text-primaryGrey-400">
              LOAN STATUS
            </TableHead>
            <TableHead className="px-6 py-3 text-xs font-semibold text-primaryGrey-400">
              CREATED AT
            </TableHead>
            <TableHead className="px-6 py-3 text-xs font-semibold text-primaryGrey-400">
              CREATED BY
            </TableHead>
            <TableHead className="px-6 py-3 text-xs font-semibold text-primaryGrey-400">
              LAST UPDATED
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell colSpan={11} className="px-6 py-8 text-center">
                Loading loan applications...
              </TableCell>
            </TableRow>
          )}

          {!isLoading && data.length === 0 && (
            <TableRow>
              <TableCell colSpan={11} className="px-6 py-8 text-center">
                No loan applications found.
              </TableCell>
            </TableRow>
          )}

          {!isLoading &&
            data.map((application) => {
              const statusBadge = getStatusBadge(application.status);

              return (
                <TableRow
                  key={application.id}
                  className={cn(
                    "hover:bg-[#E6FAF5] cursor-pointer transition-colors",
                  )}
                  onClick={() => handleRowClick(application)}
                >
                  <TableCell className="px-6 py-4">
                    <div className="text-sm font-medium text-midnight-blue">
                      {application.loanId}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="text-sm text-primaryGrey-500">
                      {application.loanSource}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="text-sm font-medium text-midnight-blue">
                      {application.businessName}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={application.applicant.avatar}
                          alt={application.applicant.name}
                        />
                        <AvatarFallback className="bg-primaryGrey-100 text-midnight-blue">
                          {getInitials(application.applicant.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-midnight-blue">
                          {application.applicant.name}
                        </div>
                        <div className="text-xs text-primaryGrey-400">
                          {application.applicant.email}
                        </div>
                        <div className="text-xs text-primaryGrey-400">
                          {application.applicant.phone}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="text-sm text-primaryGrey-500">
                      {application.loanProduct}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="text-sm font-medium text-midnight-blue">
                      EUR {application.loanRequested.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="text-sm text-primaryGrey-500">
                      {application.loanTenure} months
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge
                      variant="outline"
                      className={cn(
                        "font-normal text-xs px-2.5 py-0.5",
                        statusBadge.className,
                      )}
                      style={statusBadge.style}
                    >
                      {statusBadge.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="text-sm text-primaryGrey-500">
                      {formatDate(application.createdAt)}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="text-sm text-primaryGrey-500">
                      {application.createdBy}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="text-sm text-primaryGrey-500">
                      {formatDate(application.lastUpdated)}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </div>
  );
}
