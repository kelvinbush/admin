export const loanTypeOptions = [
  {
    value: "0",
    label: "Secured",
    description: "Loan backed by collateral or assets",
  },
  {
    value: "1",
    label: "Unsecured",
    description: "Loan that doesn't require collateral",
  },
];

export const processingMethodOptions = [
  {
    value: "0",
    label: "Normal",
    description: "Standard loan integration type",
  },
  {
    value: "1",
    label: "Presta",
    description: "Presta loan integration type",
  },
];

export const periodOptions = [
  {
    value: "DAILY",
    label: "Per Day",
    description: "Interest is calculated daily",
  },
  {
    value: "WEEKLY",
    label: "Per Week",
    description: "Interest is calculated weekly",
  },
  {
    value: "MONTHLY",
    label: "Per Month",
    description: "Interest is calculated monthly",
  },
  {
    value: "YEARLY",
    label: "Per Year",
    description: "Interest is calculated yearly",
  },
];

export const termUnitOptions = [
  {
    value: "DAYS",
    label: "Days",
    description: "Loan term in days",
  },
  {
    value: "WEEKS",
    label: "Weeks",
    description: "Loan term in weeks",
  },
  {
    value: "MONTHS",
    label: "Months",
    description: "Loan term in months",
  },
  {
    value: "YEARS",
    label: "Years",
    description: "Loan term in years",
  },
];

export const interestCalculationMethodOptions = [
  {
    value: "FLAT_RATE",
    label: "Flat Rate",
    description:
      "Interest is calculated on the original loan amount for the entire duration of the loan.",
  },
  {
    value: "REDUCING_BALANCE",
    label: "Reducing Balance",
    description:
      "Interest is calculated on the remaining loan balance, reducing as the loan is repaid.",
  },
  {
    value: "COMPOUND_INTEREST",
    label: "Compound Interest",
    description:
      "Interest is calculated on the principal plus any accumulated interest.",
  },
];
