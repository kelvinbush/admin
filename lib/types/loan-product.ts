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
  loanProductReference?: string;
}

export interface CreateLoanProductRequest {
  loanName: string;
  description: string;
  partnerReference: string;
  integrationType: number;
  loanProductType: number;
  loanPriceMax: number;
  loanInterest: number;
}

export interface GetAllLoanProductsResponse {
  loanProductList: LoanProduct[];
  status: string;
  message: string;
}
