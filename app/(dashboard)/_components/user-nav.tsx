"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser, useClerk } from "@clerk/nextjs";
import { ConfirmActionModal } from "@/app/(dashboard)/internal-users/_components/custom-confirm-modal";

export default function UserNav() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2 text-sm text-red-500">
        Error loading profile
      </div>
    );
  }

  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User";

  const handleLogout = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
    } catch (error) {
      console.error("Failed to sign out:", error);
    } finally {
      setIsSigningOut(false);
      setLogoutModalOpen(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex cursor-pointer items-center gap-2 text-left"
          >
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={user.imageUrl}
                alt={fullName}
              />
              <AvatarFallback>
                {getInitials(fullName)}
              </AvatarFallback>
            </Avatar>
            <div className="text-sm font-medium text-midnight-blue">
              <p>{fullName}</p>
              <p className={"font-normal text-primaryGrey-200"}>
                {user.primaryEmailAddress?.emailAddress}
              </p>
            </div>
            <ChevronDown size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setLogoutModalOpen(true)}>Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmActionModal
        open={logoutModalOpen}
        onOpenChange={setLogoutModalOpen}
        onConfirm={handleLogout}
        title="Are you sure you want to log out?"
        description="You will need to sign in again to access your account."
        confirmButtonText="Yes, Log out"
        variant="red"
        isLoading={isSigningOut}
      />
    </>
  );
}
