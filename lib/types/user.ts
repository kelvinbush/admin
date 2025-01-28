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
    gender: string;
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
  CompanyBudget = 5,
  BusinessPlan = 6,
  PitchDeck = 7,
  OtherDocuments = 8,
  TaxClearanceDocument = 9,
  IncomeStatements = 10,
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

export enum MonthlyTurnover {
  LESS_THAN_100K = "Less than KES 100,000",
  BETWEEN_100K_500K = "KES 100,000 - KES 500,000",
  BETWEEN_500K_1M = "KES 500,000 - KES 1,000,000",
  BETWEEN_1M_5M = "KES 1,000,000 - KES 5,000,000",
  OVER_5M = "Over KES 5,000,000",
}

export enum YearlyTurnover {
  LESS_THAN_1M = "Less than KES 1,000,000",
  BETWEEN_1M_5M = "KES 1,000,000 - KES 5,000,000",
  BETWEEN_5M_10M = "KES 5,000,000 - KES 10,000,000",
  BETWEEN_10M_50M = "KES 10,000,000 - KES 50,000,000",
  OVER_50M = "Over KES 50,000,000",
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
  averageAnnualTurnover: YearlyTurnover;
  averageMonthlyTurnover: MonthlyTurnover;
  previousLoans: boolean;
  loanAmount: number;
  recentLoanStatus: string | null;
  defaultReason: string | null;
  businessGuid: string;
  businessLogo: string;
  yearOfRegistration: string;
  isBeneficalOwner: boolean;
}
