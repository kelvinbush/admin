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
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { countries } from "@/lib/data/countries";
import { useSMEOnboarding } from "../_context/sme-onboarding-context";
import { useSMEUser, useSaveLocationInfo } from "@/lib/api/hooks/sme";
import { toast } from "@/hooks/use-toast";

const businessLocationSchema = z.object({
  countriesOfOperation: z.array(z.string()).min(1, "At least one country of operation is required"),
  companyHeadquarters: z.string().min(1, "Company headquarters is required"),
  city: z.string().min(1, "City is required"),
  registeredOfficeAddress: z.string().max(100, "Registered office address must be 100 characters or less").optional(),
  zipCode: z.string().optional(),
});

type BusinessLocationFormData = z.infer<typeof businessLocationSchema>;

// Convert countries to options for dropdowns - using country names as values
const countryOptions: SelectOption[] = countries.map((country) => ({
  value: country.name,
  label: country.name,
}));

const countryMultiSelectOptions: MultiSelectOption[] = countries.map((country) => ({
  value: country.name,
  label: country.name,
}));

export function Step3BusinessLocation() {
  const router = useRouter();
  const { userId, onboardingState, refreshState } = useSMEOnboarding();
  const [addressLength, setAddressLength] = useState(0);
  const saveLocationMutation = useSaveLocationInfo();
  
  // Fetch full user details if userId is present
  const { data: userDetail, isLoading: isLoadingUser } = useSMEUser(userId || "", {
    enabled: !!userId,
  });
  
  // Determine if we're editing (userId exists, regardless of completion status)
  const isEditing = !!userId;
  const businessData = userDetail?.business || onboardingState?.business;

  const form = useForm<BusinessLocationFormData>({
    resolver: zodResolver(businessLocationSchema),
    defaultValues: {
      countriesOfOperation: [],
      companyHeadquarters: "",
      city: "",
      registeredOfficeAddress: "",
      zipCode: "",
    },
  });

  // Load existing data if userId is present
  useEffect(() => {
    if (userId && businessData) {
      // API returns country names, form now uses country names directly
      const countriesOfOperation = businessData.countriesOfOperation || [];
      
      // companyHQ is just the country name (one string)
      const companyHQCountry = businessData.companyHQ || "";
      
      form.reset({
        countriesOfOperation: countriesOfOperation,
        companyHeadquarters: companyHQCountry,
        city: businessData.city || businessData.registeredOfficeCity || "",
        registeredOfficeAddress: businessData.registeredOfficeAddress || "",
        zipCode: businessData.registeredOfficeZipCode || "",
      });
      
      if (businessData.registeredOfficeAddress) {
        setAddressLength(businessData.registeredOfficeAddress.length);
      }
    }
  }, [userId, businessData, form]);

  const handleCancel = () => {
    if (userId) {
      router.push(`/entrepreneurs/create?userId=${userId}&step=2`);
    } else {
      router.push("/entrepreneurs/create?step=1");
    }
  };

  const onSubmit = async (data: BusinessLocationFormData) => {
    if (!userId) {
      toast({
        title: "Error",
        description: "Please complete previous steps first.",
        variant: "destructive",
      });
      router.push("/entrepreneurs/create?step=1");
      return;
    }

    try {
      // Form now uses country names directly, so no mapping needed
      const countriesOfOperation = data.countriesOfOperation;

      // companyHQ is just the country name (one string)
      const companyHQ = data.companyHeadquarters;

      await saveLocationMutation.mutateAsync({
        userId,
        data: {
          countriesOfOperation,
          companyHQ: companyHQ || undefined,
          city: data.city || undefined,
          registeredOfficeAddress: data.registeredOfficeAddress || undefined,
          registeredOfficeCity: data.city || undefined,
          registeredOfficeZipCode: data.zipCode || undefined,
        },
      });

      toast({
        title: "Success",
        description: "Business location information saved successfully.",
      });

      refreshState();
      router.push(`/entrepreneurs/create?userId=${userId}&step=4`);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error || error?.message || "Failed to save business location.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-primary-green">STEP 3/7</div>
          {isEditing && (
            <div className="text-xs text-primaryGrey-400 bg-primaryGrey-50 px-2 py-1 rounded">
              Editing existing data
            </div>
          )}
        </div>
        <h2 className="text-2xl font-semibold text-midnight-blue mb-2">
          Business Location
        </h2>
        <p className="text-sm text-primaryGrey-500">
          Specify the company's registered and operational address details.
        </p>
      </div>

      {isLoadingUser && userId ? (
        <div className="flex items-center justify-center py-8">
          <p className="text-sm text-primaryGrey-500">Loading business location information...</p>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Countries of Operation */}
          <FormField
            control={form.control}
            name="countriesOfOperation"
            render={({ field }) => (
              <FormItem>
                <FormLabel required className="text-primaryGrey-400">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Company Headquarters */}
            <FormField
              control={form.control}
              name="companyHeadquarters"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required className="text-primaryGrey-400">
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
                  <FormLabel required className="text-primaryGrey-400">
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

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              size="lg"
              type="button"
              variant="outline"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              size="lg"
              type="submit"
              className="text-white border-0"
              disabled={saveLocationMutation.isPending || isLoadingUser}
              style={{
                background:
                  "linear-gradient(90deg, var(--green-500, #0C9) 0%, var(--pink-500, #F0459C) 100%)",
              }}
            >
              {isLoadingUser
                ? "Loading..."
                : saveLocationMutation.isPending
                ? "Saving..."
                : "Save & Continue"}
            </Button>
          </div>
        </form>
      </Form>
      )}
    </div>
  );
}
