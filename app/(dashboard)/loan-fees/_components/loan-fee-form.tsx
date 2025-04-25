"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { SelectWithDescription, type SelectOption } from "@/components/ui/select-with-description";

const calculationMethods = [
  { label: "Rate", value: "Rate" },
  { label: "Fixed Amount", value: "Fixed Amount" },
  {
    label: "Fixed Amount Per Installment",
    value: "Fixed Amount Per Installment",
  },
];
const applicationRules = [
  { label: "Fixed value", value: "Fixed value" },
  {
    label: "Graduated by value",
    value: "Graduated by value",
  },
  {
    label: "Graduated by period (months)",
    value: "Graduated by period (months)",
  },
];
const collectionRules: SelectOption[] = [
  { 
    label: "Upfront", 
    value: "Upfront",
    description: "Fee is charged and paid before the loan is disbursed."
  },
  { 
    label: "Capitalized", 
    value: "Capitalized",
    description: "Fee is added to the total loan balance and repaid over time."
  },
  { 
    label: "Deducted", 
    value: "Deducted",
    description: "Fee is subtracted from the disbursed loan amount before funds are sent to the borrower."
  },
  { 
    label: "Paid with loan", 
    value: "Paid with loan",
    description: "Fee is paid in installments along with the regular loan payments."
  },
  { 
    label: "Security Deposit (BNPL or IPF loans)", 
    value: "Security Deposit",
    description: "Fee is held as a deposit and may be refunded depending on terms."
  },
];
const allocationMethods = [
  {
    label: "Cleared in the 1st installment",
    value: "Cleared in the 1st installment",
  },
  { label: "Other", value: "Other" },
];
const calculationBases = [
  { label: "Principal", value: "Principal" },
  {
    label: "Outstanding Principal",
    value: "Outstanding Principal",
  },
];
const receivableAccounts = [
  { label: "10601600 - Credit related fees", value: "10601600" },
];
const incomeAccounts = [
  { label: "40101200 - Credit related fees", value: "40101200" },
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
                <FormLabel required>Fee calculation method</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select calculation method" />
                    </SelectTrigger>
                    <SelectContent>
                      {calculationMethods.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select fee allocation method" />
                      </SelectTrigger>
                      <SelectContent>
                        {allocationMethods.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Calculate fee on" />
                      </SelectTrigger>
                      <SelectContent>
                        {calculationBases.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                <FormLabel required>Receivable account</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select receivable account" />
                    </SelectTrigger>
                    <SelectContent>
                      {receivableAccounts.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                <FormLabel required>Income account</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select income account" />
                    </SelectTrigger>
                    <SelectContent>
                      {incomeAccounts.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
