"use client";

import React from "react";
import { Control } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoanProduct } from "@/lib/api/types";

interface LoanProductStructureSectionProps {
  control: Control<Partial<LoanProduct>>;
}

export function LoanProductStructureSection({
  control,
}: LoanProductStructureSectionProps) {
  return (
    <div className="bg-white">
      <div className="p-6 pb-0">
        <h3 className="text-lg font-semibold text-midnight-blue">
          Loan Structure
        </h3>
        <p className="text-sm text-primaryGrey-400 mt-1">
          Configure the loan structure and repayment terms
        </p>
      </div>
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={control}
            name="termUnit"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-midnight-blue">
                  Term Unit *
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select term unit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="days">Days</SelectItem>
                    <SelectItem value="weeks">Weeks</SelectItem>
                    <SelectItem value="months">Months</SelectItem>
                    <SelectItem value="quarters">Quarters</SelectItem>
                    <SelectItem value="years">Years</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription className="text-xs text-primaryGrey-400">
                  Unit for loan term duration
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="interestType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-midnight-blue">
                  Interest Type *
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select interest type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed Rate</SelectItem>
                    <SelectItem value="variable">Variable Rate</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription className="text-xs text-primaryGrey-400">
                  Type of interest rate for the loan
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={control}
            name="ratePeriod"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-midnight-blue">
                  Rate Period *
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select rate period" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="per_day">Per Day</SelectItem>
                    <SelectItem value="per_month">Per Month</SelectItem>
                    <SelectItem value="per_quarter">Per Quarter</SelectItem>
                    <SelectItem value="per_year">Per Year</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription className="text-xs text-primaryGrey-400">
                  Period for interest rate calculation
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="amortizationMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-midnight-blue">
                  Amortization Method *
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select amortization method" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="flat">Flat Rate</SelectItem>
                    <SelectItem value="reducing_balance">Reducing Balance</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription className="text-xs text-primaryGrey-400">
                  Method for calculating loan amortization
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={control}
            name="repaymentFrequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-midnight-blue">
                  Repayment Frequency *
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select repayment frequency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="biweekly">Bi-weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription className="text-xs text-primaryGrey-400">
                  Frequency of loan repayments
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
