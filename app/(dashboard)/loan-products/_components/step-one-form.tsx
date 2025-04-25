import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useDispatch } from "react-redux";
import {
  nextStep,
  updateFormData,
} from "@/lib/redux/features/loan-product-form.slice";
import { SupportedCurrency } from "@/lib/types/loan-product";

import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { InputWithDropdown } from "@/components/ui/input-with-dropdown";
import { InputWithCurrency } from "@/components/ui/input-with-currency";
import { SelectWithDescription } from "@/components/ui/select-with-description";
import { stepOneSchema, type StepOneFormValues } from "../_schemas/loan-product-schemas";

interface StepOneFormProps {
  initialData?: Partial<StepOneFormValues>;
}

const StepOneForm = ({ initialData }: StepOneFormProps) => {
  const dispatch = useDispatch();

  const form = useForm<StepOneFormValues>({
    resolver: zodResolver(stepOneSchema),
    defaultValues: {
      // Basic loan details
      loanName: initialData?.loanName || "",
      loanCode: initialData?.loanCode || "",
      loanProvider: initialData?.loanProvider || "MK Foundation",
      loanType: initialData?.loanType || "",
      disbursementMethod: initialData?.disbursementMethod || "",
      loanVisibility: initialData?.loanVisibility || "",
      availabilityWindowStart: initialData?.availabilityWindowStart,
      availabilityWindowEnd: initialData?.availabilityWindowEnd,
      processingMethod: initialData?.processingMethod || "",
      loanDescription: initialData?.loanDescription || "",

      // Loan terms
      creditLimitDuration: initialData?.creditLimitDuration || "",
      creditLimitPeriod: initialData?.creditLimitPeriod || "days",
      minimumLoanDuration: initialData?.minimumLoanDuration || "",
      minimumLoanPeriod: initialData?.minimumLoanPeriod || "days",
      maximumLoanDuration: initialData?.maximumLoanDuration || "",
      maximumLoanPeriod: initialData?.maximumLoanPeriod || "days",
      minimumLoanAmount: initialData?.minimumLoanAmount || "",
      maximumLoanAmount: initialData?.maximumLoanAmount || "",
      currency: initialData?.currency || "USD",
    },
  });

  // We'll use a ref to prevent infinite loops when updating related fields
  const isUpdatingRef = React.useRef(false);

  // Function to safely update related period fields
  const updatePeriodFields = (value: string) => {
    if (isUpdatingRef.current) return;

    try {
      isUpdatingRef.current = true;
      form.setValue("minimumLoanPeriod", value);
      form.setValue("maximumLoanPeriod", value);
    } finally {
      // Reset the flag after a short delay to ensure all updates are processed
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 0);
    }
  };

  const onSubmit = (data: StepOneFormValues) => {
    dispatch(
      updateFormData({
        // Basic loan details
        loanName: data.loanName,
        loanCode: data.loanCode,
        loanProvider: data.loanProvider,
        loanType: data.loanType,
        disbursementMethod: data.disbursementMethod,
        loanVisibility: data.loanVisibility,
        // Store both start and end dates separately
        availabilityWindowStart: data.availabilityWindowStart,
        availabilityWindowEnd: data.availabilityWindowEnd,
        // Keep the original field for backward compatibility
        availabilityWindow: data.availabilityWindowStart,
        processingMethod: data.processingMethod,
        loanDescription: data.loanDescription,

        // Loan terms
        creditLimitDuration: data.creditLimitDuration,
        creditLimitPeriod: data.creditLimitPeriod,
        minimumLoanDuration: data.minimumLoanDuration,
        minimumLoanPeriod: data.minimumLoanPeriod,
        maximumLoanDuration: data.maximumLoanDuration,
        maximumLoanPeriod: data.maximumLoanPeriod,
        minimumLoanAmount: data.minimumLoanAmount,
        maximumLoanAmount: data.maximumLoanAmount,
        currency: data.currency as SupportedCurrency,
      }),
    );
    dispatch(nextStep());
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h2 className="text-xl font-medium mb-4">Basic loan details</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="loanName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Loan product name <span className="text-red-500">*</span>
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
              name="loanCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loan code/identifier (optional)</FormLabel>
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
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Loan provider/organization{" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <SelectWithDescription
                      options={[
                        {
                          value: "MK Foundation",
                          label: "MK Foundation",
                          description: "Default loan provider",
                        },
                      ]}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Select provider"
                      disabled={true}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="loanType"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>
                    Loan type <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <SelectWithDescription
                      options={[
                        {
                          value: "secured",
                          label: "Secured",
                          description: "Loan backed by collateral",
                        },
                        {
                          value: "unsecured",
                          label: "Unsecured",
                          description: "Loan without collateral",
                        },
                      ]}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Select loan type"
                      error={!!fieldState.error}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="disbursementMethod"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>
                    Disbursement method <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <SelectWithDescription
                      options={[
                        {
                          value: "bank_account",
                          label: "Bank Account",
                          description: "Disburse funds to a bank account",
                        },
                        {
                          value: "cash_wallet",
                          label: "Cash Wallet",
                          description: "Disburse funds to a digital wallet",
                        },
                      ]}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Select disbursement method"
                      error={!!fieldState.error}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="loanVisibility"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>
                    Loan visibility <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <SelectWithDescription
                      options={[
                        {
                          value: "all_users",
                          label: "All Users",
                          description: "Visible to all platform users",
                        },
                        {
                          value: "tuungane",
                          label: "Tuungane Users",
                          description: "Only visible to Tuungane program users",
                        },
                        {
                          value: "giz",
                          label: "GIZ-SAIS Users",
                          description: "Only visible to GIZ-SAIS program users",
                        },
                        {
                          value: "ecobank",
                          label: "Ecobank Users",
                          description: "Only visible to Ecobank customers",
                        },
                      ]}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Select user group"
                      error={!!fieldState.error}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription className="text-xs">
                    <Button
                      variant="link"
                      className="h-auto p-0 text-xs"
                      type="button"
                    >
                      + New user group
                    </Button>
                  </FormDescription>
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Loan availability window (optional)</FormLabel>
              <div className="grid grid-cols-2 gap-4 mt-[8px]">
                <FormField
                  control={form.control}
                  name="availabilityWindowStart"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Select start date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            disabled={(date) => {
                              const endDate = form.getValues(
                                "availabilityWindowEnd",
                              );
                              return endDate ? date > endDate : false;
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="availabilityWindowEnd"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Select end date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            disabled={(date) => {
                              const startDate = form.getValues(
                                "availabilityWindowStart",
                              );
                              return startDate ? date < startDate : false;
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="processingMethod"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>
                    Loan processing method{" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <SelectWithDescription
                      options={[
                        {
                          value: "presta",
                          label: "Process via Presta System (integrated)",
                          description:
                            "Use the integrated Presta loan management system",
                        },
                        {
                          value: "internal",
                          label: "Process Internally (non-integrated)",
                          description:
                            "Use internal processes without system integration",
                        },
                      ]}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Select loan processing method"
                      error={!!fieldState.error}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="loanDescription"
            render={({ field }) => (
              <FormItem className="mt-6">
                <FormLabel>
                  Loan description <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Briefly describe the loan product"
                    className="min-h-[80px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <h2 className="text-xl font-medium mb-4">Loan terms & conditions</h2>

          <FormLabel>
            Credit limit duration (for revolving credit lines)
          </FormLabel>
          <FormField
            control={form.control}
            name="creditLimitDuration"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <InputWithDropdown
                    placeholder="Enter value"
                    {...field}
                    options={[
                      { label: "days", value: "days" },
                      { label: "weeks", value: "weeks" },
                      {
                        label: "months",
                        value: "months",
                      },
                      { label: "years", value: "years" },
                    ]}
                    dropdownValue={form.watch("creditLimitPeriod") || "days"}
                    onDropdownValueChange={(value) =>
                      form.setValue("creditLimitPeriod", value)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mt-6">
            <div>
              <FormLabel>
                Minimum loan duration <span className="text-red-500">*</span>
              </FormLabel>
              <FormField
                control={form.control as any}
                name="minimumLoanDuration"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <InputWithDropdown
                        placeholder="Enter value"
                        {...field}
                        options={[
                          { label: "days", value: "days" },
                          {
                            label: "weeks",
                            value: "weeks",
                          },
                          { label: "months", value: "months" },
                          { label: "years", value: "years" },
                        ]}
                        dropdownValue={
                          form.watch("minimumLoanPeriod") || "days"
                        }
                        onDropdownValueChange={updatePeriodFields}
                        error={!!fieldState.error}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormLabel>
                Maximum loan duration <span className="text-red-500">*</span>
              </FormLabel>
              <FormField
                control={form.control as any}
                name="maximumLoanDuration"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <InputWithDropdown
                        placeholder="Enter value"
                        {...field}
                        options={[
                          { label: "days", value: "days" },
                          {
                            label: "weeks",
                            value: "weeks",
                          },
                          { label: "months", value: "months" },
                          { label: "years", value: "years" },
                        ]}
                        dropdownValue={
                          form.watch("maximumLoanPeriod") || "days"
                        }
                        onDropdownValueChange={updatePeriodFields}
                        error={!!fieldState.error}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mt-6">
            <div>
              <FormLabel>
                Minimum loan amount <span className="text-red-500">*</span>
              </FormLabel>
              <FormField
                control={form.control as any}
                name="minimumLoanAmount"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <InputWithCurrency
                        placeholder="Enter loan amount"
                        {...field}
                        currencyValue={form.watch("currency")}
                        onCurrencyValueChange={(value) =>
                          form.setValue("currency", value)
                        }
                        error={!!fieldState.error}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormLabel>
                Maximum loan amount <span className="text-red-500">*</span>
              </FormLabel>
              <FormField
                control={form.control as any}
                name="maximumLoanAmount"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <InputWithCurrency
                        placeholder="Enter loan amount"
                        {...field}
                        currencyValue={form.watch("currency")}
                        onCurrencyValueChange={(value) =>
                          form.setValue("currency", value)
                        }
                        error={!!fieldState.error}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Currency field is now integrated with amount fields */}
        </div>

        <div className="flex flex-col space-y-4 mt-8">
          <Button
            type="submit"
            size={"lg"}
            className="w-full bg-[#B6BABC] hover:bg-gray-500"
          >
            Continue
          </Button>
          <div className="flex justify-center">
            <Button type="button" variant="link" className="px-0 text-black">
              <span className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2"
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Back
              </span>
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default StepOneForm;
