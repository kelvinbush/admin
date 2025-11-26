"use client";

import { useRouter } from "next/navigation";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { EntrepreneurListItem } from "@/lib/api/types";
import { ChevronLeft, ChevronRight, Eye, Trash2 } from "lucide-react";
import { useSendSMEInvitation } from "@/lib/api/hooks/sme";
import { toast } from "@/hooks/use-toast";

type EntrepreneursTableProps = {
  items: EntrepreneurListItem[];
  page: number;
  limit: number;
  total: number;
  isLoading?: boolean;
  onPageChange?: (page: number) => void;
  onRemove?: (user: EntrepreneurListItem) => void;
};

function getInitials(firstName?: string | null, lastName?: string | null) {
  const first = firstName?.[0] ?? "";
  const last = lastName?.[0] ?? "";
  const initials = `${first}${last}`.trim();
  return initials || "SM";
}

function getProfileProgress(user: EntrepreneurListItem): number {
  return Math.round(user.businessProfileProgress ?? 0);
}

function getStatusBadge(onboardingStatus: EntrepreneurListItem["onboardingStatus"]) {
  switch (onboardingStatus) {
    case "active":
      return {
        label: "Active",
        className: "bg-emerald-100 text-emerald-700",
      };
    case "pending_invitation":
      return {
        label: "Pending activation",
        className: "bg-amber-100 text-amber-700",
      };
    case "draft":
    default:
      return {
        label: "Draft",
        className: "bg-primaryGrey-100 text-primaryGrey-700",
      };
  }
}

export function EntrepreneursTable({
  items,
  page,
  limit,
  total,
  isLoading,
  onPageChange,
  onRemove,
}: EntrepreneursTableProps) {
  const router = useRouter();
  const sendInvitationMutation = useSendSMEInvitation();

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const handlePrev = () => {
    if (page > 1 && onPageChange) onPageChange(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages && onPageChange) onPageChange(page + 1);
  };

  const handlePageClick = (newPage: number) => {
    if (newPage !== page && onPageChange) onPageChange(newPage);
  };

  const renderPageButtons = () => {
    const buttons: number[] = [];
    const maxButtons = 5;

    if (totalPages <= maxButtons) {
      for (let i = 1; i <= totalPages; i++) buttons.push(i);
    } else {
      const start = Math.max(1, page - 1);
      const end = Math.min(totalPages, start + maxButtons - 1);
      for (let i = start; i <= end; i++) buttons.push(i);
    }

    return buttons;
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="border border-primaryGrey-100 rounded-md overflow-hidden">
        <Table className="min-w-full">
          <TableHeader className="bg-[#E8E9EA]">
            <TableRow>
              <TableHead className="px-6 py-3 text-xs font-semibold text-primaryGrey-400">
                BUSINESS NAME
              </TableHead>
              <TableHead className="px-6 py-3 text-xs font-semibold text-primaryGrey-400">
                REGISTERED USER
              </TableHead>
              <TableHead className="px-6 py-3 text-xs font-semibold text-primaryGrey-400">
                USER GROUP
              </TableHead>
              <TableHead className="px-6 py-3 text-xs font-semibold text-primaryGrey-400">
                B/S SECTOR
              </TableHead>
              <TableHead className="px-6 py-3 text-xs font-semibold text-primaryGrey-400">
                B/S PROFILE PROGRESS
              </TableHead>
              <TableHead className="px-6 py-3 text-xs font-semibold text-primaryGrey-400">
                STATUS
              </TableHead>
              <TableHead className="px-6 py-3 text-xs font-semibold text-primaryGrey-400 text-right">
                ACTIONS
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={6} className="px-6 py-8 text-center">
                  Loading entrepreneurs...
                </TableCell>
              </TableRow>
            )}

            {!isLoading && items.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="px-6 py-8 text-center">
                  No entrepreneurs found.
                </TableCell>
              </TableRow>
            )}

            {!isLoading &&
              items.map((item) => {
                const progress = getProfileProgress(item);
                const status = getStatusBadge(item.onboardingStatus);
                const sector =
                  item.business?.sectors && item.business.sectors.length > 0
                    ? item.business.sectors.join(", ")
                    : "—";

                const registeredUserName = `${item.firstName ?? ""} ${item.lastName ?? ""}`.trim();
                const registeredUserEmail = item.email;
                const registeredUserPhone = item.phone;

                const handleViewDetails = () => {
                  if (item.onboardingStatus === "active") {
                    // Active SME → go to read-only details page
                    router.push(`/entrepreneurs/${item.userId}`);
                  } else {
                    // Draft or pending invitation → go to create flow with prefilled data
                    router.push(`/entrepreneurs/create?userId=${item.userId}&step=1`);
                  }
                };

                const canResendInvite = item.onboardingStatus === "pending_invitation";

                const handleResendInvite = async () => {
                  if (!canResendInvite) return;

                  try {
                    await sendInvitationMutation.mutateAsync({ userId: item.userId });
                    toast({
                      title: "Invitation sent",
                      description: "The entrepreneur has been re-invited successfully.",
                    });
                  } catch (error: any) {
                    const errorMessage =
                      error?.response?.data?.error ||
                      error?.message ||
                      "Failed to resend invitation.";
                    toast({
                      title: "Error",
                      description: errorMessage,
                      variant: "destructive",
                    });
                  }
                };

                return (
                  <TableRow
                    key={item.userId}
                    className="hover:bg-primaryGrey-25/60"
                  >
                    <TableCell className="px-6 py-4 text-sm text-midnight-blue">
                      {item.business?.name || "—"}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          {item.imageUrl && (
                            <AvatarImage src={item.imageUrl} alt={registeredUserName || "User"} />
                          )}
                          <AvatarFallback className="bg-primaryGrey-100 text-primaryGrey-600 text-xs">
                            {getInitials(item.firstName ?? undefined, item.lastName ?? undefined)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-midnight-blue">
                            {registeredUserName || "—"}
                          </span>
                          <span className="text-xs text-primaryGrey-400">
                            {registeredUserEmail}
                            {registeredUserPhone
                              ? ` | ${registeredUserPhone}`
                              : ""}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-primaryGrey-500">
                      {item.userGroups && item.userGroups.length > 0
                        ? item.userGroups.map((g) => g.name).join(", ")
                        : "—"}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-primaryGrey-500 capitalize">
                      {sector}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="">
                      <p className="text-xs text-primaryGrey-500 text-right">
                          {progress}%
                        </p>
                        <Progress
                          value={progress}
                          className="h-1.5 w-full bg-primary-green"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
                          status.className,
                        )}
                      >
                        {status.label}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center justify-end gap-4">
                        <button
                          type="button"
                          onClick={handleViewDetails}
                          className="inline-flex items-center gap-1 text-xs text-primaryGrey-600 hover:text-midnight-blue"
                        >
                          <Eye className="h-4 w-4" />
                          <span>View Details</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleResendInvite}
                          disabled={!canResendInvite || sendInvitationMutation.isPending}
                          className={cn(
                            "inline-flex items-center gap-1 text-xs",
                            !canResendInvite || sendInvitationMutation.isPending
                              ? "text-primaryGrey-300 cursor-not-allowed"
                              : "text-primaryGrey-600 hover:text-midnight-blue",
                          )}
                        >
                          <span>
                            {sendInvitationMutation.isPending ? "Resending..." : "Resend Invite"}
                          </span>
                        </button>
                        {onRemove && (
                          <button
                            type="button"
                            onClick={() => onRemove(item)}
                            className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Remove</span>
                          </button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination footer */}
      <div className="flex items-center justify-between text-xs text-primaryGrey-500 mt-2">
        <div>
          {total > 0 && (
            <span>
              Showing {(page - 1) * limit + 1} to{" "}
              {Math.min(page * limit, total)} of {total} results
            </span>
          )}
        </div>
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrev}
              disabled={page === 1}
              className={cn(
                "h-8 w-8 flex items-center justify-center border rounded-sm text-xs",
                page === 1
                  ? "text-primaryGrey-300 border-primaryGrey-100 cursor-not-allowed"
                  : "text-primaryGrey-600 border-primaryGrey-200 hover:bg-primaryGrey-50",
              )}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {renderPageButtons().map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => handlePageClick(p)}
                className={cn(
                  "h-8 min-w-[32px] px-2 flex items-center justify-center border rounded-sm text-xs",
                  p === page
                    ? "bg-midnight-blue text-white border-midnight-blue"
                    : "text-primaryGrey-600 border-primaryGrey-200 hover:bg-primaryGrey-50",
                )}
              >
                {p}
              </button>
            ))}
            {totalPages > 5 && page < totalPages - 2 && (
              <span className="px-1">…</span>
            )}
            <button
              type="button"
              onClick={handleNext}
              disabled={page === totalPages}
              className={cn(
                "h-8 w-8 flex items-center justify-center border rounded-sm text-xs",
                page === totalPages
                  ? "text-primaryGrey-300 border-primaryGrey-100 cursor-not-allowed"
                  : "text-primaryGrey-600 border-primaryGrey-200 hover:bg-primaryGrey-50",
              )}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


