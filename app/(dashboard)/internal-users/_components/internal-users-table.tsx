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
} from "./custom-dropdown-menu";
import {
  Plus,
  MoreHorizontal,
  Mail,
  UserX,
  UserCheck,
  Trash2,
} from "lucide-react";
import type { InternalUserItem } from "@/lib/api/hooks/internal-users";
import { ConfirmActionModal } from "./custom-confirm-modal";

export type InternalUserTableItem = InternalUserItem & {
  createdAt?: string;
  updatedAt?: string;
};

interface InternalUsersTableProps {
  data: InternalUserTableItem[];
  isLoading?: boolean;
  onAddUser?: () => void;
  onManageUser?: (user: InternalUserTableItem) => void;
  onResendInvitation?: (invitationId: string) => void;
  onRevokeInvitation?: (invitationId: string) => void;
  onActivate?: (clerkId: string) => void;
  onDeactivate?: (clerkId: string) => void;
  onRemove?: (clerkId: string) => void;
  actionBusyId?: string | null;
  canManage?: boolean;
  currentUserId?: string;
  isFiltered?: boolean;
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
  onManageUser,
  onResendInvitation,
  onRevokeInvitation,
  onActivate,
  onDeactivate,
  onRemove,
  actionBusyId,
  canManage = false,
  currentUserId,
  isFiltered = false,
}: InternalUsersTableProps) {
  const [confirmModal, setConfirmModal] = React.useState<{
    type: "deactivate" | "activate" | "remove" | "revoke";
    userId?: string;
    invitationId?: string;
    open: boolean;
  }>({ type: "deactivate", open: false });

  const handleConfirm = () => {
    // Capture current modal state before it changes
    const currentModal = { ...confirmModal };
    
    // Close the modal first
    setConfirmModal({ type: "deactivate", open: false });
    
    // Execute action immediately
    if (currentModal.type === "deactivate" && currentModal.userId && onDeactivate) {
      onDeactivate(currentModal.userId);
    } else if (currentModal.type === "activate" && currentModal.userId && onActivate) {
      onActivate(currentModal.userId);
    } else if (currentModal.type === "remove" && currentModal.userId && onRemove) {
      onRemove(currentModal.userId);
    } else if (currentModal.type === "revoke" && currentModal.invitationId && onRevokeInvitation) {
      onRevokeInvitation(currentModal.invitationId);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Fully reset state when closing
      setConfirmModal({ type: "deactivate", open: false });
    } else {
      setConfirmModal((prev) => ({ ...prev, open }));
    }
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
              <g filter="url(#filter0_d_6746_244535)">
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
              <path
                d="M94.6036 91.0816H92.5596L92.1536 92.2646H91.3066L93.1476 87.2596H94.0226L95.8566 92.2646H95.0096L94.6036 91.0816ZM92.7906 90.3886H94.3796L93.5956 88.0226H93.5816L92.7906 90.3886ZM96.3333 92.2646V87.2596H98.4613C99.4203 87.2596 100.113 87.7076 100.113 88.7576C100.113 89.8076 99.4203 90.2626 98.4613 90.2626H97.1663V92.2646H96.3333ZM97.1663 87.9666V89.5486H98.4263C98.9863 89.5486 99.2803 89.3106 99.2803 88.7576C99.2803 88.2116 98.9863 87.9666 98.4263 87.9666H97.1663Z"
                fill="white"
              />
              <g filter="url(#filter1_d_6746_244535)">
                <path
                  d="M12.1786 119.864H179C180.639 119.864 182.21 120.515 183.369 121.674C184.528 122.833 185.179 124.404 185.179 126.043V156.936C185.179 158.574 184.528 160.146 183.369 161.305C182.21 162.463 180.639 163.114 179 163.114H12.1786C10.5399 163.114 8.96837 162.463 7.80966 161.305C6.65095 160.146 6 158.574 6 156.936V126.043C6 124.404 6.65095 122.833 7.80966 121.674C8.96837 120.515 10.5399 119.864 12.1786 119.864V119.864Z"
                  fill="white"
                />
              </g>
              <path
                d="M103.621 129.75H71.4928C69.4454 129.75 67.7856 131.41 67.7856 133.457C67.7856 135.505 69.4454 137.164 71.4928 137.164H103.621C105.669 137.164 107.329 135.505 107.329 133.457C107.329 131.41 105.669 129.75 103.621 129.75Z"
                fill="#F8A9D1"
              />
              <path
                d="M125.864 145.814H71.4928C69.4454 145.814 67.7856 147.474 67.7856 149.522C67.7856 151.569 69.4454 153.229 71.4928 153.229H125.864C127.912 153.229 129.571 151.569 129.571 149.522C129.571 147.474 127.912 145.814 125.864 145.814Z"
                fill="#B0EFDF"
              />
              <path
                d="M27.625 153.229C34.1085 153.229 39.3643 147.973 39.3643 141.489C39.3643 135.006 34.1085 129.75 27.625 129.75C21.1416 129.75 15.8857 135.006 15.8857 141.489C15.8857 147.973 21.1416 153.229 27.625 153.229Z"
                fill="#00CC99"
              />
              <path
                d="M26.5133 142.596C26.5133 143.457 26.1773 144.269 24.9733 144.269C23.7693 144.269 23.4333 143.457 23.4333 142.596V142.365H24.2243V142.596C24.2243 143.156 24.3223 143.555 24.9523 143.555C25.5753 143.555 25.6873 143.156 25.6873 142.596V139.159H26.5133V142.596ZM29.2063 141.182C30.2773 141.455 31.0893 141.686 31.0893 142.806C31.0893 143.604 30.4873 144.269 29.2273 144.269C28.0023 144.269 27.0713 143.632 27.0223 142.498H27.8553C27.8973 143.135 28.3313 143.555 29.2273 143.555C29.9693 143.555 30.2563 143.226 30.2563 142.841C30.2563 142.246 29.8293 142.134 28.8423 141.889C28.0583 141.693 27.2113 141.392 27.2113 140.44C27.2113 139.551 27.8973 139.054 28.9893 139.054C30.0883 139.054 30.8863 139.628 30.9563 140.657H30.1233C30.0463 140.076 29.6823 139.768 28.9893 139.768C28.3943 139.768 28.0373 139.992 28.0373 140.363C28.0373 140.909 28.5063 141.007 29.2063 141.182Z"
                fill="white"
              />
              <g filter="url(#filter2_d_6746_244535)">
                <path
                  d="M179 13.5928H12.1786C8.76624 13.5928 6 16.359 6 19.7713V50.6642C6 54.0765 8.76624 56.8428 12.1786 56.8428H179C182.412 56.8428 185.179 54.0765 185.179 50.6642V19.7713C185.179 16.359 182.412 13.5928 179 13.5928Z"
                  fill="white"
                />
              </g>
              <path
                d="M101.15 23.4785H69.0216C66.9742 23.4785 65.3145 25.1383 65.3145 27.1857C65.3145 29.2331 66.9742 30.8928 69.0216 30.8928H101.15C103.198 30.8928 104.857 29.2331 104.857 27.1857C104.857 25.1383 103.198 23.4785 101.15 23.4785Z"
                fill="#F8A9D1"
              />
              <path
                d="M123.393 39.543H69.0216C66.9742 39.543 65.3145 41.2027 65.3145 43.2501C65.3145 45.2975 66.9742 46.9573 69.0216 46.9573H123.393C125.44 46.9573 127.1 45.2975 127.1 43.2501C127.1 41.2027 125.44 39.543 123.393 39.543Z"
                fill="#B0EFDF"
              />
              <path
                d="M43.6895 46.9571C50.1729 46.9571 55.4288 41.7012 55.4288 35.2178C55.4288 28.7344 50.1729 23.4785 43.6895 23.4785C37.2061 23.4785 31.9502 28.7344 31.9502 35.2178C31.9502 41.7012 37.2061 46.9571 43.6895 46.9571Z"
                fill="#00CC99"
              />
              <path
                d="M38.276 37.8926V32.8876H39.354L40.754 36.7376H40.768L42.161 32.8876H43.239V37.8926H42.427V34.0986H42.413L41.09 37.8926H40.425L39.102 34.0986H39.088V37.8926H38.276ZM44.0934 32.8876H44.9264V35.3586L47.1944 32.8876H48.1884L46.2424 35.0086L48.3074 37.8926H47.3344L45.6964 35.5896L44.9264 36.4156V37.8926H44.0934V32.8876Z"
                fill="white"
              />
              <defs>
                <filter
                  id="filter0_d_6746_244535"
                  x="53.1357"
                  y="63.7285"
                  width="191.179"
                  height="55.25"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset dy="3" />
                  <feGaussianBlur stdDeviation="3" />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.161 0"
                  />
                  <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_6746_244535"
                  />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow_6746_244535"
                    result="shape"
                  />
                </filter>
                <filter
                  id="filter1_d_6746_244535"
                  x="0"
                  y="116.864"
                  width="191.179"
                  height="55.25"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset dy="3" />
                  <feGaussianBlur stdDeviation="3" />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.161 0"
                  />
                  <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_6746_244535"
                  />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow_6746_244535"
                    result="shape"
                  />
                </filter>
                <filter
                  id="filter2_d_6746_244535"
                  x="0"
                  y="10.5928"
                  width="191.179"
                  height="55.25"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset dy="3" />
                  <feGaussianBlur stdDeviation="3" />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.161 0"
                  />
                  <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_6746_244535"
                  />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow_6746_244535"
                    result="shape"
                  />
                </filter>
              </defs>
            </svg>
            <p className="text-primaryGrey-500 mb-6">
              {isFiltered
                ? "No user record found. Try refining your search or adjusting your filters."
                : "No internal users have been added yet!"}
            </p>
            {onAddUser && canManage && (
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
                const isBusy =
                  actionBusyId === user.invitationId || actionBusyId === user.clerkId;
                const isSelf =
                  !!currentUserId && !!user.clerkId && user.clerkId === currentUserId;

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
                            disabled={isBusy || !canManage || isSelf}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {onManageUser && (
                            <DropdownMenuItem
                              onClick={() => onManageUser(user)}
                              disabled={isBusy || !canManage}
                            >
                              Manage user details
                            </DropdownMenuItem>
                          )}
                          {onManageUser && canManage && !isSelf && (
                            <DropdownMenuSeparator />
                          )}
                          {canManage && !isSelf && isPending && user.invitationId && (
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
                          {canManage && !isSelf && isActive && user.clerkId && (
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
                          {canManage && !isSelf && isInactive && user.clerkId && (
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

      <ConfirmActionModal
        open={confirmModal.open}
        onOpenChange={handleOpenChange}
        onConfirm={handleConfirm}
        isLoading={
          actionBusyId === confirmModal.userId ||
          actionBusyId === confirmModal.invitationId
        }
        {...getModalProps()}
      />
    </Card>
  );
}

