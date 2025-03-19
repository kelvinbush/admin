export interface Partner {
  companyName: string;
  companyReference: string;
  adminReference?: string;
}

export interface CreatePartnerRequest {
  adminguid: string;
  companyname: string;
}

export interface UpdatePartnerRequest {
  companyName: string;
  companyReference: string;
  adminReference: string;
}

export interface DeletePartnerRequest {
  companyReference: string;
  adminReference: string;
}
