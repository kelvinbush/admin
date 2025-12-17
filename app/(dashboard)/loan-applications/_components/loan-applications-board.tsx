"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

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
  entrepreneurId: string;
  businessId: string;
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

type LoanApplicationsBoardProps = {
  data?: LoanApplication[];
  isLoading?: boolean;
  onCardClick?: (application: LoanApplication) => void;
};

// Dummy data - expanded to match the board view requirements
const dummyData: LoanApplication[] = [
  // KYC-KYB Verification (2 items)
  {
    id: "1",
    loanId: "LN-48291",
    loanSource: "SME Platform",
    businessName: "DMA Solutions Limited",
    entrepreneurId: "ent-001",
    businessId: "biz-001",
    applicant: {
      name: "Robert Mugabe",
      email: "robert.mugabe@dma.com",
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
    id: "8",
    loanId: "LN-11111",
    loanSource: "Admin Platform",
    businessName: "Agribora Ventures Limited",
    entrepreneurId: "ent-008",
    businessId: "biz-008",
    applicant: {
      name: "Alice Johnson",
      email: "alice.johnson@agribora.com",
      phone: "+255712345689",
    },
    loanProduct: "Term Loan",
    loanRequested: 35000,
    loanTenure: 6,
    status: "kyc_kyb_verification",
    createdAt: "2025-01-25",
    createdBy: "Alice Johnson",
    lastUpdated: "2025-01-27",
  },
  // Credit Assessment (3 items)
  {
    id: "2",
    loanId: "LN-90357",
    loanSource: "Admin Platform",
    businessName: "Duhqa Limited",
    entrepreneurId: "ent-002",
    businessId: "biz-002",
    applicant: {
      name: "Mariame Bamba",
      email: "mariame.bamba@duhqa.com",
      phone: "+255712345679",
    },
    loanProduct: "Term Loan",
    loanRequested: 10000,
    loanTenure: 10,
    status: "credit_analysis",
    createdAt: "2025-02-01",
    createdBy: "Mariame Bamba",
    lastUpdated: "2025-02-03",
  },
  {
    id: "3",
    loanId: "LN-12345",
    loanSource: "SME Platform",
    businessName: "Kokari Ventures Limited",
    entrepreneurId: "ent-003",
    businessId: "biz-003",
    applicant: {
      name: "John Doe",
      email: "john.doe@kokari.com",
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
    id: "9",
    loanId: "LN-22222",
    loanSource: "SME Platform",
    businessName: "TechStart Innovations",
    entrepreneurId: "ent-009",
    businessId: "biz-009",
    applicant: {
      name: "David Kim",
      email: "david.kim@techstart.com",
      phone: "+255712345690",
    },
    loanProduct: "Asset Financing",
    loanRequested: 45000,
    loanTenure: 8,
    status: "credit_analysis",
    createdAt: "2025-01-20",
    createdBy: "David Kim",
    lastUpdated: "2025-01-22",
  },
  // Head of Credit Review (2 items)
  {
    id: "5",
    loanId: "LN-65938",
    loanSource: "SME Platform",
    businessName: "EcoBuild Solutions",
    entrepreneurId: "ent-005",
    businessId: "biz-005",
    applicant: {
      name: "Cecile Soul",
      email: "cecile.soul@ecobuild.com",
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
    id: "10",
    loanId: "LN-33333",
    loanSource: "Admin Platform",
    businessName: "GreenFuture Enterprises",
    entrepreneurId: "ent-010",
    businessId: "biz-010",
    applicant: {
      name: "Emma Wilson",
      email: "emma.wilson@greenfuture.com",
      phone: "+255712345691",
    },
    loanProduct: "Term Loan",
    loanRequested: 40000,
    loanTenure: 12,
    status: "head_of_credit_review",
    createdAt: "2025-01-10",
    createdBy: "Emma Wilson",
    lastUpdated: "2025-01-15",
  },
  {
    id: "11",
    loanId: "LN-44444",
    loanSource: "SME Platform",
    businessName: "Agribora Ventures Limited",
    entrepreneurId: "ent-011",
    businessId: "biz-011",
    applicant: {
      name: "Michael Brown",
      email: "michael.brown@agribora.com",
      phone: "+255712345692",
    },
    loanProduct: "Invoice Discount Facility",
    loanRequested: 28000,
    loanTenure: 5,
    status: "approved",
    createdAt: "2025-01-12",
    createdBy: "Michael Brown",
    lastUpdated: "2025-01-25",
  },
  {
    id: "4",
    loanId: "LN-67890",
    loanSource: "Admin Platform",
    businessName: "TechSphere Innovations",
    entrepreneurId: "ent-004",
    businessId: "biz-004",
    applicant: {
      name: "Jane Smith",
      email: "jane.smith@techsphere.com",
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
  // Rejected (1 item)
  {
    id: "12",
    loanId: "LN-55555",
    loanSource: "SME Platform",
    businessName: "GreenFuture Enterprises",
    entrepreneurId: "ent-012",
    businessId: "biz-012",
    applicant: {
      name: "Sarah Johnson",
      email: "sarah.johnson@greenfuture.com",
      phone: "+255712345693",
    },
    loanProduct: "Term Loan",
    loanRequested: 15000,
    loanTenure: 6,
    status: "rejected",
    createdAt: "2025-01-08",
    createdBy: "Sarah Johnson",
    lastUpdated: "2025-01-12",
  },
  // Disbursed (3 items)
  {
    id: "6",
    loanId: "LN-24680",
    loanSource: "Admin Platform",
    businessName: "Duhqa Limited",
    entrepreneurId: "ent-006",
    businessId: "biz-006",
    applicant: {
      name: "Peter Anderson",
      email: "peter.anderson@duhqa.com",
      phone: "+255712345683",
    },
    loanProduct: "Term Loan",
    loanRequested: 15000,
    loanTenure: 8,
    status: "disbursed",
    createdAt: "2024-12-20",
    createdBy: "Peter Anderson",
    lastUpdated: "2025-01-15",
  },
  {
    id: "13",
    loanId: "LN-66666",
    loanSource: "SME Platform",
    businessName: "Kokari Ventures Limited",
    entrepreneurId: "ent-013",
    businessId: "biz-013",
    applicant: {
      name: "Lisa Chen",
      email: "lisa.chen@kokari.com",
      phone: "+255712345694",
    },
    loanProduct: "LPO Financing",
    loanRequested: 32000,
    loanTenure: 4,
    status: "disbursed",
    createdAt: "2024-12-18",
    createdBy: "Lisa Chen",
    lastUpdated: "2025-01-10",
  },
  {
    id: "14",
    loanId: "LN-77777",
    loanSource: "Admin Platform",
    businessName: "InnovateHub Solutions",
    entrepreneurId: "ent-014",
    businessId: "biz-014",
    applicant: {
      name: "James Taylor",
      email: "james.taylor@innovatehub.com",
      phone: "+255712345695",
    },
    loanProduct: "Asset Financing",
    loanRequested: 60000,
    loanTenure: 10,
    status: "disbursed",
    createdAt: "2024-12-15",
    createdBy: "James Taylor",
    lastUpdated: "2025-01-05",
  },
  // Cancelled (1 item)
  {
    id: "7",
    loanId: "LN-13579",
    loanSource: "SME Platform",
    businessName: "GreenFuture Enterprises",
    entrepreneurId: "ent-007",
    businessId: "biz-007",
    applicant: {
      name: "Olivia Martinez",
      email: "olivia.martinez@greenfuture.com",
      phone: "+255712345684",
    },
    loanProduct: "Invoice Discount Facility",
    loanRequested: 20000,
    loanTenure: 5,
    status: "cancelled",
    createdAt: "2024-12-15",
    createdBy: "Olivia Martinez",
    lastUpdated: "2025-01-10",
  },
];

type ColumnConfig = {
  status: LoanApplicationStatus;
  label: string;
  bgColor: string;
  textColor: string;
};

const columns: ColumnConfig[] = [
  {
    status: "kyc_kyb_verification",
    label: "KYC-KYB Verification",
    bgColor: "#FFE5B0", // Light yellow/orange
    textColor: "#8C5E00", // Dark warm brown
  },
  {
    status: "credit_analysis",
    label: "Credit Assessment",
    bgColor: "#FFE5B0", // Light yellow/orange
    textColor: "#8C5E00", // Dark warm brown
  },
  {
    status: "head_of_credit_review",
    label: "Head of Credit Review",
    bgColor: "#FFE5B0", // Light yellow/orange
    textColor: "#8C5E00", // Dark warm brown
  },
  {
    status: "approved",
    label: "Approved",
    bgColor: "#B0EFDF", // Light green
    textColor: "#007054", // Dark green
  },
  {
    status: "rejected",
    label: "Rejected",
    bgColor: "#E9B7BD", // Light pink
    textColor: "#650D17", // Dark red
  },
  {
    status: "disbursed",
    label: "Disbursed",
    bgColor: "#E1EFFE", // Light blue
    textColor: "#1E429F", // Dark blue
  },
  {
    status: "cancelled",
    label: "Cancelled",
    bgColor: "#151F28", // Dark grey
    textColor: "#FFF", // White
  },
];

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month} ${day} ${year}`;
}

function getInitials(name: string): string {
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

type ApplicationCardProps = {
  application: LoanApplication;
  onCardClick?: (application: LoanApplication) => void;
};

function ApplicationCard({ application, onCardClick }: ApplicationCardProps) {
  return (
    <div
      className="bg-white rounded-md shadow-sm p-4 mb-3 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onCardClick?.(application)}
    >
      {/* Company Name and Loan ID Section */}
      <div className="mb-4">
        <h3 className="text-base font-medium mb-1 text-primary-green">
          {application.businessName}
        </h3>
        <p className="text-sm text-primary-green">
          LOAN ID: {application.loanId}
        </p>
      </div>

      {/* Applicant Information Section */}
      <div className="flex items-start gap-3 mb-4">
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarImage
            src={application.applicant.avatar}
            alt={application.applicant.name}
          />
          <AvatarFallback className="bg-primaryGrey-100 text-midnight-blue text-xs">
            {getInitials(application.applicant.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium mb-1 text-midnight-blue">
            {application.applicant.name}
          </p>
          <p className="text-xs text-primaryGrey-500">
            {application.applicant.email} | {application.applicant.phone}
          </p>
        </div>
      </div>

      {/* Horizontal Separator */}
      <div className="border-t border-primaryGrey-200 mb-4" />

      {/* Loan Details Section */}
      <div className="space-y-2.5 text-sm">
        <div>
          <span className="font-medium text-midnight-blue">
            Loan Source:
          </span>{" "}
          <span className="text-midnight-blue">
            {application.loanSource}
          </span>
        </div>
        <div>
          <span className="font-medium text-midnight-blue">
            Loan Product:
          </span>{" "}
          <span className="text-midnight-blue">
            {application.loanProduct}
          </span>
        </div>
        <div>
          <span className="font-medium text-midnight-blue">
            Loan Requested:
          </span>{" "}
          <span className="text-midnight-blue">
            EUR {application.loanRequested.toLocaleString()}
          </span>
        </div>
        <div>
          <span className="font-medium text-midnight-blue">
            Loan Tenure:
          </span>{" "}
          <span className="text-midnight-blue">
            {application.loanTenure} months
          </span>
        </div>
        <div>
          <span className="font-medium text-midnight-blue">
            Created At:
          </span>{" "}
          <span className="text-midnight-blue">
            {formatDate(application.createdAt)}
          </span>
        </div>
        <div>
          <span className="font-medium text-midnight-blue">
            Created By:
          </span>{" "}
          <span className="text-midnight-blue">
            {application.createdBy}
          </span>
        </div>
        <div>
          <span className="font-medium text-midnight-blue">
            Last Updated:
          </span>{" "}
          <span className="text-midnight-blue">
            {formatDate(application.lastUpdated)}
          </span>
        </div>
      </div>
    </div>
  );
}

type BoardColumnProps = {
  column: ColumnConfig;
  applications: LoanApplication[];
  onCardClick?: (application: LoanApplication) => void;
};

function BoardColumn({ column, applications, onCardClick }: BoardColumnProps) {
  return (
    <div className="flex-shrink-0 w-80 flex flex-col bg-[#E8E9EA] rounded-lg h-[calc(100vh-400px)] min-h-[600px]">
      {/* Column Header */}
      <div className="p-4 border-b border-primaryGrey-200 flex-shrink-0 rounded-t-lg bg-[#E8E9EA]">
        <div className="flex items-center gap-2">
          {/* Status Badge */}
          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md"
            style={{
              backgroundColor: column.bgColor,
            }}
          >
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: column.textColor }}
            />
            <span
              className="text-sm font-medium"
              style={{ color: column.textColor }}
            >
              {column.label}
            </span>
          </div>
          {/* Count */}
          <span className="text-sm font-semibold text-midnight-blue">
            {applications.length}
          </span>
        </div>
      </div>

      {/* Scrollable Cards Container */}
      <div className="flex-1 overflow-y-auto p-4 min-h-0">
        <div className="space-y-3">
          {applications.length === 0 ? (
            <div className="text-center py-8 text-sm text-primaryGrey-400">
              No applications
            </div>
          ) : (
            applications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                onCardClick={onCardClick}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export function LoanApplicationsBoard({
  data = dummyData,
  isLoading = false,
  onCardClick,
}: LoanApplicationsBoardProps) {
  // Group applications by status
  const groupedApplications = useMemo(() => {
    const grouped: Record<LoanApplicationStatus, LoanApplication[]> = {
      kyc_kyb_verification: [],
      credit_analysis: [],
      head_of_credit_review: [],
      rejected: [],
      cancelled: [],
      approved: [],
      disbursed: [],
    };

    data.forEach((app) => {
      if (grouped[app.status]) {
        grouped[app.status].push(app);
      }
    });

    return grouped;
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-primaryGrey-400">Loading loan applications...</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto pb-4 -mx-2 px-2">
      <div className="flex gap-4 min-w-max">
        {columns.map((column) => (
          <BoardColumn
            key={column.status}
            column={column}
            applications={groupedApplications[column.status]}
            onCardClick={onCardClick}
          />
        ))}
      </div>
    </div>
  );
}
