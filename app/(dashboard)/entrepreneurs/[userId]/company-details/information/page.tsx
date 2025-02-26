"use client";
import { Suspense } from "react";
import CompanyInformation from "@/components/business-profile/company-details/company-information";
import { useParams } from "next/navigation";

function CompanyInformationPage() {
  const { userId } = useParams();
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CompanyInformation userId={userId as string} />
    </Suspense>
  );
}

export default CompanyInformationPage;
