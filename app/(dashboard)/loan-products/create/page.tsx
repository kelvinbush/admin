"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCreateLoanProduct } from "@/lib/api/hooks/loan-products";
import {
  createLoanProductSchema,
  CreateLoanProductFormData,
  LoanTermUnitEnum,
  InterestTypeEnum,
  InterestRatePeriodEnum,
  AmortizationMethodEnum,
  RepaymentFrequencyEnum,
} from "@/lib/validations/loan-product";
import { toast } from "sonner";
import { ArrowLeft, Save, X } from "lucide-react";
import { useTitle } from "@/context/title-context";

export default function CreateLoanProductPage() {
  const router = useRouter();
  const { setTitle } = useTitle();
  const createLoanProductMutation = useCreateLoanProduct();

  const form = useForm<CreateLoanProductFormData>({
    resolver: zodResolver(createLoanProductSchema),
    defaultValues: {
      name: "",
      slug: "",
      imageUrl: "",
      summary: "",
      description: "",
      currency: "USD",
      minAmount: 0,
      maxAmount: 0,
      minTerm: 0,
      maxTerm: 0,
      termUnit: "MONTHS",
      interestRate: 0,
      interestType: "FIXED",
      ratePeriod: "MONTHLY",
      amortizationMethod: "STRAIGHT_LINE",
      repaymentFrequency: "MONTHLY",
      processingFeeRate: undefined,
      processingFeeFlat: undefined,
      lateFeeRate: undefined,
      lateFeeFlat: undefined,
      prepaymentPenaltyRate: undefined,
      gracePeriodDays: undefined,
      isActive: true,
    },
  });

  React.useEffect(() => {
    setTitle("Create Loan Product");
  }, [setTitle]);

  const onSubmit = async (data: CreateLoanProductFormData) => {
    try {
      await createLoanProductMutation.mutateAsync(data);
      toast.success("Loan product created successfully");
      router.push("/loan-products");
    } catch (error) {
      toast.error("Failed to create loan product");
      console.error("Error creating loan product:", error);
    }
  };

  const handleCancel = () => {
    router.push("/loan-products");
  };

  return (
    <div className="container mx-auto bg-white">
      {/* Sticky Header */}
      <div className="sticky top-14 z-10 bg-white p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="text-primaryGrey-400 hover:text-primaryGrey-500"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="text-primaryGrey-400 hover:text-primaryGrey-500"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              form="loan-product-form"
              className="bg-primary-green hover:bg-primary-green/90"
              disabled={createLoanProductMutation.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              {createLoanProductMutation.isPending
                ? "Creating..."
                : "Create Product"}
            </Button>
          </div>
        </div>
      </div>

      {/* Form */}
      <Form {...form}>
        <form
          id="loan-product-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-0"
        >
          {/* Basic Information */}
          <div className="bg-white">
            <div className="p-6 pb-0">
              <h3 className="text-lg font-semibold text-midnight-blue">
                Basic Information
              </h3>
              <p className="text-sm text-primaryGrey-400 mt-1">
                Provide the basic details for your loan product
              </p>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
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
                  control={form.control}
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
                control={form.control}
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
                  control={form.control}
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
                  control={form.control}
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

          <div className="border-t border-primaryGrey-50"></div>

          {/* Financial Details */}
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
                  control={form.control}
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
                  control={form.control}
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
                  control={form.control}
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
                  control={form.control}
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
                  control={form.control}
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
                  control={form.control}
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
                              {unit.toLowerCase()}
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
                  control={form.control}
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
                  control={form.control}
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
                              {type.toLowerCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
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
                              {period.toLowerCase()}
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

          <div className="border-t border-primaryGrey-50"></div>

          {/* Loan Structure */}
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
                  control={form.control}
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
                              {method.replace(/_/g, " ").toLowerCase()}
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
                  control={form.control}
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
                              {frequency.toLowerCase()}
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
                control={form.control}
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

          <div className="border-t border-primaryGrey-50"></div>

          {/* Fees */}
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
                      control={form.control}
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
                      control={form.control}
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
                  <h5 className="text-sm font-medium text-midnight-blue">
                    Late Fees
                  </h5>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
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
                      control={form.control}
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
                  control={form.control}
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

          <div className="border-t border-primaryGrey-50"></div>

          {/* Status */}
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
                control={form.control}
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
        </form>
      </Form>
    </div>
  );
}
