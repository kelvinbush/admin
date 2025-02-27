"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import {
  userApiSlice,
  useUpdateBusinessProfileMutation,
} from "@/lib/redux/services/user";

const formSchema = z
  .object({
    monthlyTurnover: z.coerce.number({
      message: "Please enter your monthly turnover in USD",
    }),
    yearlyTurnover: z.coerce.number({
      message: "Please enter your yearly turnover in USD",
    }),
    hasBorrowingHistory: z.enum(["yes", "no"], {
      required_error: "Please select if you have borrowing history",
    }),
    amountBorrowed: z.coerce.number().optional(),
    defaultCurrency: z.string().min(1, "Currency is required").optional(),
    loanStatus: z
      .enum(["fully_repaid", "currently_being_repaid", "defaulted"])
      .optional(),
    defaultReason: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.hasBorrowingHistory === "yes") {
        // Require loan status when there's borrowing history
        if (!data.loanStatus) {
          return false;
        }
        // Require amount borrowed when there's borrowing history
        if (!data.amountBorrowed) {
          return false;
        }
      }
      return true;
    },
    {
      message: "Please fill in all required fields",
      path: ["loanStatus"],
    },
  );

export default function CompanyFinancials({ userId }: { userId: string }) {
  const [wordCount, setWordCount] = useState(0);
  const { data: response, isLoading } =
    userApiSlice.useGetBusinessProfileByPersonalGuidQuery(
      { guid: userId as string },
      { skip: !userId },
    );
  const [updateBusinessProfile] = useUpdateBusinessProfileMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const { watch } = form;
  const showDefaultReason = watch("loanStatus") === "defaulted";
  const hasBorrowingHistory = watch("hasBorrowingHistory") === "yes";

  useEffect(() => {
    if (
      response?.business &&
      response.business.averageMonthlyTurnover &&
      response.business.averageAnnualTurnover
    ) {
      form.reset({
        monthlyTurnover: response.business.averageMonthlyTurnover,
        yearlyTurnover: response.business.averageAnnualTurnover,
        hasBorrowingHistory: response.business.previousLoans ? "yes" : "no",
        amountBorrowed: response.business.loanAmount,
        defaultCurrency: response.business.defaultCurrency ?? "KES",
        loanStatus: response.business.previousLoans
          ? (response.business.recentLoanStatus?.toLowerCase() as
              | "fully_repaid"
              | "currently_being_repaid"
              | "defaulted")
          : undefined,
        defaultReason: response.business.defaultReason ?? "",
      });
    }
  }, [response?.business, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!response?.business) return;

    try {
      // Always provide a recentLoanStatus, use "NONE" if not set
      const loanStatus =
        values.hasBorrowingHistory === "yes" && values.loanStatus
          ? values.loanStatus.toUpperCase()
          : "NONE";

      // Always provide a defaultReason, empty string if not set
      const defaultReason =
        values.hasBorrowingHistory === "yes" &&
        values.loanStatus === "defaulted" &&
        values.defaultReason
          ? values.defaultReason.trim()
          : "";

      await updateBusinessProfile({
        ...response.business,
        businessLogo: response.business.businessLogo || "",
        yearOfRegistration: response.business.yearOfRegistration ?? "",
        previousLoans: values.hasBorrowingHistory === "yes",
        loanAmount: values.amountBorrowed ?? 0,
        defaultCurrency: values.defaultCurrency ?? "KES",
        recentLoanStatus: loanStatus,
        averageAnnualTurnover: values.yearlyTurnover,
        averageMonthlyTurnover: values.monthlyTurnover,
        defaultReason,
        businessGuid: response.business.businessGuid,
      }).unwrap();

      toast.success("Financial details updated successfully");
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update financial details");
    }
  }

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full" />;
  }

  return (
    <div className={cn("relative space-y-4")}>
      <div className="mb-8 flex items-center gap-8">
        <h2 className="shrink-0 text-2xl font-medium">Financial Details</h2>
        <div className="h-[1.5px] w-full bg-gray-200" />
      </div>

      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="monthlyTurnover"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Monthly turnover (USD){" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="number" {...field} readOnly />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="yearlyTurnover"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Yearly turnover (USD){" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="number" {...field} readOnly />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="hasBorrowingHistory"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>
                  Does the business have any previous borrowing history?{" "}
                  <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    disabled
                    onValueChange={(value) => {
                      field.onChange(value);
                      if (value === "no") {
                        form.setValue("loanStatus", undefined, {
                          shouldValidate: true,
                        });
                        form.setValue("amountBorrowed", 0, {
                          shouldValidate: true,
                        });
                        form.setValue("defaultReason", "", {
                          shouldValidate: true,
                        });
                      }
                    }}
                    value={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="yes" />
                      </FormControl>
                      <FormLabel className="font-normal">Yes</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="no" />
                      </FormControl>
                      <FormLabel className="font-normal">No</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {hasBorrowingHistory && (
            <>
              <FormField
                control={form.control}
                name="amountBorrowed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Amount borrowed <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input {...field} readOnly />
                        <div className="absolute inset-y-0 right-0 flex items-center">
                          <span className="border-l px-4 text-sm text-gray-600">
                            <FormField
                              control={form.control}
                              name="defaultCurrency"
                              render={({ field }) => (
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value || "KES"}
                                  disabled
                                >
                                  <SelectTrigger className="border-0 w-[80px]">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="KES">KES</SelectItem>
                                    <SelectItem value="USD">USD</SelectItem>
                                    <SelectItem value="EUR">EUR</SelectItem>
                                    <SelectItem value="GBP">GBP</SelectItem>
                                    <SelectItem value="TZS">TZS</SelectItem>
                                    <SelectItem value="UGX">UGX</SelectItem>
                                    <SelectItem value="RWF">RWF</SelectItem>
                                    <SelectItem value="NGN">NGN</SelectItem>
                                    <SelectItem value="ZAR">ZAR</SelectItem>
                                    <SelectItem value="GHS">GHS</SelectItem>
                                    <SelectItem value="MAD">MAD</SelectItem>
                                    <SelectItem value="EGP">EGP</SelectItem>
                                    <SelectItem value="CNY">CNY</SelectItem>
                                    <SelectItem value="JPY">JPY</SelectItem>
                                    <SelectItem value="AUD">AUD</SelectItem>
                                    <SelectItem value="CAD">CAD</SelectItem>
                                    <SelectItem value="CHF">CHF</SelectItem>
                                    <SelectItem value="AED">AED</SelectItem>
                                    <SelectItem value="SAR">SAR</SelectItem>
                                  </SelectContent>
                                </Select>
                              )}
                            />
                          </span>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="loanStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      What is the status of your most recent loan?{" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select loan status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="fully_repaid">
                          Fully Repaid
                        </SelectItem>
                        <SelectItem value="currently_being_repaid">
                          Currently Being Repaid
                        </SelectItem>
                        <SelectItem value="defaulted">Defaulted</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {showDefaultReason && (
                <FormField
                  control={form.control}
                  name="defaultReason"
                  render={({ field }) => (
                    <FormItem className={"relative"}>
                      <FormLabel>
                        Please share the reason for defaulting on your most
                        recent loan (Optional){" "}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          onChange={(e) => {
                            const words = e.target.value
                              .split(/\s+/)
                              .filter(Boolean);
                            if (words.length <= 150) {
                              field.onChange(e);
                              setWordCount(words.length);
                            }
                          }}
                          readOnly
                        />
                      </FormControl>
                      <div className="absolute bottom-6 right-2 text-sm text-gray-500">
                        {wordCount}/100
                      </div>
                      <FormDescription>
                        We understand that financial challenges can arise, and
                        we&apos;re here to help you find the right financial
                        solution.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </>
          )}
        </form>
      </Form>
    </div>
  );
}
