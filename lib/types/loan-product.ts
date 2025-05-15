export type SupportedCurrency =
  | "KES"
  | "USD"
  | "EUR"
  | "GBP"
  | "CAD"
  | "AUD"
  | "JPY"
  | "CHF"
  | "CNY"
  | "HKD"
  | "SGD"
  | "NGN"
  | "ZAR"
  | "GHS"
  | "UGX"
  | "TZS"
  | "RWF"
  | "EGP"
  | "MAD";

export interface LoanProduct {
  loanName: string;
  description: string;
  id: number;
  partnerReference: string;
  partnerName: string;
  integrationType: number;
  loanProductType: number;
  loanPriceMax: number;
  loanInterest: number;
  status: number;
  currency?: SupportedCurrency;
  reference?: string;
}

export interface CreateLoanProductRequest {
  adminguid: string;
  loanName: string;
  description: string;
  partnerReference: string;
  integrationType: number;
  loanProductType: number;
  currency: SupportedCurrency;
  loanPriceMax: number;
  loanInterest: number;
  status: number;
  loanPriceMin: number;
  disbursementAccount: string;
  interestCalculationMethod: string;
  minimumTerm: string;
  maximumTerm: string;
  termPeriod: string;
  interestPeriod: string;
}

export interface GetAllLoanProductsResponse {
  loanProductList: LoanProduct[];
  status: string;
  message: string;
}

export interface DeleteLoanProductRequest {
  guid: string;
  productId: number;
}

export interface UpdateLoanProductStatusRequest {
  guid: string;
  productId: number;
  status: number;
}
