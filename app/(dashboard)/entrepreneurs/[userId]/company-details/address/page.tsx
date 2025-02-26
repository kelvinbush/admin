"use client";

import { Suspense } from "react";
import CompanyAddress from "@/components/business-profile/company-details/company-address";

function CompanyAddressPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CompanyAddress />
    </Suspense>
  );
}

export default CompanyAddressPage;
