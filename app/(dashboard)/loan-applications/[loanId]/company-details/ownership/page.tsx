"use client";
import { Suspense } from "react";
import ComapnyOwnershipDetails from "@/components/business-profile/company-details/company-ownership";

function CompanyOwnershipPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ComapnyOwnershipDetails />
    </Suspense>
  );
}

export default CompanyOwnershipPage;
