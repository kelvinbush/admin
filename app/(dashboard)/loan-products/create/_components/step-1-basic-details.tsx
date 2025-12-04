"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createLoanProductSchema, type CreateLoanProductFormData, LoanTermUnitEnum } from "@/lib/validations/loan-product";
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

type Step1BasicDetailsProps = {
  onContinue?: (values: CreateLoanProductFormData) => void;
};

export function Step1BasicDetails({ onContinue }: Step1BasicDetailsProps) {
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
      interestRate: 0,
      interestType: "fixed",
      ratePeriod: "per_month",
      amortizationMethod: "flat",
      repaymentFrequency: "monthly",
      isActive: true,
    },
    mode: "onChange",
  });

  const onSubmit = (values: unknown) => {
    onContinue?.(values as CreateLoanProductFormData);
  };

  const termUnitOptions = LoanTermUnitEnum.map((unit) => ({
    label: unit.charAt(0).toUpperCase() + unit.slice(1),
    value: unit,
  }));

  const visibilityOptions = [
    { label: "All Users", value: "all" },
    { label: "Tuungane Users", value: "tuungane" },
    { label: "GIZ-SAIS Users", value: "giz_sais" },
    { label: "Ecobank Users", value: "ecobank" },
  ];

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
            Add loan product
          </h2>
          <p className="mt-1 text-sm text-primaryGrey-500 max-w-xl">
            Fill in the details below to create a new loan product.
          </p>
        </div>

        {/* Basic loan details */}
        <section className="space-y-4">
          <h3 className="font-medium text-midnight-blue">
            Basic loan details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    required
                    className="text-sm text-[#444C53]"
                  >
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

            {/* Loan provider placeholder - TODO: hook to real data */}
            <SearchableSelect
              name="loanProvider"
              label="Loan provider/organization"
              notFound="No providers found"
              options={[]}
              placeholder="Select loan provider"
              control={form.control}
            />

            <SearchableSelect
              name="loanVisibility"
              label="Loan visibility"
              notFound="No user groups found"
              options={visibilityOptions}
              placeholder="Select user group"
              control={form.control}
              required
            />
          </div>
        </section>

        {/* Loan availability window + description */}
        <section className="space-y-4">
          <div className="space-y-3">
            <FormLabel className="text-sm text-[#444C53]">
              Loan availability window (optional)
            </FormLabel>
            <Input placeholder="Enter start & end dates" />
          </div>
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
                    <FormLabel
                      required
                      className="text-sm text-[#444C53]"
                    >
                      Minimum loan duration
                    </FormLabel>
                    <FormControl>
                      <div className="flex">
                        <Input
                          type="number"
                          min={0}
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
                    <FormLabel
                      required
                      className="text-sm text-[#444C53]"
                    >
                      Maximum loan duration
                    </FormLabel>
                    <FormControl>
                      <div className="flex">
                        <Input
                          type="number"
                          min={0}
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
                  <FormLabel
                    required
                    className="text-sm text-[#444C53]"
                  >
                    Minimum loan amount
                  </FormLabel>
                  <FormControl>
                    <InputWithCurrency
                      type="number"
                      min={0}
                      placeholder="Enter loan amount"
                      value={field.value?.toString() ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? "" : Number(e.target.value),
                        )
                      }
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
                  <FormLabel
                    required
                    className="text-sm text-[#444C53]"
                  >
                    Maximum loan amount
                  </FormLabel>
                  <FormControl>
                    <InputWithCurrency
                      type="number"
                      min={0}
                      placeholder="Enter loan amount"
                      value={field.value?.toString() ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? "" : Number(e.target.value),
                        )
                      }
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
          <Button
            type="button"
            variant="ghost"
            className="text-sm text-primaryGrey-500"
          >
            ← Back
          </Button>
          <Button type="submit" className="px-8">
            Continue →
          </Button>
        </div>
      </form>
    </Form>
  );
}


