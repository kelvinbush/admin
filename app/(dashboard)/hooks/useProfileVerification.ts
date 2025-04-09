// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Business } from "@/lib/types/business";
import { DocType } from "@/lib/types/user";

// Required document types with their respective weights
const REQUIRED_DOCUMENTS: {
  [DocType.BusinessRegistration]: { type: DocType; weight: 8 };
  [DocType.CertificateOfIncorporation]: { type: DocType; weight: 8 };
  [DocType.MemorandumOfAssociation]: { type: DocType; weight: 7 };
  [DocType.PartnershipDeed]: { type: DocType; weight: 8 };
  [DocType.TaxRegistrationDocument]: { type: DocType; weight: 7 };
  [DocType.BusinessPermit]: { type: DocType; weight: 7 };
  [DocType.AnnualBankStatement]: { type: DocType; weight: 6 };
  [DocType.BusinessPlan]: { type: DocType; weight: 7 };
  [DocType.PitchDeck]: { type: DocType; weight: 6 };
  [DocType.ArticlesOfAssociation]: { type: DocType; weight: 7 };
  [DocType.TaxClearanceDocument]: { type: DocType; weight: 7 };
  [DocType.AuditedFinancialStatement]: { type: DocType; weight: 7 };
} = {
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
  [DocType.ArticlesOfAssociation]: {
    type: DocType.ArticlesOfAssociation,
    weight: 7,
  },
  [DocType.TaxClearanceDocument]: {
    type: DocType.TaxClearanceDocument,
    weight: 7,
  },
  [DocType.AuditedFinancialStatement]: {
    type: DocType.AuditedFinancialStatement,
    weight: 7,
  },
} as const;

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
  docs.reduce((sum, doc) => sum + (REQUIRED_DOCUMENTS[doc]?.weight || 0), 0);

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
  yearOfRegistration: { weight: 2 },
  street1: { weight: 4 },
  previousLoans: { weight: 2 },
} as const;

// Calculate total weights
const TOTAL_PROFILE_WEIGHT = Object.values(REQUIRED_BUSINESS_FIELDS).reduce(
  (sum, field) => sum + field.weight,
  0,
);

export const calculateProfileVerification = (business: Business) => {
  // Check if a field has a valid value
  const isFieldValid = (value: any, fieldName?: string): boolean => {
    if (value === null || value === undefined) return false;

    if (typeof value === "boolean") {
      return true;
    }

    if (typeof value === "number") {
      return !isNaN(value);
    }

    if (typeof value === "string") {
      if (fieldName === "postalCode") {
        return value.trim() !== "";
      }
      return value.trim().length >= 2;
    }

    if (Array.isArray(value)) {
      return value.length > 0;
    }

    return false;
  };

  // Calculate business profile completion
  const calculateProfileCompletion = () => {
    let completedWeight = 0;

    Object.entries(REQUIRED_BUSINESS_FIELDS).forEach(
      ([fieldName, { weight }]) => {
        const value = business[fieldName as keyof Business];
        if (isFieldValid(value, fieldName)) {
          completedWeight += weight;
        }
      },
    );

    return Math.round((completedWeight / TOTAL_PROFILE_WEIGHT) * 100);
  };

  // Calculate document completion based on incorporation type
  const calculateDocumentCompletion = () => {
    const uploadedDocTypes = new Set(
      business.documents?.map((doc) => doc.docType) || [],
    );

    // Get required documents based on incorporation type
    const getRequiredDocuments = () => {
      const businessType = business.typeOfIncorporation?.toLowerCase();
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
          return {
            docs: soleProprietorRequiredDocuments,
            totalWeight: TOTAL_WEIGHTS.soleProprietor,
          };
      }
    };

    const { docs: requiredDocs, totalWeight } = getRequiredDocuments();
    let completedWeight = 0;

    requiredDocs.forEach((docType) => {
      if (uploadedDocTypes.has(docType)) {
        completedWeight += REQUIRED_DOCUMENTS[docType]?.weight || 0;
      }
    });

    return Math.round((completedWeight / totalWeight) * 100);
  };

  // Calculate overall percentage
  const basePercentage = 20;
  const profilePercent = calculateProfileCompletion();
  const documentPercent = calculateDocumentCompletion();

  // Profile completion contributes 40% to the total
  const weightedProfilePercent = Math.round(profilePercent * 0.4);
  // Document completion contributes 40% to the total
  const weightedDocumentPercent = Math.round(documentPercent * 0.4);

  // Calculate overall percentage:
  // 20% base + 40% from profile + 40% from documents
  const completionPercentage = Math.min(
    100,
    basePercentage + weightedProfilePercent + weightedDocumentPercent,
  );

  const isVerificationPending =
    completionPercentage >= 80 && business.personalProfile.verifiedEmail !== 1;

  return {
    completionPercentage,
    isVerificationPending,
  };
};
