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
export interface LoanProduct {
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
export interface CreateLoanProductData {
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

export interface UpdateLoanProductData extends Partial<CreateLoanProductData> {
  id: string;
}

export interface CreateUserGroupData {
  name: string;
  description: string;
  permissions: string[];
  users: string[];
}

export interface UpdateUserGroupData extends Partial<CreateUserGroupData> {
  id: string;
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

// Types for adding documents
export type AddDocumentsBody = PersonalDocument | PersonalDocument[];
export interface AddDocumentsResponse {
  success: boolean;
  message: string;
}
