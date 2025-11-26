// Base API response types
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: any;
}

// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  profilePhoto?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  personal: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    profilePhoto: string;
    dateOfBirth?: string;
    gender?: string;
  };
  address?: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
}

// Loan Application types
export interface LoanApplication {
  id: string;
  userId: string;
  loanProductId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'approved' | 'rejected' | 'in_review' | 'completed';
  applicationDate: string;
  approvedDate?: string;
  rejectedDate?: string;
  rejectionReason?: string;
  documents: Document[];
  personalInfo: PersonalInfo;
  businessInfo?: BusinessInfo;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  address: Address;
  identityDocument: IdentityDocument;
}

export interface BusinessInfo {
  businessName: string;
  businessType: string;
  registrationNumber: string;
  taxId: string;
  address: Address;
  financials: BusinessFinancials;
  ownership: BusinessOwnership[];
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface IdentityDocument {
  type: string;
  number: string;
  expiryDate: string;
  documentUrl: string;
}

export interface BusinessFinancials {
  annualRevenue: number;
  monthlyExpenses: number;
  profitMargin: number;
  bankStatements: string[];
}

export interface BusinessOwnership {
  ownerName: string;
  ownershipPercentage: number;
  isPrimaryOwner: boolean;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

// Loan Product types
export interface LoanProductLegacy {
  id: string;
  name: string;
  description: string;
  minAmount: number;
  maxAmount: number;
  interestRate: number;
  termMonths: number;
  currency: string;
  isActive: boolean;
  requirements: LoanRequirement[];
  fees: LoanFee[];
  createdAt: string;
  updatedAt: string;
}

export interface LoanRequirement {
  id: string;
  name: string;
  description: string;
  isRequired: boolean;
  documentType?: string;
}

export interface LoanFee {
  id: string;
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
  description: string;
  isActive: boolean;
}

// Organization types
export interface Organization {
  id: string;
  name: string;
  type: string;
  registrationNumber: string;
  taxId: string;
  address: Address;
  contactInfo: ContactInfo;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  website?: string;
  contactPerson: string;
}

// Partner types
export interface Partner {
  id: string;
  name: string;
  type: string;
  description: string;
  contactInfo: ContactInfo;
  isActive: boolean;
  partnershipDate: string;
  createdAt: string;
  updatedAt: string;
}

// User Group types
export interface UserGroup {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  users: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  actions: string[];
}

// Dashboard Analytics types
export interface DashboardOverview {
  totalUsers: number;
  totalLoanApplications: number;
  totalLoanProducts: number;
  totalOrganizations: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
}

export interface LoanAnalytics {
  applicationsByStatus: {
    status: string;
    count: number;
    percentage: number;
  }[];
  applicationsByMonth: {
    month: string;
    count: number;
    amount: number;
  }[];
  averageLoanAmount: number;
  approvalRate: number;
}

export interface SMEAnalytics {
  totalSMEs: number;
  activeSMEs: number;
  smeBySector: {
    sector: string;
    count: number;
    percentage: number;
  }[];
  averageSMERevenue: number;
  smeGrowthRate: number;
}

// Form types for mutations
export interface CreateLoanProductDataLegacy {
  name: string;
  description: string;
  minAmount: number;
  maxAmount: number;
  interestRate: number;
  termMonths: number;
  currency: string;
  requirements: Omit<LoanRequirement, 'id'>[];
  fees: Omit<LoanFee, 'id'>[];
}

export interface UpdateLoanProductData {
  name?: string;
  description?: string;
  summary?: string;
  imageUrl?: string;
  currency?: string;
  minAmount?: number;
  maxAmount?: number;
  minTerm?: number;
  maxTerm?: number;
  termUnit?: 'days' | 'weeks' | 'months' | 'quarters' | 'years';
  interestRate?: number;
  interestType?: 'fixed' | 'variable';
  ratePeriod?: 'per_day' | 'per_month' | 'per_quarter' | 'per_year';
  amortizationMethod?: 'flat' | 'reducing_balance';
  repaymentFrequency?: 'weekly' | 'biweekly' | 'monthly' | 'quarterly';
  gracePeriodDays?: number;
  processingFeeRate?: number;
  processingFeeFlat?: number;
  lateFeeRate?: number;
  lateFeeFlat?: number;
  prepaymentPenaltyRate?: number;
  changeReason: string;
}

export interface CreateUserGroupData {
  name: string;
  slug?: string;
  description?: string;
  userIds?: string[];
}

// ===== LOAN APPLICATION TYPES =====

export type LoanApplicationStatus = 
  | "draft"
  | "submitted" 
  | "under_review"
  | "approved"
  | "offer_letter_sent"
  | "offer_letter_signed"
  | "offer_letter_declined"
  | "rejected"
  | "withdrawn"
  | "disbursed";

export type LoanPurpose =
  | "working_capital"
  | "business_expansion"
  | "equipment_purchase"
  | "inventory_financing"
  | "debt_consolidation"
  | "seasonal_financing"
  | "emergency_funding"
  | "other";

export type AuditAction =
  | "application_created"
  | "application_submitted"
  | "application_under_review"
  | "application_approved"
  | "application_rejected"
  | "application_withdrawn"
  | "application_disbursed"
  | "status_updated"
  | "snapshot_created"
  | "offer_letter_created"
  | "offer_letter_sent"
  | "document_requested";

export interface LoanApplicationItem {
  id: string;
  applicationNumber: string;
  userId: string;
  businessId?: string | null;
  loanProductId: string;
  coApplicantIds?: string | null;
  loanAmount: number;
  loanTerm: number;
  currency: string;
  purpose: LoanPurpose;
  purposeDescription?: string | null;
  status: LoanApplicationStatus;
  isBusinessLoan: boolean;
  submittedAt?: string | null;
  reviewedAt?: string | null;
  approvedAt?: string | null;
  disbursedAt?: string | null;
  rejectedAt?: string | null;
  rejectionReason?: string | null;
  statusReason?: string | null;
  lastUpdatedBy?: string | null;
  lastUpdatedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  
  // Related data
  user?: {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    email: string;
  };
  business?: {
    id: string;
    name: string;
  } | null;
  loanProduct?: {
    id: string;
    name: string;
    currency: string;
    minAmount: number;
    maxAmount: number;
    minTerm: number;
    maxTerm: number;
    termUnit: string;
    interestRate: number;
  };
  offerLetters?: OfferLetterItem[];
}

export interface LoanApplicationsFilters {
  page?: number;
  limit?: number;
  status?: LoanApplicationStatus;
  isBusinessLoan?: boolean;
  userId?: string;
  businessId?: string;
  loanProductId?: string;
}

export interface ListLoanApplicationsResponse {
  success: boolean;
  message: string;
  data: LoanApplicationItem[];
  pagination: PaginationInfo;
}

export interface UpdateLoanApplicationData {
  loanAmount?: number;
  loanTerm?: number;
  purpose?: LoanPurpose;
  purposeDescription?: string;
  coApplicantIds?: string[];
}

// ===== STATUS MANAGEMENT TYPES =====

export interface StatusResponse {
  success: boolean;
  message: string;
  data: {
    status: LoanApplicationStatus;
    statusReason: string | null;
    lastUpdatedBy: string | null;
    lastUpdatedAt: string | null;
    allowedTransitions: LoanApplicationStatus[];
  };
}

export interface StatusUpdateData {
  status: LoanApplicationStatus;
  reason?: string;
  rejectionReason?: string;
  metadata?: Record<string, any>;
}

export interface ApproveApplicationData {
  reason?: string;
  metadata?: Record<string, any>;
}

export interface RejectApplicationData {
  rejectionReason: string;
  reason?: string;
  metadata?: Record<string, any>;
}

export interface StatusHistoryResponse {
  success: boolean;
  message: string;
  data: Array<{
    status: string;
    reason: string | null;
    details: string | null;
    userId: string;
    userName: string;
    userEmail: string;
    createdAt: string;
    metadata: Record<string, any> | null;
  }>;
}

// ===== AUDIT TRAIL TYPES =====

export interface AuditTrailFilters {
  limit?: number;
  offset?: number;
  action?: AuditAction;
}

export interface AuditTrailResponse {
  success: boolean;
  message: string;
  data: Array<{
    id: string;
    loanApplicationId: string;
    userId: string;
    action: AuditAction;
    reason: string | null;
    details: string | null;
    metadata: string | null;
    beforeData: string | null;
    afterData: string | null;
    createdAt: string;
  }>;
}

export interface AuditSummaryResponse {
  success: boolean;
  message: string;
  data: {
    totalEntries: number;
    lastAction?: AuditAction;
    lastActionAt?: string;
    actions: Record<AuditAction, number>;
  };
}

// ===== DOCUMENT REQUEST TYPES =====

export interface DocumentRequestFilters {
  status?: "pending" | "fulfilled" | "overdue";
}

export interface DocumentStatsResponse {
  success: boolean;
  message: string;
  data: {
    total: number;
    pending: number;
    fulfilled: number;
    overdue: number;
  };
}

// ===== OFFER LETTER TYPES =====

export interface OfferLetterItem {
  id: string;
  loanApplicationId: string;
  offerNumber: string;
  version: number;
  offerAmount: number;
  offerTerm: number;
  interestRate: number;
  currency: string;
  specialConditions?: string | null;
  requiresGuarantor: boolean;
  requiresCollateral: boolean;
  docuSignEnvelopeId?: string | null;
  docuSignStatus: string;
  docuSignTemplateId?: string | null;
  offerLetterUrl?: string | null;
  signedDocumentUrl?: string | null;
  recipientEmail: string;
  recipientName: string;
  sentAt?: string | null;
  deliveredAt?: string | null;
  viewedAt?: string | null;
  signedAt?: string | null;
  declinedAt?: string | null;
  expiredAt?: string | null;
  expiresAt: string;
  reminderSentAt?: string | null;
  status: string;
  isActive: boolean;
  createdBy?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOfferLetterData {
  loanApplicationId: string;
  recipientEmail: string;
  recipientName: string;
  offerAmount: number;
  offerTerm: number;
  interestRate: number;
  currency: string;
  specialConditions?: string;
  requiresGuarantor?: boolean;
  requiresCollateral?: boolean;
  expiresAt: string;
}

export interface SendOfferLetterData {
  templateId?: string;
  customMessage?: string;
}

export interface SendOfferLetterResponse {
  success: boolean;
  message: string;
  data: {
    envelopeId: string;
    status: string;
    sentAt: string;
    viewUrl?: string;
  };
}

export interface UpdateOfferLetterData {
  offerAmount?: number;
  offerTerm?: number;
  interestRate?: number;
  specialConditions?: string;
  requiresGuarantor?: boolean;
  requiresCollateral?: boolean;
  expiresAt?: string;
}

export interface OfferLetterFilters {
  page?: number;
  limit?: number;
  status?: string;
  loanApplicationId?: string;
  docuSignStatus?: string;
}

export interface ListOfferLettersResponse {
  success: boolean;
  message: string;
  data: OfferLetterItem[];
  pagination: PaginationInfo;
}

// ===== SNAPSHOT TYPES =====

export interface SnapshotsResponse {
  success: boolean;
  message: string;
  data: Array<{
    id: string;
    loanApplicationId: string;
    createdBy: string;
    approvalStage: string;
    createdAt: string;
    snapshotData: {
      application: any;
      businessProfile?: any;
      personalDocuments: any[];
      businessDocuments: any[];
      offerLetters: any[];
      metadata: {
        createdAt: string;
        createdBy: string;
        approvalStage: string;
      };
    };
  }>;
}

export interface UpdateUserGroupData extends Partial<CreateUserGroupData> {
  id: string;
  addUserIds?: string[];
  removeUserIds?: string[];
}

export interface CreateOrganizationData {
  name: string;
  type: string;
  registrationNumber: string;
  taxId: string;
  address: Address;
  contactInfo: ContactInfo;
}

export interface UpdateOrganizationData extends Partial<CreateOrganizationData> {
  id: string;
}

export interface CreatePartnerData {
  name: string;
  type: string;
  description: string;
  contactInfo: ContactInfo;
}

export interface UpdatePartnerData extends Partial<CreatePartnerData> {
  id: string;
}

// Filter and search types
export interface LoanApplicationFilters {
  status?: string;
  userId?: string;
  loanProductId?: string;
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface UserFilters {
  isActive?: boolean;
  role?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface LoanProductFilters {
  isActive?: boolean;
  minAmount?: number;
  maxAmount?: number;
  currency?: string;
}

export interface OrganizationFilters {
  isActive?: boolean;
  type?: string;
}

export interface PartnerFilters {
  isActive?: boolean;
  type?: string;
}

export interface UserGroupFilters {
  isActive?: boolean;
}

// Common query parameters
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchParams {
  search?: string;
  filters?: Record<string, any>;
}

// Document types for your specific use case
export enum UserIdType {
  NATIONAL_ID = 'national_id',
  PASSPORT = 'passport'
}

export enum DocumentType {
  NATIONAL_ID_FRONT = 'national_id_front',
  NATIONAL_ID_BACK = 'national_id_back',
  PASSPORT_BIO_PAGE = 'passport_bio_page',
  PERSONAL_TAX_DOCUMENT = 'personal_tax_document',
  USER_PHOTO = 'user_photo'
}

// Interface for a personal document
export interface PersonalDocument {
  docType: DocumentType;
  docUrl: string;
}

// Interface for updating user documents
export interface UpdateUserAndDocumentsBody {
  idNumber: string;
  taxNumber: string;
  idType: UserIdType;
  documents: PersonalDocument[];
}

export interface UpdateUserDocsResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    // other user data that might be returned
  };
}

// Response for listing documents
export interface ListDocumentsResponse {
  success: boolean;
  message: string;
  data: PersonalDocument[];
}

// Loan Products Types
export interface LoanProduct {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string;
  summary?: string;
  description?: string;
  currency: string;
  minAmount: number;
  maxAmount: number;
  minTerm: number;
  maxTerm: number;
  termUnit: 'days' | 'weeks' | 'months' | 'quarters' | 'years';
  interestRate: number;
  interestType: 'fixed' | 'variable';
  ratePeriod: 'per_day' | 'per_month' | 'per_quarter' | 'per_year';
  amortizationMethod: 'flat' | 'reducing_balance';
  repaymentFrequency: 'weekly' | 'biweekly' | 'monthly' | 'quarterly';
  processingFeeRate?: number;
  processingFeeFlat?: number;
  lateFeeRate?: number;
  lateFeeFlat?: number;
  prepaymentPenaltyRate?: number;
  gracePeriodDays: number;
  // Versioning fields
  version: number;
  status: 'draft' | 'active' | 'archived';
  changeReason?: string;
  approvedBy?: string;
  approvedAt?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ListLoanProductsResponse {
  success: boolean;
  message: string;
  data: LoanProduct[];
  pagination: PaginationInfo;
}

export interface LoanProductsFilters {
  // Pagination
  page?: number;
  limit?: number;
  
  // Status filtering
  status?: 'draft' | 'active' | 'archived';
  includeArchived?: boolean;
  
  // Currency and amount filtering
  currency?: string;
  minAmount?: number;
  maxAmount?: number;
  
  // Term filtering
  minTerm?: number;
  maxTerm?: number;
  termUnit?: 'days' | 'weeks' | 'months' | 'quarters' | 'years';
  
  // Interest and repayment filtering
  interestType?: 'fixed' | 'variable';
  ratePeriod?: 'per_day' | 'per_month' | 'per_quarter' | 'per_year';
  amortizationMethod?: 'flat' | 'reducing_balance';
  repaymentFrequency?: 'weekly' | 'biweekly' | 'monthly' | 'quarterly';
  
  // Active status
  isActive?: boolean;
  
  // Search
  search?: string;
  
  // Sorting
  sortBy?: 'name' | 'createdAt' | 'updatedAt' | 'interestRate' | 'minAmount' | 'maxAmount';
  sortOrder?: 'asc' | 'desc';
}

// Types for adding documents
export type AddDocumentsBody = PersonalDocument | PersonalDocument[];
export interface AddDocumentsResponse {
  success: boolean;
  message: string;
}

// ===== SME (Small and Medium-sized Enterprise) TYPES =====

export type SMEOnboardingStatus = 'draft' | 'pending_invitation' | 'active';

export interface SMEUser {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  dob?: string;
  gender?: string;
  position?: string;
  onboardingStatus: SMEOnboardingStatus;
  onboardingStep?: number;
  currentStep?: number;
  completedSteps?: number[];
  business?: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface SMEUserDetail {
  userId: string;
  currentStep: number;
  completedSteps: number[];
  user: {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    dob?: string;
    gender?: string;
    position?: string;
    onboardingStatus: SMEOnboardingStatus;
  };
  business: {
    id: string;
    name: string;
    entityType: string | null;
    logo: string | null;
    sectors: string[] | null;
    description: string | null;
    yearOfIncorporation: number | null;
    city: string | null;
    country: string | null;
    companyHQ: string | null;
    // Step 2 extensions
    noOfEmployees: number | null;
    website: string | null;
    selectionCriteria: string[] | null;
    userGroupIds: string[]; // all linked programs
    // Step 3 extensions
    countriesOfOperation: string[] | null;
    registeredOfficeAddress: string | null;
    registeredOfficeCity: string | null;
    registeredOfficeZipCode: string | null;
    // Media
    videoLinks: { url: string; source: string | null }[];
    businessPhotos: string[];
    createdAt: string | null;
    updatedAt: string | null;
  };
}

export interface SMEOnboardingState {
  userId: string;
  currentStep: number;
  completedSteps: number[];
  user: {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    dob?: string;
    gender?: string;
    position?: string;
    onboardingStatus: SMEOnboardingStatus;
  };
  business: {
    id: string;
    name: string;
    countriesOfOperation?: string[];
    companyHQ?: string;
    city?: string;
    registeredOfficeAddress?: string;
    registeredOfficeCity?: string;
    registeredOfficeZipCode?: string;
  } | null;
}

export interface ListSMEUsersResponse {
  items: SMEUser[];
  total: number;
  page: number;
  limit: number;
}

export interface SMEUsersFilters {
  page?: number;
  limit?: number;
  onboardingStatus?: SMEOnboardingStatus;
  search?: string;
}

// ===== ENTREPRENEUR LIST TYPES =====

export interface EntrepreneurListItem {
  // Identity
  userId: string;
  createdAt: string;

  // Registered user
  imageUrl: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;

  // Onboarding / status
  onboardingStatus: SMEOnboardingStatus;
  businessProfileProgress: number;

  // Business summary
  business: {
    id: string;
    name: string;
    sectors: string[];
    country: string | null;
  } | null;

  // User groups (programs)
  userGroups: {
    id: string;
    name: string;
  }[];

  // Aggregated flags
  hasCompleteProfile: boolean;
  hasPendingActivation: boolean;
}

export interface EntrepreneurListResponse {
  items: EntrepreneurListItem[];
  total: number;
  page?: number;
  limit?: number;
}

export interface EntrepreneurListFilters {
  page?: number;
  limit?: number;
  onboardingStatus?: SMEOnboardingStatus;
  search?: string;
}

// Step 1: Create/Update User Info
export interface CreateSMEUserData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  dob: string; // ISO date format: YYYY-MM-DD
  gender: string;
  position: string;
}

export interface CreateSMEUserResponse {
  userId: string;
  onboardingState: SMEOnboardingState;
}

// Step 2: Business Basic Info
export interface VideoLink {
  url: string;
  source?: string;
}

export interface SaveBusinessBasicInfoData {
  logo?: string;
  name: string;
  entityType: string;
  year: number; // yearOfIncorporation
  sectors: string[];
  description?: string;
  userGroupId?: string;
  criteria?: string[];
  noOfEmployees?: number;
  website?: string;
  videoLinks?: VideoLink[];
  businessPhotos?: string[]; // Max 5 photo URLs
}

// Step 3: Location Info
export interface SaveLocationInfoData {
  countriesOfOperation: string[];
  companyHQ?: string;
  city?: string;
  registeredOfficeAddress?: string;
  registeredOfficeCity?: string;
  registeredOfficeZipCode?: string;
}

// Step 4: Personal Documents
export interface PersonalDocumentData {
  docType: string;
  docUrl: string;
}

export interface SavePersonalDocumentsData {
  documents: PersonalDocumentData[];
}

// Step 5: Company Info Documents
export interface CompanyDocumentData {
  docType: string; // e.g., "CR1", "CR2", "CR8", "CR12", "certificate_of_incorporation"
  docUrl: string;
  isPasswordProtected?: boolean;
  docPassword?: string;
}

export interface SaveCompanyDocumentsData {
  documents: CompanyDocumentData[];
}

// Step 6: Financial Documents
export interface FinancialDocumentData {
  docType: string; // e.g., "annual_bank_statement", "audited_financial_statements"
  docUrl: string;
  docYear?: number;
  docBankName?: string;
  isPasswordProtected?: boolean;
  docPassword?: string;
}

export interface SaveFinancialDocumentsData {
  documents: FinancialDocumentData[];
}

// Step 7: Permits & Pitch Deck
export interface PermitDocumentData {
  docType: string; // e.g., "business_permit", "pitch_deck", "business_plan"
  docUrl: string;
  isPasswordProtected?: boolean;
  docPassword?: string;
}

export interface SavePermitsData {
  documents: PermitDocumentData[];
}

// Send Invitation
export interface SendInvitationResponse {
  success: boolean;
  invitationId: string;
  message: string;
}
