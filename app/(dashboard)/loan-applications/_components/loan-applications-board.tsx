"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMemo } from "react";
import type { LoanApplication, LoanApplicationStatus } from "@/lib/api/hooks/loan-applications";

type LoanApplicationsBoardProps = {
  data?: LoanApplication[];
  isLoading?: boolean;
  onCardClick?: (application: LoanApplication) => void;
};

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
            {application.loanCurrency} {application.loanRequested.toLocaleString()}
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
  data = [],
  isLoading = false,
  onCardClick,
}: LoanApplicationsBoardProps) {
  // Group applications by status
  const groupedApplications = useMemo(() => {
    const grouped: Partial<Record<LoanApplicationStatus, LoanApplication[]>> = {};

    data.forEach((app) => {
      if (!grouped[app.status]) {
        grouped[app.status] = [];
      }
      grouped[app.status]!.push(app);
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
            applications={groupedApplications[column.status] || []}
            onCardClick={onCardClick}
          />
        ))}
      </div>
    </div>
  );
}
