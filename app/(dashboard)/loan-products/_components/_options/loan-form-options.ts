export const repaymentCycleOptions = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

export const gracePeriodOptions = [
  { value: "days", label: "days" },
  { value: "weeks", label: "weeks" },
  { value: "months", label: "months" },
];

export const interestRatePeriodOptions = [
  { value: "per_month", label: "per month" },
  { value: "per_annum", label: "per annum" },
];

export const interestCalculationMethodOptions = [
  {
    value: "flat",
    label: "Flat",
    description:
      "Interest is calculated on the initial loan amount throughout the loan term",
  },
  {
    value: "declining_balance",
    label: "Declining Balance",
    description: "Interest is calculated on the remaining loan balance",
  },
];

export const interestCollectionMethodOptions = [
  {
    value: "upfront",
    label: "Upfront",
    description: "Interest is collected at loan disbursement",
  },
  {
    value: "with_repayment",
    label: "With Repayment",
    description: "Interest is collected with each repayment installment",
  },
];

export const interestRecognitionCriteriaOptions = [
  {
    value: "cash_basis",
    label: "Cash Basis",
    description: "Interest is recognized only when payment is received",
  },
  {
    value: "accrual_basis",
    label: "Accrual Basis",
    description:
      "Interest is recognized as it is earned, regardless of when payment is received",
  },
];
