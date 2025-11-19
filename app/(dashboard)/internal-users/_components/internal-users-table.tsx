"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  MoreHorizontal,
  Mail,
  UserX,
  UserCheck,
  Trash2,
} from "lucide-react";
import type { InternalUserItem } from "@/lib/api/hooks/internal-users";
import { ConfirmActionModal } from "./confirm-action-modal";

export type InternalUserTableItem = InternalUserItem & {
  createdAt?: string;
  updatedAt?: string;
};

interface InternalUsersTableProps {
  data: InternalUserTableItem[];
  isLoading?: boolean;
  onAddUser?: () => void;
  onResendInvitation?: (invitationId: string) => void;
  onRevokeInvitation?: (invitationId: string) => void;
  onActivate?: (clerkId: string) => void;
  onDeactivate?: (clerkId: string) => void;
  onRemove?: (clerkId: string) => void;
  actionBusyId?: string | null;
}

function getInitials(name?: string, email?: string): string {
  if (name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }
  if (email) {
    return email.substring(0, 2).toUpperCase();
  }
  return "U";
}

function formatRole(role?: string): string {
  if (!role) return "Member";
  return role
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function InternalUsersTable({
  data,
  isLoading = false,
  onAddUser,
  onResendInvitation,
  onRevokeInvitation,
  onActivate,
  onDeactivate,
  onRemove,
  actionBusyId,
}: InternalUsersTableProps) {
  const [confirmModal, setConfirmModal] = React.useState<{
    type: "deactivate" | "activate" | "remove" | "revoke";
    userId?: string;
    invitationId?: string;
    open: boolean;
  }>({ type: "deactivate", open: false });

  const handleConfirm = () => {
    if (confirmModal.type === "deactivate" && confirmModal.userId && onDeactivate) {
      onDeactivate(confirmModal.userId);
    } else if (confirmModal.type === "activate" && confirmModal.userId && onActivate) {
      onActivate(confirmModal.userId);
    } else if (confirmModal.type === "remove" && confirmModal.userId && onRemove) {
      onRemove(confirmModal.userId);
    } else if (confirmModal.type === "revoke" && confirmModal.invitationId && onRevokeInvitation) {
      onRevokeInvitation(confirmModal.invitationId);
    }
    setConfirmModal({ type: "deactivate", open: false });
  };

  const getModalProps = () => {
    switch (confirmModal.type) {
      case "deactivate":
        return {
          title: "Are you sure you want to deactivate this account?",
          description: "This action will restrict account access and disable all associated functionalities. You can reactivate it later if needed.",
          confirmButtonText: "Yes, Deactivate",
          variant: "orange" as const,
        };
      case "activate":
        return {
          title: "Are you sure you want to reactivate this account?",
          description: "This action will restore account access and enable all associated functionalities.",
          confirmButtonText: "Yes, Reactivate",
          variant: "orange" as const,
        };
      case "remove":
        return {
          title: "Are you sure you want to remove this user?",
          description: "This action will permanently remove the user from the system and cannot be undone.",
          confirmButtonText: "Yes, Remove",
          variant: "red" as const,
        };
      case "revoke":
        return {
          title: "Are you sure you want to revoke this invitation?",
          description: "This action will permanently cancel the invitation and cannot be undone.",
          confirmButtonText: "Yes, Revoke",
          variant: "red" as const,
        };
    }
  };
  if (isLoading) {
    return (
      <Card className="shadow-none">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-primaryGrey-50">
                  <TableHead className="font-medium text-primaryGrey-500 py-4">
                    USER
                  </TableHead>
                  <TableHead className="font-medium text-midnight-blue py-4">
                    EMAIL
                  </TableHead>
                  <TableHead className="font-medium text-midnight-blue py-4">
                    ROLE
                  </TableHead>
                  <TableHead className="font-medium text-midnight-blue py-4">
                    STATUS
                  </TableHead>
                  <TableHead className="font-medium text-midnight-blue py-4">
                    PHONE
                  </TableHead>
                  <TableHead className="font-medium text-midnight-blue py-4">
                    ACTIONS
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primaryGrey-50 animate-pulse" />
                        <div className="h-4 w-32 bg-primaryGrey-50 rounded animate-pulse" />
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="h-4 w-48 bg-primaryGrey-50 rounded animate-pulse" />
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="h-4 w-24 bg-primaryGrey-50 rounded animate-pulse" />
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="h-6 w-20 bg-primaryGrey-50 rounded animate-pulse" />
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="h-4 w-32 bg-primaryGrey-50 rounded animate-pulse" />
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="h-8 w-8 bg-primaryGrey-50 rounded animate-pulse" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card className="shadow-none">
        <CardContent className="p-0">
          <div className="flex flex-col items-center justify-center py-20">
            <svg
              width="245"
              height="173"
              viewBox="0 0 245 173"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mb-6"
            >
              <path
                d="M198.771 0H50.4856C43.6609 0 38.1284 5.53248 38.1284 12.3571V160.643C38.1284 167.468 43.6609 173 50.4856 173H198.771C205.596 173 211.128 167.468 211.128 160.643V12.3571C211.128 5.53248 205.596 0 198.771 0Z"
                fill="#E6FAF5"
              />
              <g filter="url(#filter0_d_6690_240611)">
                <path
                  d="M65.3143 66.7285H232.136C233.774 66.7285 235.346 67.3795 236.505 68.5382C237.663 69.6969 238.314 71.2684 238.314 72.9071V103.8C238.314 105.439 237.663 107.01 236.505 108.169C235.346 109.328 233.774 109.979 232.136 109.979H65.3143C63.6757 109.979 62.1041 109.328 60.9454 108.169C59.7867 107.01 59.1357 105.439 59.1357 103.8V72.9071C59.1357 71.2684 59.7867 69.6969 60.9454 68.5382C62.1041 67.3795 63.6757 66.7285 65.3143 66.7285V66.7285Z"
                  fill="white"
                />
              </g>
              <path
                d="M156.757 76.6143H124.629C122.581 76.6143 120.921 78.274 120.921 80.3214C120.921 82.3688 122.581 84.0285 124.629 84.0285H156.757C158.805 84.0285 160.464 82.3688 160.464 80.3214C160.464 78.274 158.805 76.6143 156.757 76.6143Z"
                fill="#F8A9D1"
              />
              <path
                d="M179 92.6787H124.629C122.581 92.6787 120.921 94.3385 120.921 96.3859C120.921 98.4333 122.581 100.093 124.629 100.093H179C181.047 100.093 182.707 98.4333 182.707 96.3859C182.707 94.3385 181.047 92.6787 179 92.6787Z"
                fill="#B0EFDF"
              />
              <path
                d="M96.8252 100.093C103.309 100.093 108.565 94.837 108.565 88.3535C108.565 81.8701 103.309 76.6143 96.8252 76.6143C90.3418 76.6143 85.0859 81.8701 85.0859 88.3535C85.0859 94.837 90.3418 100.093 96.8252 100.093Z"
                fill="#00CC99"
              />
            </svg>
            <p className="text-primaryGrey-500 mb-6">
              No internal users have been added yet!
            </p>
            {onAddUser && (
              <Button
                className="h-10 border-0 text-white"
                style={{
                  background:
                    "linear-gradient(90deg, var(--green-500, #0C9) 0%, var(--pink-500, #F0459C) 100%)",
                }}
                onClick={onAddUser}
              >
                <Plus className="h-4 w-4 mr-2" />
                New User
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-none">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-primaryGrey-50">
                <TableHead className="font-medium text-primaryGrey-500 py-4 w-[320px]">
                  USER
                </TableHead>
                <TableHead className="font-medium text-midnight-blue py-4">
                  ROLE
                </TableHead>
                <TableHead className="font-medium text-midnight-blue py-4">
                  STATUS
                </TableHead>
                <TableHead className="font-medium text-midnight-blue py-4">
                  CREATED AT
                </TableHead>
                <TableHead className="font-medium text-midnight-blue py-4">
                  UPDATED AT
                </TableHead>
                <TableHead className="font-medium text-midnight-blue py-4">
                  ACTIONS
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((user) => {
                const isPending = user.status === "pending";
                const isActive = user.status === "active";
                const isInactive = user.status === "inactive";
                const isBusy = actionBusyId === user.invitationId || actionBusyId === user.clerkId;

                return (
                  <TableRow key={user.email} className="hover:bg-gray-50">
                    <TableCell className="py-4 w-[320px] max-w-[320px]">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={user.imageUrl}
                            alt={user.name || user.email}
                          />
                          <AvatarFallback className="bg-primaryGrey-50 text-primaryGrey-400 text-sm">
                            {getInitials(user.name, user.email)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1 truncate">
                          <div className="text-sm font-medium text-midnight-blue truncate">
                            {user.name || "No name"}
                          </div>
                          <div className="text-sm text-primaryGrey-400 flex flex-wrap items-center gap-1 truncate">
                            <span className="truncate">{user.email}</span>
                            {user.phoneNumber && (
                              <>
                                <span className="text-primaryGrey-100">|</span>
                                <span className="truncate">{user.phoneNumber}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="text-sm text-midnight-blue">
                        {formatRole(user.role)}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge
                        variant="outline"
                        className={`font-normal border text-xs ${
                          isActive
                            ? "border-green-500 text-green-500"
                            : isPending
                            ? "border-yellow-500 text-yellow-500"
                            : "border-red-500 text-red-500"
                        }`}
                      >
                        {user.status.charAt(0).toUpperCase() +
                          user.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="text-sm text-primaryGrey-400">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString(undefined, {
                              month: "short",
                              day: "2-digit",
                              year: "numeric",
                            })
                          : "-"}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="text-sm text-primaryGrey-400">
                        {user.updatedAt
                          ? new Date(user.updatedAt).toLocaleDateString(undefined, {
                              month: "short",
                              day: "2-digit",
                              year: "numeric",
                            })
                          : "-"}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            disabled={isBusy}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {isPending && user.invitationId && (
                            <>
                              {onResendInvitation && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    onResendInvitation(user.invitationId!)
                                  }
                                  disabled={isBusy}
                                >
                                  <Mail className="h-4 w-4 mr-2" />
                                  Resend Invitation
                                </DropdownMenuItem>
                              )}
                              {onRevokeInvitation && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    setConfirmModal({
                                      type: "revoke",
                                      invitationId: user.invitationId!,
                                      open: true,
                                    })
                                  }
                                  disabled={isBusy}
                                  className="text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Revoke Invitation
                                </DropdownMenuItem>
                              )}
                            </>
                          )}
                          {isActive && user.clerkId && (
                            <>
                              {onDeactivate && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    setConfirmModal({
                                      type: "deactivate",
                                      userId: user.clerkId!,
                                      open: true,
                                    })
                                  }
                                  disabled={isBusy}
                                >
                                  <UserX className="h-4 w-4 mr-2" />
                                  Deactivate
                                </DropdownMenuItem>
                              )}
                              {onRemove && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() =>
                                      setConfirmModal({
                                        type: "remove",
                                        userId: user.clerkId!,
                                        open: true,
                                      })
                                    }
                                    disabled={isBusy}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Remove User
                                  </DropdownMenuItem>
                                </>
                              )}
                            </>
                          )}
                          {isInactive && user.clerkId && (
                            <>
                              {onActivate && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    setConfirmModal({
                                      type: "activate",
                                      userId: user.clerkId!,
                                      open: true,
                                    })
                                  }
                                  disabled={isBusy}
                                >
                                  <UserCheck className="h-4 w-4 mr-2" />
                                  Activate
                                </DropdownMenuItem>
                              )}
                              {onRemove && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() =>
                                      setConfirmModal({
                                        type: "remove",
                                        userId: user.clerkId!,
                                        open: true,
                                      })
                                    }
                                    disabled={isBusy}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Remove User
                                  </DropdownMenuItem>
                                </>
                              )}
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {confirmModal.open && (
        <ConfirmActionModal
          open={confirmModal.open}
          onOpenChange={(open) =>
            setConfirmModal((prev) => ({ ...prev, open }))
          }
          onConfirm={handleConfirm}
          isLoading={
            actionBusyId === confirmModal.userId ||
            actionBusyId === confirmModal.invitationId
          }
          {...getModalProps()}
        />
      )}
    </Card>
  );
}

