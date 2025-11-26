"use client";

import { useParams } from "next/navigation";
import { CompanyInformationForm } from "./_components/company-information-form";
import { useSMEUser } from "@/lib/api/hooks/sme";

export default function CompanyInformationPage() {
  const params = useParams();
  const entrepreneurId = params.id as string;

  const { data, isLoading, isError } = useSMEUser(entrepreneurId);

  if (isLoading) {
    return (
      <div className="text-sm text-primaryGrey-500">
        Loading company information...
      </div>
    );
  }

  if (isError || !data || !data.business) {
    return (
      <div className="text-sm text-red-500">
        Failed to load company information.
      </div>
    );
  }

  const business = data.business;

  const mapNoOfEmployees = (count: number | null): string => {
    if (!count) return "";
    if (count <= 10) return "1-10";
    if (count <= 50) return "11-50";
    if (count <= 100) return "51-100";
    if (count <= 500) return "101-500";
    if (count <= 1000) return "501-1000";
    return "1001-plus";
  };

  const initialData = {
    businessName: business.name || "",
    businessLegalEntityType: business.entityType || "",
    yearOfRegistration: business.yearOfIncorporation?.toString() || "",
    sector: business.sectors || [],
    businessDescription: business.description || "",
    programUserGroup: business.userGroupIds || [],
    twoXCriteria: business.selectionCriteria || [],
    numberOfEmployees: mapNoOfEmployees(business.noOfEmployees),
    companyWebsite: business.website || "",
    businessPhotos: business.businessPhotos || [],
    videoLinks: (business.videoLinks || []).map((v) => v.url),
  };

  return (
    <CompanyInformationForm
      userId={entrepreneurId}
      initialData={initialData}
      logo={business.logo}
    />
  );
}

