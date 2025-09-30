"use client";

import React from "react";
import { Control } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CreateLoanProductFormData, AmortizationMethodEnum, RepaymentFrequencyEnum } from "@/lib/validations/loan-product";

interface LoanStructureSectionProps {
  control: Control<CreateLoanProductFormData>;
}

export function LoanStructureSection({ control }: LoanStructureSectionProps) {
  return (
    <div className="bg-white">
      <div className="p-6 pb-0">
        <h3 className="text-lg font-semibold text-midnight-blue">
          Loan Structure
        </h3>
        <p className="text-sm text-primaryGrey-400 mt-1">
          Define how the loan will be structured and repaid
        </p>
      </div>
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={control}
            name="amortizationMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-midnight-blue">
                  Amortization Method *
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select amortization method" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {AmortizationMethodEnum.map((method) => (
                      <SelectItem key={method} value={method}>
                        {method.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription className="text-xs text-primaryGrey-400">
                  How the loan principal will be paid down
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="repaymentFrequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-midnight-blue">
                  Repayment Frequency *
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select repayment frequency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {RepaymentFrequencyEnum.map((frequency) => (
                      <SelectItem key={frequency} value={frequency}>
                        {frequency.charAt(0).toUpperCase() + frequency.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription className="text-xs text-primaryGrey-400">
                  How often payments are due
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name="gracePeriodDays"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-midnight-blue">
                Grace Period (Days)
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="30"
                  className="h-11 w-48"
                  {...field}
                  onChange={(e) =>
                    field.onChange(parseInt(e.target.value) || undefined)
                  }
                />
              </FormControl>
              <FormDescription className="text-xs text-primaryGrey-400">
                Number of days before first payment is due
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
