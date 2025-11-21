"use client";

import { CompanyInformationForm } from "./_components/company-information-form";

export default function CompanyInformationPage() {
  // TODO: Fetch company data using the ID
  // For now, using placeholder data matching the image
  const initialData = {
    businessName: "Cesha Investments Limited",
    businessLegalEntityType: "private-limited",
    yearOfRegistration: "2023",
    sector: ["agriculture", "food-beverage"],
    businessDescription: "A climate fintech platform that uses climate data to provide access to finance to African SMEs.",
    programUserGroup: ["tuungane", "giz-sais"],
    twoXCriteria: ["founded-by-woman", "serving-women"],
    numberOfEmployees: "11-50",
    companyWebsite: "",
    businessPhotos: [],
    videoLinks: ["https://www.melaninkapital.com"],
  };

  return <CompanyInformationForm initialData={initialData} />;
}

