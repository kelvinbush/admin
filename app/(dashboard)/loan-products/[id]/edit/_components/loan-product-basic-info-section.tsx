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
import { Textarea } from "@/components/ui/textarea";
import { LoanProduct } from "@/lib/api/types";

interface LoanProductBasicInfoSectionProps {
  control: Control<Partial<LoanProduct>>;
}

export function LoanProductBasicInfoSection({
  control,
}: LoanProductBasicInfoSectionProps) {
  return (
    <div className="bg-white">
      <div className="p-6 pb-0">
        <h3 className="text-lg font-semibold text-midnight-blue">
          Basic Information
        </h3>
        <p className="text-sm text-primaryGrey-400 mt-1">
          Update the basic details for your loan product
        </p>
      </div>
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-midnight-blue">
                  Product Name *
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Small Business Loan"
                    className="h-11"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-xs text-primaryGrey-400">
                  A clear, descriptive name for your loan product
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-midnight-blue">
                  URL Slug
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="small-business-loan"
                    className="h-11"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-xs text-primaryGrey-400">
                  URL-friendly identifier (auto-generated if empty)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-midnight-blue">
                Image URL
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="https://example.com/product-image.jpg"
                  className="h-11"
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-xs text-primaryGrey-400">
                Optional image to represent this loan product
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={control}
            name="summary"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-midnight-blue">
                  Summary
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Brief overview of the loan product..."
                    className="min-h-[100px] resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-xs text-primaryGrey-400">
                  Short description for quick reference
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-midnight-blue">
                  Description
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Detailed description of terms, conditions, and features..."
                    className="min-h-[100px] resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-xs text-primaryGrey-400">
                  Comprehensive details about the loan product
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
