import { DocType } from "./user";

export interface BusinessDocument {
  docType: DocType;
  docPath: string;
}

export interface PersonalProfile {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profilePhoto?: string;
  program?: string;
  verifiedEmail: number;
}

export interface Business {
  businessGuid: string;
  businessName: string;
  businessDescription?: string;
  typeOfIncorporation?: string;
  sector: string;
  country?: string;
  city?: string;
  postalCode?: string;
  averageAnnualTurnover?: number;
  averageMonthlyTurnover?: number;
  yearOfRegistration?: number;
  street1?: string;
  previousLoans?: any;
  personalProfile: PersonalProfile;
  personalGuid: string;
  isBeneficalOwner?: boolean;
  documents?: BusinessDocument[];
}
