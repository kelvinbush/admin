"use client";

import React, { useEffect, useState } from "react";
import {
  Camera,
  CheckCircle2,
  Clock,
  ExternalLink,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAppSelector } from "@/lib/redux/hooks";
import { selectCurrentToken } from "@/lib/redux/features/authSlice";
import { userApiSlice } from "@/lib/redux/services/user";
import { cn } from "@/lib/utils";

// Required document types for business profile completion
const REQUIRED_DOC_TYPES = [0, 2, 4, 5, 6, 7]; // Business Registration, Permit, Bank Statement, Budget, Plan, Pitch Deck

// Required profile fields for completion calculation
const REQUIRED_PROFILE_FIELDS = [
  "businessName",
  "businessDescription",
  "typeOfIncorporation",
  "sector",
  "location",
  "city",
  "country",
  "street1",
  "postalCode",
  "averageAnnualTurnover",
  "averageMonthlyTurnover",
] as const;

interface BusinessProfileHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  location: string;
  companyType: string;
  isVerified: boolean;
  imageUrl: string;
  pitchDeckUrl: string;
  onImageUpload?: () => void;
  onShare?: () => void;
}

const LoanProfileHeader = ({
  name,
  location,
  companyType,
  isVerified,
  imageUrl,
  onImageUpload,
  onShare,
  className,
  ...props
}: BusinessProfileHeaderProps) => {
  const [completionPercentage, setCompletionPercentage] = useState(80); // Default to 80% as shown in the image
  const guid = useAppSelector(selectCurrentToken);
  userApiSlice.useUploadBusinessDocumentMutation();
  const [logoUrl] = useState(imageUrl);

  // Fetch business profile
  const { data: response } =
    userApiSlice.useGetBusinessProfileByPersonalGuidQuery(
      { guid: guid || "" },
      { skip: !guid },
    );

  // Fetch business documents
  const { data: documentResponse } = userApiSlice.useGetBusinessDocumentsQuery(
    { businessGuid: response?.business?.businessGuid || "" },
    { skip: !response?.business?.businessGuid },
  );

  useEffect(() => {
    if (response?.business) {
      const filledFields = REQUIRED_PROFILE_FIELDS.filter(
        (field) =>
          response.business[field] != null && response.business[field] !== "",
      ).length;
      const profilePercentage =
        (filledFields / REQUIRED_PROFILE_FIELDS.length) * 50;

      let documentPercentage = 0;
      if (documentResponse?.documents) {
        const uploadedDocTypes = new Set(
          documentResponse.documents.map(
            (doc: { docType: number }) => doc.docType,
          ),
        );
        const uploadedRequiredDocs = REQUIRED_DOC_TYPES.filter((docType) =>
          uploadedDocTypes.has(docType),
        ).length;
        documentPercentage =
          (uploadedRequiredDocs / REQUIRED_DOC_TYPES.length) * 50;
      }

      setCompletionPercentage(
        Math.round(profilePercentage + documentPercentage),
      );
    }
  }, [response?.business, documentResponse?.documents]);

  const pitchDeck = documentResponse?.documents?.find(
    (doc: { docType: number }) => doc.docType === 7,
  );

  // Memoize the background style to prevent unnecessary re-renders
  const backgroundStyle = React.useMemo(
    () => ({
      backgroundImage: "url(/images/abstract.png)",
      backgroundPosition: "center",
      backgroundSize: "cover",
    }),
    [],
  );

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border",
        className,
      )}
      {...props}
      style={backgroundStyle}
    >
      {/* Main header container */}
      <div className="flex flex-col">
        {/* Top section with company info */}
        <div className="relative bg-gradient-to-r from-gray-900 to-gray-800 p-6">
          <div className="relative flex items-start gap-6">
            {/* Company logo */}
            <div className="relative shrink-0">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <img
                      src={
                        logoUrl === ""
                          ? "https://www.adaptivewfs.com/wp-content/uploads/2020/07/logo-placeholder-image.png"
                          : logoUrl
                      }
                      alt={`${name} Logo`}
                      className="h-20 w-20 rounded-full border-2 border-white bg-white object-cover shadow-lg"
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Company Logo</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {onImageUpload && (
                <button className="absolute bottom-0 right-0 grid h-7 w-7 cursor-pointer place-items-center rounded-full border-2 border-white bg-primary-green transition-colors hover:bg-primary-green/90">
                  <Camera className="h-4 w-4 text-white" />
                </button>
              )}
            </div>
            
            {/* Company details */}
            <div className="w-full space-y-1 relative">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-medium text-white">{name}</h1>
                
                {/* Loan Actions Button */}
                <Button 
                  variant="default" 
                  className="text-white relative overflow-hidden group"
                  style={{ background: "linear-gradient(90deg, #00CC99 0%, #F0459C 100%)" }}
                >
                  <span className="relative z-10">Loan Actions <span className="ml-1">▼</span></span>
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                        style={{ background: "linear-gradient(90deg, #00BB88 0%, #E0358B 100%)" }}></span>
                </Button>
              </div>
              
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <span className="capitalize">{companyType.replace(/-/g, " ")} • {location}</span>
              </div>
              
              {/* Progress bar */}
              <div className="mt-3 w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-teal-500 h-2 rounded-full" 
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
              <div className="text-right text-xs text-gray-300">{completionPercentage}% profile completion</div>
            </div>
          </div>
        </div>
        
        {/* Bottom section with metadata */}
        <div className="bg-gray-900 border-t border-gray-700 grid grid-cols-5 divide-x divide-gray-700 text-sm">
          {/* Member since */}
          <div className="p-4">
            <div className="text-gray-400 text-xs">Member since</div>
            <div className="text-white">08/April/2023</div>
          </div>
          
          {/* Last login */}
          <div className="p-4">
            <div className="text-gray-400 text-xs">Last login</div>
            <div className="text-white">08/Nov/2024</div>
          </div>
          
          {/* Affiliate/Program */}
          <div className="p-4">
            <div className="text-gray-400 text-xs">Affiliate/Program</div>
            <div className="text-white flex items-center">
              <span className="bg-gray-700 rounded-full w-4 h-4 flex items-center justify-center mr-1 text-xs">→</span>
              Tuungane2xna Absa
            </div>
          </div>
          
          {/* Sector(s) */}
          <div className="p-4">
            <div className="text-gray-400 text-xs">Sector(s)</div>
            <div className="text-white">Agriculture, Technology</div>
          </div>
          
          {/* Loan status */}
          <div className="p-4">
            <div className="text-gray-400 text-xs">Loan status</div>
            <div className="text-white flex items-center">
              <Badge variant="outline" className="bg-blue-500/10 text-blue-300 border-blue-500/20 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Pending review
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(LoanProfileHeader);
