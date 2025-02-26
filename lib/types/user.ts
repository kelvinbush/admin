export interface TProfileForm {
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  phoneNumber: string;
  dateOfBirth: string;
  positionHeld: string;
  profilePhoto?: string;
  program?: string;
}

export interface UserResponse {
  personal: {
    firstName: string;
    lastName: string;
    email: string;
    gender: "female" | "male" | "other";
    phoneNumber: string;
    address: string;
    city: string;
    county: string;
    birthDate: string;
    guid: string | null;
    verifiedEmail: number;
    verifiedPhoneNumber: number;
    business: number;
    positionHeld: string;
    profilePhoto: string;
    program: string;
    taxIdNumber: string;
    identityDocNumber: string;
    identityDocType: string;
  };
  status: string;
  message: string;
}

export enum DocType {
  BusinessRegistration = 0,
  ArticlesOfAssociation = 1,
  BusinessPermit = 2,
  TaxRegistrationDocument = 3,
  AnnualBankStatement = 4,
  BusinessPlan = 5,
  PitchDeck = 7,
  CertificateOfIncorporation = 6,
  TaxClearanceDocument = 8,
  PartnershipDeed = 9,
  MemorandumOfAssociation = 10,
  AuditedFinancialStatement = 11,
  BalanceCahsFlowIncomeStatement = 12,
  AuditedFinancialStatementyear2 = 13,
  AuditedFinancialStatementyear3 = 14,
}

export interface BusinessDocument {
  personalProfile: never;
  personalProfileId: number;
  docType: DocType;
  docPath: string;
  id: number;
  createdDate: string;
  modifiedDate: string | null;
  status: string;
  statusRemarks: string;
}

export interface PersonalDocument {
  id: string;
  path: string;
  docType: number;
  personalGuid: string;
}

export interface BusinessProfile {
  businessName: string;
  businessDescription: string;
  typeOfIncorporation: string;
  sector: string;
  location: string;
  city: string;
  country: string;
  street1: string;
  street2: string;
  postalCode: string;
  averageAnnualTurnover: number;
  averageMonthlyTurnover: number;
  previousLoans: boolean;
  loanAmount: number;
  recentLoanStatus: string | null;
  defaultReason: string | null;
  businessGuid: string;
  businessLogo: string;
  yearOfRegistration: string;
  isBeneficalOwner: boolean;
  defaultCurrency: string;
}
