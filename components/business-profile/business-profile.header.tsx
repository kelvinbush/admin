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

const BusinessProfileHeader = ({
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
  const [, setCompletionPercentage] = useState(0);
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
        "relative overflow-hidden rounded-lg border bg-gradient-to-r from-gray-900/90 to-gray-900/70",
        className,
      )}
      {...props}
      style={backgroundStyle}
    >
      <div
        className="absolute inset-0 "
        style={{
          backgroundColor: "rgba(21, 31, 40, 0.5)",
        }}
      />
      <div className="p-6">
        <div className="relative flex items-start gap-6">
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
                    className="h-28 w-28 rounded-full border-4 border-white bg-white object-cover shadow-lg"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Company Logo</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {onImageUpload && (
              <button className="absolute bottom-0 right-0 grid h-8 w-8 cursor-pointer place-items-center rounded-full border-2 border-white bg-primary-green transition-colors hover:bg-primary-green/90">
                <Camera className="h-5 w-5 text-white" />
              </button>
            )}
          </div>
          <div className="w-full space-y-1 relative">
            <h1 className="text-3xl font-medium text-white">
              {name}
              <Badge
                variant="secondary"
                className={cn(
                  "ml-2 inline-flex h-6 gap-1.5 rounded-lg border-none font-medium shadow-lg absolute right-3",
                  isVerified
                    ? "bg-primary-green/20 text-primary-green"
                    : "bg-zinc-500/20 text-zinc-300",
                )}
              >
                {isVerified ? (
                  <CheckCircle2 className="h-3 w-3" />
                ) : (
                  <Clock className="h-3 w-3" />
                )}
                {isVerified ? "Verified" : "Pending verification"}
              </Badge>
            </h1>
            <div className="flex items-center gap-2 text-white">
              <span className="capitalize">
                {companyType.replace(/-/g, " ")}
              </span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <span>{location}</span>
            </div>
            <div className="flex items-center gap-4 pt-2">
              {pitchDeck ? (
                <a
                  href={pitchDeck.docPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center"
                >
                  <Button
                    variant="link"
                    className="h-8 gap-1.5 p-0 text-primary-green underline transition-colors hover:text-primary-green/90"
                  >
                    Company pitch deck
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </a>
              ) : null}
              {onShare && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onShare}
                  className="h-8 gap-1.5 bg-transparent text-white transition-colors hover:bg-white/10"
                >
                  <Share2 className="h-3 w-3" />
                  Share Profile
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(BusinessProfileHeader);
