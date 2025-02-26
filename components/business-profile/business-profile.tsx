"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setTitle } from "@/lib/redux/features/top-bar.slice";
import { cn } from "@/lib/utils";
import { useGetBusinessProfileByPersonalGuidQuery } from "@/lib/redux/services/user";
import { Loader2 } from "lucide-react";
import BusinessProfileHeader from "@/components/business-profile/business-profile.header";

interface BusinessProfileProps {
  personalGuid: string;
  children: React.ReactNode;
}

const BusinessProfile = ({ personalGuid, children }: BusinessProfileProps) => {
  const tabs = [
    {
      label: "Personal Information",
      value: "personal-information",
      path: `/entrepreneurs/${personalGuid}/personal-information`,
    },
    {
      label: "Company Details",
      value: "company-details",
      path: `/entrepreneurs/${personalGuid}/company-details`,
    },
    {
      label: "Attachments",
      value: "documents",
      path: `/entrepreneurs/${personalGuid}/documents`,
    }, // TODO: Uncomment when team members page is ready
    // {
    //   label: "Team Members",
    //   value: "team-members",
    //   path: PageRoutes.BUSINESS_PROFILE_TEAM_MEMBERS,
    // },
    {
      label: "Billing",
      value: "billing",
      path: `/entrepreneurs/${personalGuid}/billing`,
    },
  ];

  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const { data: response, isLoading } =
    useGetBusinessProfileByPersonalGuidQuery(
      { guid: personalGuid || "" },
      { skip: !personalGuid },
    );

  dispatch(setTitle("Business Profile"));

  // Get the first part of the path after /business-profile/
  const currentMainTab = pathname.split("/").slice(3)[0] ?? "company-details";

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
  };

  return (
    <div className="space-y-6">
      <BusinessProfileHeader
        onImageUpload={() => console.log("Image Uploaded")}
        {...business}
      />
      <main className="space-y-6 bg-white">
        <Tabs value={currentMainTab} className="w-full">
          <TabsList className="w-full bg-transparent grid grid-cols-4">
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

export default BusinessProfile;
