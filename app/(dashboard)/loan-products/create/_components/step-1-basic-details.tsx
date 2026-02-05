"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createLoanProductSchema,
  type CreateLoanProductFormData,
  LoanTermUnitEnum,
} from "@/lib/validations/loan-product";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { InputWithCurrency } from "@/components/ui/input-with-currency";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import CreateUserGroupModal from "@/app/(dashboard)/usergroups/_components/create-user-group-modal";
import { CreateOrganizationModal } from "@/app/(dashboard)/organizations/_components/create-organization-modal";
import {
  MultiSelectDropdown,
  type MultiSelectOption,
} from "@/components/ui/multi-select-dropdown";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useLoanProductForm } from "../_context/loan-product-form-context";
import { useOrganizations } from "@/lib/api/hooks/organizations";
import { useUserGroups } from "@/lib/api/hooks/useUserGroups";

type Step1BasicDetailsProps = {
  onContinue?: () => void;
  onBack?: () => void;
};

export function Step1BasicDetails({
  onContinue,
  onBack,
}: Step1BasicDetailsProps) {
  const [createUserGroupOpen, setCreateUserGroupOpen] = useState(false);
  const [createOrganizationOpen, setCreateOrganizationOpen] = useState(false);
  const { formState, updateStep1Data, isEditMode } = useLoanProductForm();

  // Fetch organizations and user groups
  const { data: organizationsData, refetch: refetchOrganizations } =
    useOrganizations(undefined, {
      page: 1,
      limit: 100,
    });
  const { data: userGroupsData, refetch: refetchUserGroups } = useUserGroups(
    undefined,
    {
      page: 1,
      limit: 100,
    },
  );

  // Transform organizations to options
  const organizationOptions = useMemo(() => {
    if (!organizationsData?.items) return [];
    return organizationsData.items.map((org) => ({
      label: org.name,
      value: org.id,
    }));
  }, [organizationsData]);

  // Transform user groups to options
  const userGroupOptions: MultiSelectOption[] = useMemo(() => {
    if (!userGroupsData?.data) return [];
    return userGroupsData.data.map((group: any) => ({
      label: group.name,
      value: group.id,
    }));
  }, [userGroupsData]);

  // Use untyped form instance here to avoid strict generic mismatch between
  // react-hook-form and the Zod resolver while still benefiting from runtime validation.
  const form = useForm({
    resolver: zodResolver(createLoanProductSchema),
    defaultValues: {
      name: "",
      slug: "",
      summary: "",
      description: "",
      currency: "EUR",
      minAmount: 0,
      maxAmount: 0,
      minTerm: 0,
      maxTerm: 0,
      termUnit: "days",
      loanProvider: "",
      loanVisibility: [],
      availabilityStartDate: undefined,
      availabilityEndDate: undefined,
      // Step 2 fields (optional for Step 1 validation)
      repaymentFrequency: "monthly" as const,
      ratePeriod: "per_month" as const,
      amortizationMethod: "flat" as const,
      interestCollectionMethod: "",
      interestRecognitionCriteria: "",
    },
    mode: "onChange",
  });

  // Load saved Step 1 data from context if available
  useEffect(() => {
    if (formState.step1Data && Object.keys(formState.step1Data).length > 0) {
      Object.keys(formState.step1Data).forEach((key) => {
        const value =
          formState.step1Data?.[key as keyof typeof formState.step1Data];
        if (value !== undefined && value !== null) {
          form.setValue(key as any, value, { shouldValidate: false });
        }
      });
    }
  }, [formState.step1Data, form]); // Watch formState changes

  const onSubmit = (values: unknown) => {
    const formData = values as CreateLoanProductFormData;
    // Save Step 1 data to context
    updateStep1Data(formData);
    // Continue to next step
    onContinue?.();
  };

  const termUnitOptions = LoanTermUnitEnum.map((unit) => ({
    label: unit.charAt(0).toUpperCase() + unit.slice(1),
    value: unit,
  }));

  return (
    <Form {...form}>
      <form
        className="space-y-8"
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >
        {/* Step label */}
        <div>
          <p className="text-xs font-medium text-primary-green">STEP 1/3</p>
          <h2 className="mt-1 text-2xl font-semibold text-midnight-blue">
            {isEditMode ? "Edit loan product" : "Add loan product"}
          </h2>
          <p className="mt-1 text-sm text-primaryGrey-500 max-w-xl">
            {isEditMode
              ? "Update the details below to modify this loan product."
              : "Fill in the details below to create a new loan product."}
          </p>
        </div>

        {/* Basic loan details */}
        <section className="space-y-4">
          <h3 className="font-medium text-midnight-blue">Basic loan details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required className="text-sm text-[#444C53]">
                    Loan product name
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter loan product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-[#444C53]">
                    Loan code/identifier (optional)
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter loan code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="loanProvider"
              render={() => (
                <FormItem>
                  <div className="flex items-center justify-between -mb-2">
                    <FormLabel required className="text-sm text-[#444C53]">
                      Loan provider/organization
                    </FormLabel>
                    <button
                      type="button"
                      onClick={() => setCreateOrganizationOpen(true)}
                      className="text-xs font-medium text-primary-green hover:underline"
                    >
                      + New loan provider
                    </button>
                  </div>
                  <FormControl>
                    <SearchableSelect
                      name="loanProvider"
                      label=""
                      notFound="No providers found"
                      options={organizationOptions}
                      placeholder="Select loan provider"
                      control={form.control}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="loanVisibility"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel required className="text-sm text-[#444C53]">
                      Loan visibility
                    </FormLabel>
                    <button
                      type="button"
                      onClick={() => setCreateUserGroupOpen(true)}
                      className="text-xs font-medium text-primary-green hover:underline"
                    >
                      + New user group
                    </button>
                  </div>
                  <FormControl>
                    <MultiSelectDropdown
                      options={userGroupOptions}
                      value={(field.value as string[]) || []}
                      onValueChange={(val) => field.onChange(val)}
                      placeholder="Select user groups"
                      maxDisplay={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        {/* Loan availability window + description */}
        <section className="space-y-4">
          <FormField
            control={form.control}
            name="availabilityStartDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-[#444C53]">
                  Loan availability window (optional)
                </FormLabel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Start date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormField
                    control={form.control}
                    name="availabilityEndDate"
                    render={({ field: endField }) => (
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !endField.value && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {endField.value ? (
                                format(endField.value, "PPP")
                              ) : (
                                <span>End date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={endField.value}
                              onSelect={endField.onChange}
                              disabled={(date) =>
                                form.watch("availabilityStartDate")
                                  ? date < form.watch("availabilityStartDate")!
                                  : false
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                    )}
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="summary"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-[#444C53]">
                  Loan description (optional)
                </FormLabel>
                <FormControl>
                  <textarea
                    rows={3}
                    className="w-full rounded-md border border-input px-3 py-2 text-sm"
                    placeholder="Briefly describe the loan product"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Revolving credit line */}
          <FormField
            control={form.control}
            name="isRevolvingCreditLine"
            render={({ field }) => (
              <FormItem>
                <FormLabel required className="text-sm text-[#444C53]">
                  Is this loan product a revolving credit line?
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    className="flex gap-8 mt-2"
                    value={
                      field.value === undefined
                        ? ""
                        : field.value
                          ? "yes"
                          : "no"
                    }
                    onValueChange={(val) => {
                      if (val === "") {
                        field.onChange(undefined);
                      } else {
                        field.onChange(val === "yes");
                      }
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="yes" id="revolving-yes" />
                      <label
                        htmlFor="revolving-yes"
                        className="text-sm text-midnight-blue"
                      >
                        Yes
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="no" id="revolving-no" />
                      <label
                        htmlFor="revolving-no"
                        className="text-sm text-midnight-blue"
                      >
                        No
                      </label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        {/* Loan terms & conditions */}
        <section className="space-y-4">
          <h3 className="font-medium text-midnight-blue">
            Loan terms &amp; conditions
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Min / Max term with synchronized unit */}
            <div className="flex flex-col gap-2">
              <FormField
                control={form.control}
                name="minTerm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required className="text-sm text-[#444C53]">
                      Minimum loan duration
                    </FormLabel>
                    <FormControl>
                      <div className="flex">
                        <Input
                          type="number"
                          min={1}
                          className="rounded-r-none border-r-0"
                          placeholder="Enter value"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? ""
                                : Number(e.target.value),
                            )
                          }
                        />
                        <FormField
                          control={form.control}
                          name="termUnit"
                          render={({ field: unitField }) => (
                            <FormControl>
                              <select
                                className="w-32 rounded-l-none border-l-0 border border-input bg-primaryGrey-50 text-sm px-3 rounded-r-md"
                                value={unitField.value}
                                onChange={(e) =>
                                  unitField.onChange(e.target.value)
                                }
                              >
                                {termUnitOptions.map((opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                            </FormControl>
                          )}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col gap-2">
              <FormField
                control={form.control}
                name="maxTerm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required className="text-sm text-[#444C53]">
                      Maximum loan duration
                    </FormLabel>
                    <FormControl>
                      <div className="flex">
                        <Input
                          type="number"
                          min={1}
                          className="rounded-r-none border-r-0"
                          placeholder="Enter value"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? ""
                                : Number(e.target.value),
                            )
                          }
                        />
                        {/* Reuse same termUnit field so unit stays synchronized */}
                        <FormField
                          control={form.control}
                          name="termUnit"
                          render={({ field: unitField }) => (
                            <FormControl>
                              <select
                                className="w-32 rounded-l-none border-l-0 border border-input bg-primaryGrey-50 text-sm px-3 rounded-r-md"
                                value={unitField.value}
                                onChange={(e) =>
                                  unitField.onChange(e.target.value)
                                }
                              >
                                {termUnitOptions.map((opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                            </FormControl>
                          )}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Min / Max amount with synchronized currency */}
            <FormField
              control={form.control}
              name="minAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required className="text-sm text-[#444C53]">
                    Minimum loan amount
                  </FormLabel>
                  <FormControl>
                    <InputWithCurrency
                      type="text"
                      placeholder="Enter loan amount"
                      value={
                        typeof field.value === "number" && !isNaN(field.value)
                          ? field.value.toLocaleString()
                          : (field.value?.toString() ?? "")
                      }
                      onChange={(e) => {
                        const raw = e.target.value.replace(/,/g, "");
                        const num = raw === "" ? NaN : Number(raw);
                        field.onChange(isNaN(num) ? "" : num);
                      }}
                      currencyValue={form.watch("currency")}
                      onCurrencyValueChange={(value) =>
                        form.setValue("currency", value)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required className="text-sm text-[#444C53]">
                    Maximum loan amount
                  </FormLabel>
                  <FormControl>
                    <InputWithCurrency
                      type="text"
                      placeholder="Enter loan amount"
                      value={
                        typeof field.value === "number" && !isNaN(field.value)
                          ? field.value.toLocaleString()
                          : (field.value?.toString() ?? "")
                      }
                      onChange={(e) => {
                        const raw = e.target.value.replace(/,/g, "");
                        const num = raw === "" ? NaN : Number(raw);
                        field.onChange(isNaN(num) ? "" : num);
                      }}
                      currencyValue={form.watch("currency")}
                      onCurrencyValueChange={(value) =>
                        form.setValue("currency", value)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        {/* Footer actions */}
        <div className="flex justify-between border-t border-primaryGrey-100 pt-6 mt-4">
          {onBack ? (
            <Button
              type="button"
              variant="ghost"
              className="text-sm text-primaryGrey-500"
              onClick={onBack}
            >
              {isEditMode ? "Cancel" : "← Back"}
            </Button>
          ) : (
            <div />
          )}
          <Button type="submit" className="px-8">
            Continue →
          </Button>
        </div>
      </form>

      <CreateUserGroupModal
        open={createUserGroupOpen}
        onOpenChange={setCreateUserGroupOpen}
        onCreated={() => {
          setCreateUserGroupOpen(false);
          refetchUserGroups();
        }}
      />
      <CreateOrganizationModal
        open={createOrganizationOpen}
        onOpenChange={setCreateOrganizationOpen}
        onCreated={() => {
          setCreateOrganizationOpen(false);
          refetchOrganizations();
        }}
      />
    </Form>
  );
}
