import { useEffect, useState } from "react";
import { useAppSelector } from "@/lib/redux/hooks";
import { selectCurrentToken } from "@/lib/redux/features/authSlice";
import { userApiSlice } from "@/lib/redux/services/user";
import { DocType } from "@/lib/types/user";
import type { BusinessDocument } from "@/lib/types/user";

// Required document types with their respective weights
type RequiredDocumentType = {
  type: DocType;
  weight: number;
};

const REQUIRED_DOCUMENTS: Record<DocType, RequiredDocumentType> = {
  [DocType.BusinessRegistration]: {
    type: DocType.BusinessRegistration,
    weight: 8,
  },
  [DocType.CertificateOfIncorporation]: {
    type: DocType.CertificateOfIncorporation,
    weight: 8,
  },
  [DocType.MemorandumOfAssociation]: {
    type: DocType.MemorandumOfAssociation,
    weight: 7,
  },
  [DocType.PartnershipDeed]: {
    type: DocType.PartnershipDeed,
    weight: 8,
  },
  [DocType.ArticlesOfAssociation]: {
    type: DocType.ArticlesOfAssociation,
    weight: 7,
  },
  [DocType.TaxRegistrationDocument]: {
    type: DocType.TaxRegistrationDocument,
    weight: 7,
  },
  [DocType.BusinessPermit]: {
    type: DocType.BusinessPermit,
    weight: 7,
  },
  [DocType.AnnualBankStatement]: {
    type: DocType.AnnualBankStatement,
    weight: 6,
  },
  [DocType.BusinessPlan]: {
    type: DocType.BusinessPlan,
    weight: 7,
  },
  [DocType.PitchDeck]: {
    type: DocType.PitchDeck,
    weight: 6,
  },
  [DocType.TaxClearanceDocument]: {
    type: DocType.TaxClearanceDocument,
    weight: 7,
  },
  [DocType.AuditedFinancialStatement]: {
    type: DocType.AuditedFinancialStatement,
    weight: 7,
  },
  [DocType.BalanceCahsFlowIncomeStatement]: {
    type: DocType.BalanceCahsFlowIncomeStatement,
    weight: 7,
  },
  [DocType.AuditedFinancialStatementyear2]: {
    type: DocType.AuditedFinancialStatementyear2,
    weight: 7,
  },
  [DocType.AuditedFinancialStatementyear3]: {
    type: DocType.AuditedFinancialStatementyear3,
    weight: 7,
  },
};

const soleProprietorRequiredDocuments = [
  DocType.BusinessRegistration,
  DocType.TaxRegistrationDocument,
  DocType.BusinessPermit,
  DocType.AnnualBankStatement,
  DocType.PitchDeck,
];

const companyRequiredDocuments = [
  DocType.CertificateOfIncorporation,
  DocType.MemorandumOfAssociation,
  DocType.TaxRegistrationDocument,
  DocType.AnnualBankStatement,
  DocType.PitchDeck,
];

const partnerRequiredDocuments = [
  DocType.PartnershipDeed,
  DocType.TaxRegistrationDocument,
  DocType.AnnualBankStatement,
  DocType.BusinessPermit,
  DocType.PitchDeck,
];

// Calculate total weights for each business type
const calculateTotalWeight = (docs: DocType[]) =>
  docs.reduce((sum, doc) => {
    const docInfo = REQUIRED_DOCUMENTS[doc];
    return sum + (docInfo?.weight || 0);
  }, 0);

const TOTAL_WEIGHTS = {
  soleProprietor: calculateTotalWeight(soleProprietorRequiredDocuments),
  company: calculateTotalWeight(companyRequiredDocuments),
  partner: calculateTotalWeight(partnerRequiredDocuments),
};

// Required business profile fields with their respective weights
const REQUIRED_BUSINESS_FIELDS = {
  businessName: { weight: 4 },
  businessDescription: { weight: 3 },
  typeOfIncorporation: { weight: 3 },
  sector: { weight: 3 },
  country: { weight: 2 },
  city: { weight: 2 },
  postalCode: { weight: 2 },
  averageAnnualTurnover: { weight: 4 },
  averageMonthlyTurnover: { weight: 3 },
  yearOfRegistration: { weight: 2 }, // Year of incorporation/founding
  street1: { weight: 4 },
  previousLoans: { weight: 2 },
};

// Calculate total weights
const TOTAL_PROFILE_WEIGHT = Object.values(REQUIRED_BUSINESS_FIELDS).reduce(
  (sum, field) => sum + field.weight,
  0,
);

export const useCompletionPercentage = () => {
  const [completionPercentage, setCompletionPercentage] = useState(50);
  const [profilePercentage, setProfilePercentage] = useState(0);
  const [documentsPercentage, setDocumentsPercentage] = useState(0);
  const guid = useAppSelector(selectCurrentToken);

  const { data: businessProfile } =
    userApiSlice.useGetBusinessProfileByPersonalGuidQuery(
      { guid: guid || "" },
      { skip: !guid },
    );

  const { data: documentResponse } = userApiSlice.useGetBusinessDocumentsQuery(
    { businessGuid: businessProfile?.business?.businessGuid || "" },
    { skip: !businessProfile?.business?.businessGuid },
  );

  // Check if a field has a valid value
  const isFieldValid = (value: any, fieldName?: string): boolean => {
    if (value === null || value === undefined) return false;

    if (typeof value === "boolean") {
      return true; // Any boolean value (true/false) is valid
    }

    if (typeof value === "number") {
      return !isNaN(value); // Accept any valid number, including 0
    }

    if (typeof value === "string") {
      // Special handling for postal code - allow any non-empty string
      if (fieldName === "postalCode") {
        return value.trim() !== "";
      }
      // For other string fields, ensure minimum length
      return value.trim().length >= 2;
    }
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return false;
  };

  // Calculate business profile completion
  const calculateProfileCompletion = () => {
    if (!businessProfile?.business) return 0;

    let completedWeight = 0;
    const missingFields: string[] = [];

    Object.entries(REQUIRED_BUSINESS_FIELDS).forEach(
      ([fieldName, { weight }]) => {
        const value =
          businessProfile.business[
            fieldName as keyof typeof businessProfile.business
          ];
        if (isFieldValid(value, fieldName)) {
          completedWeight += weight;
        } else {
          missingFields.push(fieldName);
        }
      },
    );

    // Log missing fields for debugging
    if (missingFields.length > 0) {
      console.debug("Missing or invalid business profile fields:", {
        missingFields,
        currentValues: missingFields.reduce(
          (acc, field) => ({
            ...acc,
            [field]:
              businessProfile.business[
                field as keyof typeof businessProfile.business
              ],
          }),
          {},
        ),
      });
    }

    const percentage = Math.round(
      (completedWeight / TOTAL_PROFILE_WEIGHT) * 100,
    );
    console.debug("Business Profile Completion:", {
      completedWeight,
      totalWeight: TOTAL_PROFILE_WEIGHT,
      percentage: percentage + "%",
    });
    return percentage;
  };

  // Helper function to calculate completion percentage
  const calculateCompletionPercentage = (
    uploadedDocs: BusinessDocument[],
    requiredDocs: DocType[],
  ): {
    percentage: number;
    uploadedDocuments: Array<{
      type: DocType;
      weight: number;
      name: string;
    }>;
    missingDocuments: Array<{
      type: DocType;
      weight: number;
      name: string;
    }>;
    completedWeight: number;
    totalWeight: number;
  } => {
    // Create a Set of uploaded document types for faster lookup
    const uploadedDocTypes = new Set(uploadedDocs.map((doc) => doc.docType));

    // Calculate weights
    const completedWeight = requiredDocs.reduce((sum, docType) => {
      if (uploadedDocTypes.has(docType)) {
        return sum + (REQUIRED_DOCUMENTS[docType]?.weight || 0);
      }
      return sum;
    }, 0);

    const totalWeight = requiredDocs.reduce(
      (sum, docType) => sum + (REQUIRED_DOCUMENTS[docType]?.weight || 0),
      0,
    );

    // Calculate missing documents
    const missingDocs = requiredDocs.filter(
      (docType) => !uploadedDocTypes.has(docType),
    );

    // Calculate percentage
    const percentage =
      totalWeight > 0 ? (completedWeight / totalWeight) * 100 : 0;

    return {
      percentage,
      uploadedDocuments: Array.from(uploadedDocTypes).map((type) => ({
        type,
        weight: REQUIRED_DOCUMENTS[type]?.weight || 0,
        name: getDocumentName(type),
      })),
      missingDocuments: missingDocs.map((docType) => ({
        type: docType,
        weight: REQUIRED_DOCUMENTS[docType]?.weight || 0,
        name: getDocumentName(docType),
      })),
      completedWeight,
      totalWeight,
    };
  };

  // Calculate document completion based on incorporation type
  const calculateDocumentCompletion = () => {
    if (!documentResponse?.documents) return 0;
    new Set(documentResponse.documents.map((doc) => doc.docType));
    // Get required documents based on incorporation type
    const getRequiredDocuments = () => {
      const businessType =
        businessProfile?.business?.typeOfIncorporation?.toLowerCase();
      switch (businessType) {
        case "sole-proprietorship":
          return {
            docs: soleProprietorRequiredDocuments,
            totalWeight: TOTAL_WEIGHTS.soleProprietor,
          };
        case "general-partnership":
        case "limited-partnership":
          return {
            docs: partnerRequiredDocuments,
            totalWeight: TOTAL_WEIGHTS.partner,
          };
        case "limited-liability-partnership-llp":
        case "limited-liability-company-llc":
        case "private-limited-company":
        case "public-limited-company":
        case "s-corporation":
        case "c-corporation":
        case "non-profit-organization":
          return {
            docs: companyRequiredDocuments,
            totalWeight: TOTAL_WEIGHTS.company,
          };
        default:
          console.debug("Unknown business type:", businessType);
          return {
            docs: soleProprietorRequiredDocuments,
            totalWeight: TOTAL_WEIGHTS.soleProprietor,
          };
      }
    };

    const { docs: requiredDocs } = getRequiredDocuments();
    const result = calculateCompletionPercentage(
      documentResponse.documents,
      requiredDocs,
    );

    console.debug("Document completion details:", {
      businessType: businessProfile?.business?.typeOfIncorporation,
      requiredDocuments: requiredDocs,
      uploadedDocuments: result.uploadedDocuments,
      missingDocuments: result.missingDocuments,
      completedWeight: result.completedWeight,
      totalWeight: result.totalWeight,
    });

    return result.percentage;
  };

  // Helper function to get document name
  const getDocumentName = (docType: DocType): string => {
    switch (docType) {
      case DocType.BusinessRegistration:
        return "Business Registration";
      case DocType.CertificateOfIncorporation:
        return "Certificate of Incorporation";
      case DocType.MemorandumOfAssociation:
        return "Memorandum of Association";
      case DocType.PartnershipDeed:
        return "Partnership Deed Agreement";
      case DocType.ArticlesOfAssociation:
        return "Articles of Association";
      case DocType.TaxRegistrationDocument:
        return "Tax Registration Document";
      case DocType.BusinessPermit:
        return "Business Permit";
      case DocType.AnnualBankStatement:
        return "Annual Bank Statement";
      case DocType.BusinessPlan:
        return "Business Plan";
      case DocType.PitchDeck:
        return "Pitch Deck";
      case DocType.TaxClearanceDocument:
        return "Tax Clearance Document";
      case DocType.AuditedFinancialStatement:
        return "Audited Financial Statement";
      case DocType.BalanceCahsFlowIncomeStatement:
        return "Balance Cahs Flow Income Statement";
      case DocType.AuditedFinancialStatementyear2:
        return "Audited Financial Statement Year 2";
      case DocType.AuditedFinancialStatementyear3:
        return "Audited Financial Statement Year 3";
      default:
        return "Unknown Document Type";
    }
  };

  useEffect(() => {
    // Base percentage starts at 20% just for having started the process
    const basePercentage = 20;

    // Calculate percentages for profile and documents
    const rawProfilePercent = calculateProfileCompletion();
    const rawDocumentPercent = calculateDocumentCompletion();

    // Profile completion contributes 40% to the total
    const weightedProfilePercent = Math.round(rawProfilePercent * 0.4);
    // Document completion contributes 40% to the total
    const weightedDocumentPercent = Math.round(rawDocumentPercent * 0.4);

    // Set individual percentages for UI display
    setProfilePercentage(rawProfilePercent);
    setDocumentsPercentage(rawDocumentPercent);

    // Calculate overall percentage:
    // 20% base + 40% from profile + 40% from documents
    const overallPercentage = Math.min(
      100,
      basePercentage + weightedProfilePercent + weightedDocumentPercent,
    );

    console.debug("Completion Percentages:", {
      base: basePercentage + "%",
      profile: {
        raw: rawProfilePercent + "%",
        weighted: weightedProfilePercent + "%",
      },
      documents: {
        raw: rawDocumentPercent + "%",
        weighted: weightedDocumentPercent + "%",
      },
      overall: overallPercentage + "%",
    });

    setCompletionPercentage(overallPercentage);
  }, [documentResponse, businessProfile]);

  // Check if business profile is complete
  const isBusinessProfileComplete = () => {
    if (!businessProfile?.business) {
      console.debug("Business profile is null or undefined");
      return false;
    }

    const missingFields: string[] = [];

    // Check all required fields
    const hasAllRequiredFields = Object.keys(REQUIRED_BUSINESS_FIELDS).every(
      (fieldName) => {
        const value =
          businessProfile.business[
            fieldName as keyof typeof businessProfile.business
          ];
        const isValid = isFieldValid(value, fieldName);

        if (!isValid) {
          missingFields.push(fieldName);
        }
        return isValid;
      },
    );

    // Log missing fields for debugging
    if (missingFields.length > 0) {
      console.debug("Missing or invalid business profile fields:", {
        missingFields,
        currentValues: missingFields.reduce(
          (acc, field) => ({
            ...acc,
            [field]:
              businessProfile.business[
                field as keyof typeof businessProfile.business
              ],
          }),
          {},
        ),
      });
    }

    // Additional validation based on incorporation type
    const incorporationType =
      businessProfile.business.typeOfIncorporation?.toLowerCase();
    if (!incorporationType) {
      console.debug("Missing incorporation type");
      return false;
    }

    // Add specific validations based on incorporation type if needed
    switch (incorporationType) {
      case "sole-proprietorship":
      case "general-partnership":
      case "limited-liability-partnership-llp":
      case "limited-liability-company-llc":
      case "private-limited-company":
      case "public-limited-company":
      case "s-corporation":
      case "c-corporation":
      case "non-profit-organization":
        return hasAllRequiredFields;
      default:
        console.debug("Invalid incorporation type:", incorporationType);
        return false;
    }
  };

  // Check if all required documents are uploaded
  const isDocumentsComplete = () => {
    if (
      !documentResponse?.documents ||
      !businessProfile?.business?.typeOfIncorporation
    ) {
      return false;
    }

    const businessType =
      businessProfile.business.typeOfIncorporation.toLowerCase();
    let requiredDocs: DocType[] = [];

    // Determine which documents are required based on business type
    if (businessType === "sole-proprietorship") {
      requiredDocs = soleProprietorRequiredDocuments;
    } else if (
      ["general-partnership", "limited-partnership"].includes(businessType)
    ) {
      requiredDocs = partnerRequiredDocuments;
    } else if (
      [
        "limited-liability-partnership-llp",
        "limited-liability-company-llc",
        "private-limited-company",
        "public-limited-company",
        "s-corporation",
        "c-corporation",
        "non-profit-organization",
      ].includes(businessType)
    ) {
      requiredDocs = companyRequiredDocuments;
    } else {
      // Default to sole proprietor if type is unknown
      requiredDocs = soleProprietorRequiredDocuments;
    }

    const uploadedDocTypes = new Set(
      documentResponse.documents.map((doc) => doc.docType),
    );

    // Check if all required documents for this business type are uploaded
    const allRequiredDocsUploaded = requiredDocs.every((docType) =>
      uploadedDocTypes.has(docType),
    );

    return allRequiredDocsUploaded;
  };

  return {
    completionPercentage,
    profilePercentage,
    documentsPercentage,
    isBusinessProfileComplete: isBusinessProfileComplete(),
    isDocumentsComplete: isDocumentsComplete(),
    isComplete: isBusinessProfileComplete() && isDocumentsComplete(),
  };
};
