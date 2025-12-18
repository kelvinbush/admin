"use client";

import { useSearchParams } from "next/navigation";
import { CompanyAddressForm } from "@/app/(dashboard)/entrepreneurs/[id]/company-details/address/_components/company-address-form";
import { useSMEUser } from "@/lib/api/hooks/sme";

export default function CompanyAddressPage() {
  const searchParams = useSearchParams();
  const entrepreneurId = searchParams.get("entrepreneurId");

  const { data, isLoading, isError } = useSMEUser(entrepreneurId || "", {
    enabled: !!entrepreneurId,
  });

  if (!entrepreneurId) {
    return (
      <div className="text-sm text-red-500">
        Entrepreneur ID is required. Please navigate from the loan application list.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-sm text-primaryGrey-500">
        Loading company address...
      </div>
    );
  }

  if (isError || !data || !data.business) {
    return (
      <div className="text-sm text-red-500">
        Failed to load company address.
      </div>
    );
  }

  const business = data.business;

  const initialData = {
    countriesOfOperation: business.countriesOfOperation || [],
    companyHeadquarters: business.companyHQ || "",
    city: business.city || business.registeredOfficeCity || "",
    registeredOfficeAddress: business.registeredOfficeAddress || "",
    zipCode: business.registeredOfficeZipCode || "",
  };

  return (
    <CompanyAddressForm
      userId={entrepreneurId}
      initialData={initialData}
    />
  );
}
