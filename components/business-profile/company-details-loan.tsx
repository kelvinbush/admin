"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icons } from "@/components/icons";

interface CompanyDetailsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  userId: string;
  loanId: string;
}

const CompanyDetails = ({
  className,
  children,
  userId,
  loanId,
  ...props
}: CompanyDetailsProps) => {
  const navItems = [
    {
      label: "Company Information",
      value: "information",
      path: `/loan-applications/${loanId}/company-details/information?userId=${userId}`,
      icon: Icons.businessProfileIcon,
    },
    {
      label: "Company Address",
      value: "address",
      path: `/loan-applications/${loanId}/company-details/address?userId=${userId}`,
      icon: MapPin,
    },
    {
      label: "Financial Details",
      value: "financials",
      path: `/loan-applications/${loanId}/company-details/financials?userId=${userId}`,
      icon: Icons.funding,
    }, // TODO: Uncomment when ownership details page is ready
    // {
    //   label: "Ownership Details",
    //   value: "ownership",
    //   path: PageRoutes.BUSINESS_PROFILE_COMPANY_DETAILS_OWNERSHIP,
    //   icon: Icons.personIcon,
    // },
  ];

  const pathname = usePathname();
  // get the current tab from the pathname which is the part before the question mark
  const currentTab = pathname.split("/").pop()?.split("?")[0] ?? "information";

  return (
    <div
      className={cn("flex h-[calc(100vh-16rem)] mt-4", className)}
      {...props}
    >
      <div className="w-64 border-r bg-zinc-50/50 pr-0 mt-5">
        <nav className="w-full pl-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.value;

            return (
              <Button
                key={item.value}
                className={cn(
                  "w-full justify-start gap-2 h-12 bg-white text-black rounded-none shadow-none border hover:text-white",
                  isActive && "bg-midnight-blue text-white font-bold",
                )}
                asChild
              >
                <Link href={item.path}>
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </Button>
            );
          })}
        </nav>
      </div>
      <div className="flex-1 overflow-hidden p-4">{children}</div>
    </div>
  );
};

export default CompanyDetails;
