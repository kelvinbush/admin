"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SelectWithDescription, type SelectOption } from "@/components/ui/select-with-description";
import { MultiSelectDropdown, type MultiSelectOption } from "@/components/ui/multi-select-dropdown";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { countries } from "@/lib/data/countries";

const companyAddressSchema = z.object({
  countriesOfOperation: z.array(z.string()).min(1, "At least one country of operation is required"),
  companyHeadquarters: z.string().min(1, "Company headquarters is required"),
  city: z.string().min(1, "City is required"),
  registeredOfficeAddress: z.string().max(100, "Registered office address must be 100 characters or less").optional(),
  zipCode: z.string().optional(),
});

type CompanyAddressFormData = z.infer<typeof companyAddressSchema>;

// Convert countries to options for dropdowns
const countryOptions: SelectOption[] = countries.map((country) => ({
  value: country.code,
  label: country.name,
}));

const countryMultiSelectOptions: MultiSelectOption[] = countries.map((country) => ({
  value: country.code,
  label: country.name,
}));

interface CompanyAddressFormProps {
  initialData?: Partial<CompanyAddressFormData>;
}

export function CompanyAddressForm({ initialData }: CompanyAddressFormProps) {
  const [addressLength, setAddressLength] = useState(
    initialData?.registeredOfficeAddress?.length || 0
  );

  const form = useForm<CompanyAddressFormData>({
    resolver: zodResolver(companyAddressSchema),
    defaultValues: {
      countriesOfOperation: initialData?.countriesOfOperation || [],
      companyHeadquarters: initialData?.companyHeadquarters || "",
      city: initialData?.city || "",
      registeredOfficeAddress: initialData?.registeredOfficeAddress || "",
      zipCode: initialData?.zipCode || "",
    },
  });

  const onSubmit = (data: CompanyAddressFormData) => {
    console.log("Form data:", data);
    // TODO: Submit form data to API
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-2xl text-midnight-blue mb-2">
          Company Address
        </h2>
        <div className="h-px bg-primaryGrey-100 flex-1" />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Countries of Operation */}
          <FormField
            control={form.control}
            name="countriesOfOperation"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primaryGrey-400">
                  Countries of operation
                </FormLabel>
                <FormControl>
                  <MultiSelectDropdown
                    options={countryMultiSelectOptions}
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Select countries"
                    triggerClassName="h-10"
                    error={!!form.formState.errors.countriesOfOperation}
                    searchable
                    maxDisplay={2}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Company Headquarters and City - Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Company Headquarters */}
            <FormField
              control={form.control}
              name="companyHeadquarters"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primaryGrey-400">
                    Company headquarters
                  </FormLabel>
                  <FormControl>
                    <SelectWithDescription
                      options={countryOptions}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Select country"
                      triggerClassName="h-10"
                      error={!!form.formState.errors.companyHeadquarters}
                      searchable
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* City */}
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primaryGrey-400">
                    City
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter city"
                      {...field}
                      className={cn(
                        "h-10",
                        form.formState.errors.city && "border-red-500"
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Registered Office Address */}
          <FormField
            control={form.control}
            name="registeredOfficeAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primaryGrey-400">
                  Registered office address (optional)
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Textarea
                      placeholder="Enter registered office address"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setAddressLength(e.target.value.length);
                      }}
                      maxLength={100}
                      className={cn(
                        "h-24 pr-16",
                        form.formState.errors.registeredOfficeAddress && "border-red-500"
                      )}
                    />
                    <div className="absolute bottom-2 right-2 text-xs text-primaryGrey-400">
                      {addressLength}/100
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Zip Code */}
          <FormField
            control={form.control}
            name="zipCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primaryGrey-400">
                  Zip code (optional)
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter zip code"
                    {...field}
                    className={cn(
                      "h-10",
                      form.formState.errors.zipCode && "border-red-500"
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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

