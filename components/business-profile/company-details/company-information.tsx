import React from "react";
import { cn } from "@/lib/utils";
import BusinessProfileForm from "@/components/business-profile/business-profile.form";

const CompanyInformation = ({ userId }: { userId: string }) => {
  return (
    <div className={cn("space-y-4")}>
      <div className="mb-8 flex items-center gap-8 text-2xl font-medium">
        <h2 className="shrink-0">Company Information</h2>
        <div className="h-[1.5px] w-full bg-gray-400" />
      </div>
      <div className="h-[calc(100vh-22rem)] overflow-y-auto pr-4">
        <BusinessProfileForm userId={userId} />
      </div>
    </div>
  );
};

export default CompanyInformation;
