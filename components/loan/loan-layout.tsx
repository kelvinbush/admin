"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setTitle } from "@/lib/redux/features/top-bar.slice";
import { cn } from "@/lib/utils";
import { useGetBusinessProfileByPersonalGuidQuery } from "@/lib/redux/services/user";
import { Loader2 } from "lucide-react";
import LoanProfileHeader from "@/components/loan/loan-profile.header";

interface BusinessProfileProps {
  loanId: string;
  personalGuid: string;
  children: React.ReactNode;
}

const LoanProfile = ({
  loanId,
  personalGuid,
  children,
}: BusinessProfileProps) => {
  const tabs = [
    {
      label: "Loan Summary",
      value: "loan",
      path: `/loan-applications/${loanId}/loan?userId=${personalGuid}`,
    },
    {
      label: "Personal Information",
      value: "personal-information",
      path: `/loan-applications/${loanId}/personal-information?userId=${personalGuid}`,
    },
    {
      label: "Company Details",
      value: "company-details",
      path: `/loan-applications/${loanId}/company-details?userId=${personalGuid}`,
    },
    {
      label: "Attachments",
      value: "documents",
      path: `/loan-applications/${loanId}/documents?userId=${personalGuid}`,
    }, // TODO: Uncomment when team members page is ready
    // {
    //   label: "Team Members",
    //   value: "team-members",
    //   path: PageRoutes.BUSINESS_PROFILE_TEAM_MEMBERS,
    // },
    {
      label: "Billing",
      value: "billing",
      path: `/loan-applications/${loanId}/billing?userId=${personalGuid}`,
    },
  ];

  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const { data: response, isLoading } =
    useGetBusinessProfileByPersonalGuidQuery(
      { guid: personalGuid || "" },
      { skip: !personalGuid },
    );

  dispatch(setTitle("Loan Applications"));

  const currentMainTab = pathname.split("/").slice(3, 4)[0] ?? "loan";

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!response?.business) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <p className="text-destructive">Failed to load business profile</p>
      </div>
    );
  }

  const business = {
    name: response.business.businessName,
    isVerified: false,
    completion: 80,
    pitchDeckUrl: "https://google.com",
    imageUrl: response.business?.businessLogo || "",
    companyType: response.business.typeOfIncorporation,
    location: `${response.business.city}, ${response.business.country}`,
    program: "",
    sector: response.business.sector,
  };

  return (
    <div className="space-y-6">
      <LoanProfileHeader
        onImageUpload={() => console.log("Image Uploaded")}
        {...business}
      />
      <main className="space-y-6 bg-white">
        <Tabs value={currentMainTab} className="w-full">
          <TabsList className="w-full bg-transparent grid grid-cols-5">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                asChild
                className="border-b py-3 px-0 border-gray-400 data-[state=active]:font-medium data-[state=active]:bg-transparent data-[state=active]:text-primary-green data-[state=active]:border-b-2 data-[state=active]:border-primary-green rounded-none"
              >
                <Link
                  href={tab.path}
                  className={cn(currentMainTab === tab.value && "font-medium")}
                >
                  {tab.label}
                </Link>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="">{children}</div>
      </main>
    </div>
  );
};

export default LoanProfile;
