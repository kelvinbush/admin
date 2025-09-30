"use client";

import React from "react";
import { Control } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { CreateLoanProductFormData } from "@/lib/validations/loan-product";

interface ProductStatusSectionProps {
  control: Control<CreateLoanProductFormData>;
}

export function ProductStatusSection({ control }: ProductStatusSectionProps) {
  return (
    <div className="bg-white">
      <div className="p-6 pb-0">
        <h3 className="text-lg font-semibold text-midnight-blue">
          Product Status
        </h3>
        <p className="text-sm text-primaryGrey-400 mt-1">
          Control the availability of this loan product
        </p>
      </div>
      <div className="p-6">
        <FormField
          control={control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-6">
              <div className="space-y-0.5">
                <FormLabel className="text-base font-medium text-midnight-blue">
                  Active Product
                </FormLabel>
                <FormDescription className="text-sm text-primaryGrey-400">
                  Enable this loan product for new applications. Inactive
                  products won't be available for new loans.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="data-[state=checked]:bg-primary-green"
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
