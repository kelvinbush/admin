"use client";

import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { loanFeeFormValidation } from "@/app/(dashboard)/loan-fees/_components/loan-fee-form.validation";
import { useZodForm } from "@/lib/hooks/use-zod-form";
import { z } from "zod";
import { ValueBandTable } from "./value-band-table";
import { PeriodBandTable } from "./period-band-table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { GradientButton } from "./gradient-button";
import { cn } from "@/lib/utils";
import {
  type SelectOption,
  SelectWithDescription,
} from "@/components/ui/select-with-description";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

const calculationMethods: SelectOption[] = [
  {
    label: "Rate",
    value: "Rate",
    description: "Fee calculated as a percentage of the loan amount",
  },
  {
    label: "Fixed Amount",
    value: "Fixed Amount",
    description: "Fee is a fixed amount regardless of loan size",
  },
  {
    label: "Fixed Amount Per Installment",
    value: "Fixed Amount Per Installment",
    description: "A fixed fee is applied to each loan installment",
  },
];
const collectionRules: SelectOption[] = [
  {
    label: "Upfront",
    value: "Upfront",
    description: "Fee is charged and paid before the loan is disbursed.",
  },
  {
    label: "Capitalized",
    value: "Capitalized",
    description: "Fee is added to the total loan balance and repaid over time.",
  },
  {
    label: "Deducted",
    value: "Deducted",
    description:
      "Fee is subtracted from the disbursed loan amount before funds are sent to the borrower.",
  },
  {
    label: "Paid with loan",
    value: "Paid with loan",
    description:
      "Fee is paid in installments along with the regular loan payments.",
  },
  {
    label: "Security Deposit (BNPL or IPF loans)",
    value: "Security Deposit",
    description:
      "Fee is held as a deposit and may be refunded depending on terms.",
  },
];
const allocationMethods: SelectOption[] = [
  {
    label: "Cleared in the 1st installment",
    value: "Cleared in the 1st installment",
    description: "The entire fee is paid with the first loan payment",
  },
  {
    label: "Spread across installments",
    value: "Spread across installments",
    description: "The fee is distributed evenly across all loan payments",
  },
];
const calculationBases: SelectOption[] = [
  {
    label: "Principal",
    value: "Principal",
    description: "Calculate fee based on the initial loan amount",
  },
  {
    label: "Principal + Interest",
    value: "Principal + Interest",
    description: "Calculate fee based on the loan amount plus interest",
  },
  {
    label: "Total Disbursed Amount",
    value: "Total Disbursed Amount",
    description:
      "Calculate fee based on the total amount disbursed to the borrower",
  },
];
const receivableAccounts: SelectOption[] = [
  {
    label: "10601600 - Credit related fees",
    value: "10601600",
    description: "Account for tracking credit-related fee receivables",
  },
  {
    label: "10601700 - Penalties",
    value: "10601700",
    description: "Account for tracking penalty fee receivables",
  },
];
const incomeAccounts: SelectOption[] = [
  {
    label: "40101200 - Credit related fees",
    value: "40101200",
    description: "Account for recording credit-related fee income",
  },
  {
    label: "40101300 - Penalties",
    value: "40101300",
    description: "Account for recording penalty fee income",
  },
];

type FormValues = z.infer<typeof loanFeeFormValidation>;

export default function LoanFeeForm() {
  // Use the type-safe form hook with Zod schema
  const form = useZodForm({
    schema: loanFeeFormValidation,
    defaultValues: {
      name: "",
      calculationMethod: "Fixed Amount",
      applicationRule: "Fixed value",
      valueBands: [],
      periodBands: [],
      collectionRule: "",
      allocationMethod: "",
      calculationBasis: "",
      receivableAccount: "",
      incomeAccount: "",
      amount: undefined,
    },
    mode: "onBlur",
  });

  const calculationMethod = form.watch("calculationMethod");
  const applicationRule = form.watch("applicationRule");
  const collectionRule = form.watch("collectionRule");

  // Conditional rendering logic
  const showCollectionRule =
    calculationMethod !== "Fixed Amount Per Installment";
  const showAllocationMethod =
    showCollectionRule && collectionRule === "Paid with loan";
  const showCalculationBasis = calculationMethod === "Rate";
  const showAmount =
    calculationMethod !== "Fixed Amount Per Installment" &&
    applicationRule !== "Graduated by value" &&
    applicationRule !== "Graduated by period (months)";
  const showRate = calculationMethod === "Rate";
  const showValueBands = applicationRule === "Graduated by value";
  const showPeriodBands = applicationRule === "Graduated by period (months)";

  const onSubmit = (data: FormValues) => {
    // Submit logic here
    console.log("Form submitted:", data);
    // Here you would typically call your API to save the loan fee
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="container mx-auto bg-white p-8 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold mb-2">Create loan fee</h2>
        <p className="mb-6 text-gray-600">
          Fill in the details below to create a new loan fee
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Loan fee name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter loan fee name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="calculationMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Calculation method</FormLabel>
                <FormControl>
                  <SelectWithDescription
                    options={calculationMethods}
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Select calculation method"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div
          className={cn(
            "mt-4 flex gap-6",
            showValueBands || showPeriodBands ? "" : "mb-6",
          )}
        >
          <FormField
            control={form.control}
            name="applicationRule"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel required>Fee application rule</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="grid grid-cols-3 gap-4"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Fixed value" />
                      </FormControl>
                      <FormLabel className="font-normal">Fixed value</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Graduated by value" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Graduated by value
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Graduated by period (months)" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Graduated by period (months)
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {showValueBands && (
          <div className="mt-6 mb-6">
            <FormField
              control={form.control}
              name="valueBands"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ValueBandTable
                      bands={field.value || []}
                      onChange={field.onChange}
                      feeLabel={
                        calculationMethod === "Rate"
                          ? "RATE (%)"
                          : "AMOUNT (EUR)"
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {showPeriodBands && (
          <div className="mt-6 mb-6">
            <FormField
              control={form.control}
              name="periodBands"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <PeriodBandTable
                      bands={field.value || []}
                      onChange={field.onChange}
                      feeLabel={
                        calculationMethod === "Rate"
                          ? "RATE (%)"
                          : "AMOUNT (EUR)"
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {showCollectionRule && (
            <FormField
              control={form.control}
              name="collectionRule"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Fee collection rule</FormLabel>
                  <FormControl>
                    <SelectWithDescription
                      options={collectionRules}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Select fee collection rule"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {showAllocationMethod && (
            <FormField
              control={form.control}
              name="allocationMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Fee allocation method</FormLabel>
                  <FormControl>
                    <SelectWithDescription
                      options={allocationMethods}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Select allocation method"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {showCalculationBasis && (
            <FormField
              control={form.control}
              name="calculationBasis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Calculate fee on</FormLabel>
                  <FormControl>
                    <SelectWithDescription
                      options={calculationBases}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Select calculation base"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="receivableAccount"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-1.5">
                  <FormLabel required>Receivable account</FormLabel>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs bg-gray-800 text-white">
                        <p>Account to be debited as per the Presta Chart of Accounts</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <FormControl>
                  <SelectWithDescription
                    options={receivableAccounts}
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Select receivable account"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="incomeAccount"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-1.5">
                  <FormLabel required>Income account</FormLabel>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs bg-gray-800 text-white">
                        <p>Account to be credited as per the Presta Chart of Accounts</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <FormControl>
                  <SelectWithDescription
                    options={incomeAccounts}
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Select income account"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {(showAmount || showRate) && (
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>
                    {showRate ? "Rate (%)" : "Amount (EUR)"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={showRate ? "Enter rate" : "Enter value"}
                      onChange={(e) => {
                        // Convert empty string to undefined, otherwise parse as float
                        const value =
                          e.target.value === ""
                            ? undefined
                            : parseFloat(e.target.value);
                        field.onChange(value);
                      }}
                      // Handle undefined value for controlled input
                      value={field.value === undefined ? "" : field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <div className="flex justify-between mt-8">
          <GradientButton type="submit" className="w-full">
            Submit
          </GradientButton>
        </div>
        <div className="flex justify-center mt-4">
          <a href="#" className="text-center underline">
            &larr; Back
          </a>
        </div>
      </form>
    </Form>
  );
}
