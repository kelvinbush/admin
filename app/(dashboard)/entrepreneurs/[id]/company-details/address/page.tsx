"use client";

import { CompanyAddressForm } from "./_components/company-address-form";

export default function CompanyAddressPage() {
  // TODO: Fetch company address data using the ID
  // For now, using placeholder data matching the image
  const initialData = {
    countriesOfOperation: ["AU", "KE"], // Australia and Kenya
    companyHeadquarters: "KE", // Kenya
    city: "Nairobi",
    registeredOfficeAddress: "Highway Heights, Argwings kodhek road, Kilimani",
    zipCode: "00100",
  };

  return <CompanyAddressForm initialData={initialData} />;
}

