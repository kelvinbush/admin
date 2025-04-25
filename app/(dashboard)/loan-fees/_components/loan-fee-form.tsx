"use client";

import { Button } from "@/components/ui/button";
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
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { loanFeeFormValidation } from "@/app/(dashboard)/loan-fees/_components/loan-fee-form.validation";
import { useZodForm } from "@/lib/hooks/use-zod-form";
import { z } from "zod";

const calculationMethods = [
  { label: "Fixed Amount", value: "Fixed Amount" },
  { label: "Rate", value: "Rate" },
  {
    label: "Fixed Amount Per Installment",
    value: "Fixed Amount Per Installment",
  },
];
const applicationRules = [
  { label: "Fixed value", value: "Fixed value" },
  { label: "Graduated by value", value: "Graduated by value" },
  {
    label: "Graduated by period (months)",
    value: "Graduated by period (months)",
  },
];
const collectionRules = [
  { label: "Paid with loan", value: "Paid with loan" },
  { label: "Other", value: "Other" },
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
  { label: "Outstanding Principal", value: "Outstanding Principal" },
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
  const collectionRule = form.watch("collectionRule");

  // Conditional rendering logic
  const showCollectionRule =
    calculationMethod !== "Fixed Amount Per Installment";
  const showAllocationMethod =
    showCollectionRule && collectionRule === "Paid with loan";
  const showCalculationBasis = calculationMethod === "Rate";
  const showAmount = calculationMethod !== "Fixed Amount Per Installment";
  const showRate = calculationMethod === "Rate";

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
        <div className="mt-4 flex gap-6">
          {applicationRules.map((opt) => (
            <FormField
              key={opt.value}
              control={form.control}
              name="applicationRule"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-2">
                  <FormControl>
                    <input
                      type="radio"
                      id={`app-rule-${opt.value}`}
                      value={opt.value}
                      checked={field.value === opt.value}
                      onChange={() => field.onChange(opt.value)}
                    />
                  </FormControl>
                  <FormLabel
                    htmlFor={`app-rule-${opt.value}`}
                    className="font-normal cursor-pointer"
                  >
                    {opt.label}
                  </FormLabel>
                </FormItem>
              )}
            />
          ))}
        </div>
        {showCollectionRule && (
          <FormField
            control={form.control}
            name="collectionRule"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Fee collection rule</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select fee collection rule" />
                    </SelectTrigger>
                    <SelectContent>
                      {collectionRules.map((opt) => (
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
        <div className="flex justify-between mt-8">
          <Button type="submit" className="w-full">
            Submit
          </Button>
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
