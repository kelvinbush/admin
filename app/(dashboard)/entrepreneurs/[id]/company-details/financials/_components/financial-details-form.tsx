"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { InputWithCurrency } from "@/components/ui/input-with-currency";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useState } from "react";

const financialDetailsSchema = z.object({
  averageMonthlyTurnover: z.string().optional(),
  averageMonthlyTurnoverCurrency: z.string().optional(),
  averageYearlyTurnover: z.string().optional(),
  averageYearlyTurnoverCurrency: z.string().optional(),
  hasBorrowingHistory: z.enum(["yes", "no"]).optional(),
  amountBorrowed: z.string().optional(),
  amountBorrowedCurrency: z.string().optional(),
  loanStatus: z.enum(["fully-repaid", "currently-repaying", "defaulted"]).optional(),
  defaultReason: z.string().max(100, "Reason must be 100 characters or less").optional(),
}).refine((data) => {
  // If hasBorrowingHistory is "yes", amountBorrowed is required
  if (data.hasBorrowingHistory === "yes" && !data.amountBorrowed) {
    return false;
  }
  return true;
}, {
  message: "Amount borrowed is required",
  path: ["amountBorrowed"],
}).refine((data) => {
  // If loanStatus is "defaulted", defaultReason is required
  if (data.loanStatus === "defaulted" && !data.defaultReason) {
    return false;
  }
  return true;
}, {
  message: "Reason for defaulting is required",
  path: ["defaultReason"],
});

type FinancialDetailsFormData = z.infer<typeof financialDetailsSchema>;

interface FinancialDetailsFormProps {
  initialData?: Partial<FinancialDetailsFormData>;
}

export function FinancialDetailsForm({ initialData }: FinancialDetailsFormProps) {
  const [defaultReasonLength, setDefaultReasonLength] = useState(
    initialData?.defaultReason?.length || 0
  );
  
  // Synchronized currency state - all currency inputs share the same value
  const [currency, setCurrency] = useState(initialData?.averageMonthlyTurnoverCurrency || "KES");

  const form = useForm<FinancialDetailsFormData>({
    resolver: zodResolver(financialDetailsSchema),
    defaultValues: {
      averageMonthlyTurnover: initialData?.averageMonthlyTurnover || "",
      averageMonthlyTurnoverCurrency: currency,
      averageYearlyTurnover: initialData?.averageYearlyTurnover || "",
      averageYearlyTurnoverCurrency: currency,
      hasBorrowingHistory: initialData?.hasBorrowingHistory,
      amountBorrowed: initialData?.amountBorrowed || "",
      amountBorrowedCurrency: currency,
      loanStatus: initialData?.loanStatus,
      defaultReason: initialData?.defaultReason || "",
    },
  });

  const hasBorrowingHistory = form.watch("hasBorrowingHistory");
  const loanStatus = form.watch("loanStatus");

  // Update all currency fields when one changes
  const handleCurrencyChange = (newCurrency: string) => {
    setCurrency(newCurrency);
    form.setValue("averageMonthlyTurnoverCurrency", newCurrency);
    form.setValue("averageYearlyTurnoverCurrency", newCurrency);
    form.setValue("amountBorrowedCurrency", newCurrency);
  };

  const onSubmit = (data: FinancialDetailsFormData) => {
    console.log("Form data:", data);
    // TODO: Submit form data to API
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-2xl text-midnight-blue mb-2">
          Financial Details
        </h2>
        <div className="h-px bg-primaryGrey-100 flex-1" />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Average Monthly Turnover */}
          <FormField
            control={form.control}
            name="averageMonthlyTurnover"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primaryGrey-400">
                  Average monthly turnover
                </FormLabel>
                <FormControl>
                  <InputWithCurrency
                    type="text"
                    placeholder="Enter value"
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    currencyValue={currency}
                    onCurrencyValueChange={handleCurrencyChange}
                    error={!!form.formState.errors.averageMonthlyTurnover}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Average Yearly Turnover */}
          <FormField
            control={form.control}
            name="averageYearlyTurnover"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primaryGrey-400">
                  Average yearly turnover
                </FormLabel>
                <FormControl>
                  <InputWithCurrency
                    type="text"
                    placeholder="Enter value"
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    currencyValue={currency}
                    onCurrencyValueChange={handleCurrencyChange}
                    error={!!form.formState.errors.averageYearlyTurnover}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
</div>
          {/* Has Borrowing History */}
          <FormField
            control={form.control}
            name="hasBorrowingHistory"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primaryGrey-400">
                  Does the business have any previous borrowing history?
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="borrowing-yes" />
                      <Label htmlFor="borrowing-yes" className="text-primaryGrey-400 font-normal cursor-pointer">
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="borrowing-no" />
                      <Label htmlFor="borrowing-no" className="text-primaryGrey-400 font-normal cursor-pointer">
                        No
                      </Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Amount Borrowed - Only show if hasBorrowingHistory is "yes" */}
          {hasBorrowingHistory === "yes" && (
            <FormField
              control={form.control}
              name="amountBorrowed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primaryGrey-400">
                    Amount borrowed
                  </FormLabel>
                  <FormControl>
                    <InputWithCurrency
                      type="text"
                      placeholder="Enter amount"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      currencyValue={currency}
                      onCurrencyValueChange={handleCurrencyChange}
                      error={!!form.formState.errors.amountBorrowed}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Loan Status - Only show if hasBorrowingHistory is "yes" */}
          {hasBorrowingHistory === "yes" && (
            <FormField
              control={form.control}
              name="loanStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primaryGrey-400">
                    What is the status of the most recent loan?
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="flex flex-col gap-3"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="fully-repaid" id="status-repaid" />
                        <Label htmlFor="status-repaid" className="text-primaryGrey-400 font-normal cursor-pointer">
                          Fully repaid
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="currently-repaying" id="status-repaying" />
                        <Label htmlFor="status-repaying" className="text-primaryGrey-400 font-normal cursor-pointer">
                          Currently being repaid
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="defaulted" id="status-defaulted" />
                        <Label htmlFor="status-defaulted" className="text-primaryGrey-400 font-normal cursor-pointer">
                          Defaulted
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Default Reason - Only show if loanStatus is "defaulted" */}
          {loanStatus === "defaulted" && (
            <FormField
              control={form.control}
              name="defaultReason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primaryGrey-400">
                    Reason for defaulting on the most recent loan
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Textarea
                        placeholder="Enter reason for defaulting"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          setDefaultReasonLength(e.target.value.length);
                        }}
                        maxLength={100}
                        className={cn(
                          "h-24 pr-16",
                          form.formState.errors.defaultReason && "border-red-500"
                        )}
                      />
                      <div className="absolute bottom-2 right-2 text-xs text-primaryGrey-400">
                        {defaultReasonLength}/100
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Action Button */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              size="lg"
              type="submit"
              className="text-white border-0"
              style={{
                background:
                  "linear-gradient(90deg, var(--green-500, #0C9) 0%, var(--pink-500, #F0459C) 100%)",
              }}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

