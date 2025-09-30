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
import { Input } from "@/components/ui/input";
import { LoanProduct } from "@/lib/api/types";

interface LoanProductFeesSectionProps {
  control: Control<Partial<LoanProduct>>;
}

export function LoanProductFeesSection({
  control,
}: LoanProductFeesSectionProps) {
  return (
    <div className="bg-white">
      <div className="p-6 pb-0">
        <h3 className="text-lg font-semibold text-midnight-blue">
          Fees & Charges
        </h3>
        <p className="text-sm text-primaryGrey-400 mt-1">
          Configure fees and charges for the loan product
        </p>
      </div>
      <div className="p-6 space-y-6">
        {/* Processing Fee */}
        <div>
          <h4 className="font-medium text-midnight-blue mb-4">Processing Fee</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={control}
              name="processingFeeRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-midnight-blue">
                    Processing Fee Rate (%)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="2.5"
                      className="h-11"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-primaryGrey-400">
                    Percentage-based processing fee
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="processingFeeFlat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-midnight-blue">
                    Processing Fee (Flat)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="100"
                      className="h-11"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-primaryGrey-400">
                    Fixed processing fee amount
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Late Fee */}
        <div>
          <h4 className="font-medium text-midnight-blue mb-4">Late Fee</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={control}
              name="lateFeeRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-midnight-blue">
                    Late Fee Rate (%)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="5.0"
                      className="h-11"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-primaryGrey-400">
                    Percentage-based late fee
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="lateFeeFlat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-midnight-blue">
                    Late Fee (Flat)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="50"
                      className="h-11"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-primaryGrey-400">
                    Fixed late fee amount
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Prepayment Penalty */}
        <div>
          <h4 className="font-medium text-midnight-blue mb-4">Prepayment Penalty</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={control}
              name="prepaymentPenaltyRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-midnight-blue">
                    Prepayment Penalty Rate (%)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="2.0"
                      className="h-11"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-primaryGrey-400">
                    Penalty for early loan repayment
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
