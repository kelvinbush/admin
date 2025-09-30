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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CreateLoanProductFormData, LoanTermUnitEnum, InterestTypeEnum, InterestRatePeriodEnum } from "@/lib/validations/loan-product";

interface FinancialDetailsSectionProps {
  control: Control<CreateLoanProductFormData>;
}

export function FinancialDetailsSection({ control }: FinancialDetailsSectionProps) {
  return (
    <div className="bg-white">
      <div className="p-6 pb-0">
        <h3 className="text-lg font-semibold text-midnight-blue">
          Financial Details
        </h3>
        <p className="text-sm text-primaryGrey-400 mt-1">
          Set the core financial parameters for your loan product
        </p>
      </div>
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-midnight-blue">
                  Currency *
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="GBP">
                      GBP - British Pound
                    </SelectItem>
                    <SelectItem value="NGN">
                      NGN - Nigerian Naira
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="minAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-midnight-blue">
                  Minimum Amount *
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="1000"
                    className="h-11"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseFloat(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="maxAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-midnight-blue">
                  Maximum Amount *
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="100000"
                    className="h-11"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseFloat(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={control}
            name="minTerm"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-midnight-blue">
                  Minimum Term *
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="6"
                    className="h-11"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="maxTerm"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-midnight-blue">
                  Maximum Term *
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="60"
                    className="h-11"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="termUnit"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-midnight-blue">
                  Term Unit *
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select term unit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {LoanTermUnitEnum.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit.charAt(0).toUpperCase() + unit.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={control}
            name="interestRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-midnight-blue">
                  Interest Rate (%) *
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="12.5"
                    className="h-11"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseFloat(e.target.value) || 0)
                    }
                  />
                </FormControl>
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select interest type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {InterestTypeEnum.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="ratePeriod"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-midnight-blue">
                  Rate Period *
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select rate period" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {InterestRatePeriodEnum.map((period) => (
                      <SelectItem key={period} value={period}>
                        {period.replace('per_', 'Per ').replace('_', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
