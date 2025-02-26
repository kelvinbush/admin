export const PageRoutes = {
  BUSINESS_PROFILE: "/entrepreneurs/:userId",
  BUSINESS_PROFILE_COMPANY_DETAILS: "/entrepreneurs/:userId/company-details",
  BUSINESS_PROFILE_COMPANY_DETAILS_INFO:
    "/entrepreneurs/:userId/company-details/information",
  BUSINESS_PROFILE_COMPANY_DETAILS_ADDRESS:
    "/entrepreneurs/:userId/company-details/address",
  BUSINESS_PROFILE_COMPANY_DETAILS_FINANCIALS:
    "/entrepreneurs/:userId/company-details/financials",
  BUSINESS_PROFILE_COMPANY_DETAILS_OWNERSHIP:
    "/entrepreneurs/:userId/company-details/ownership",
  BUSINESS_PROFILE_TEAM_MEMBERS: "/entrepreneurs/:userId/team-members",
  BUSINESS_PROFILE_COMPANY_DOCUMENTS: "/entrepreneurs/:userId/documents",
  BUSINESS_PROFILE_COMPANY_BILLING: "/entrepreneurs/:userId/billing",
  BUSINESS_PROFILE_PERSONAL_INFORMATION:
    "/entrepreneurs/:userId/personal-information",
  FUNDING: "/funding",
  FUNDING_INVESTOR_OPPORTUNITIES: "/funding/investor-opportunities",
  FUNDING_MELANINKAPITAL_LOANS: "/funding/melaninkapital-loans",
  FUNDING_PARTNER_LOANS: "/funding/partner-loans",
} as const;
