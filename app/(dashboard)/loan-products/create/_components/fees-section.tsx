"use client";

import React from "react";
import { Control } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CreateLoanProductFormData } from "@/lib/validations/loan-product";

interface FeesSectionProps {
  control: Control<CreateLoanProductFormData>;
}

export function FeesSection({ control }: FeesSectionProps) {
  return (
    <div className="bg-white">
      <div className="p-6 pb-0">
        <h3 className="text-lg font-semibold text-midnight-blue">
          Fees & Charges
        </h3>
        <p className="text-sm text-primaryGrey-400 mt-1">
          Configure additional fees and charges for the loan
        </p>
      </div>
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h5 className="text-sm font-medium text-midnight-blue">
              Processing Fees
            </h5>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={control}
                name="processingFeeRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-primaryGrey-400">
                      Rate (%)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="2.5"
                        className="h-10"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            parseFloat(e.target.value) || undefined,
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="processingFeeFlat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-primaryGrey-400">
                      Flat Amount
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="100"
                        className="h-10"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            parseFloat(e.target.value) || undefined,
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h5 className="text-sm font-medium text-midnight-blue">Late Fees</h5>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={control}
                name="lateFeeRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-primaryGrey-400">
                      Rate (%)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="5.0"
                        className="h-10"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            parseFloat(e.target.value) || undefined,
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="lateFeeFlat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-primaryGrey-400">
                      Flat Amount
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="25"
                        className="h-10"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            parseFloat(e.target.value) || undefined,
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

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
                    onChange={(e) =>
                      field.onChange(
                        parseFloat(e.target.value) || undefined,
                      )
                    }
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
  );
}
