"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import {
  updateFormData,
  nextStep,
  prevStep,
} from "@/lib/redux/features/loan-product-form.slice";
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
import { SelectWithDescription } from "@/components/ui/select-with-description";
import { InputWithDropdown } from "@/components/ui/input-with-dropdown";
import {
  formSchema,
  FormData,
  defaultValues,
} from "./_schemas/step-two-form-schema";

// Define the props for the form component
interface StepTwoFormProps {
  initialData?: Partial<FormData>;
}

// Define the form component
export default function StepTwoForm({ initialData }: StepTwoFormProps) {
  const dispatch = useDispatch();

  // Initialize the form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || defaultValues,
  });

  // Handle form submission
  const onSubmit = (data: FormData) => {
    dispatch(updateFormData(data));
    dispatch(nextStep());
  };

  const repaymentCycleOptions = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
  ];

  const gracePeriodOptions = [
    { value: "days", label: "days" },
    { value: "weeks", label: "weeks" },
    { value: "months", label: "months" },
  ];

  const interestRatePeriodOptions = [
    { value: "per_month", label: "per month" },
    { value: "per_annum", label: "per annum" },
  ];

  const interestCalculationMethodOptions = [
    {
      value: "flat",
      label: "Flat",
      description:
        "Interest is calculated on the initial loan amount throughout the loan term",
    },
    {
      value: "declining_balance",
      label: "Declining Balance",
      description: "Interest is calculated on the remaining loan balance",
    },
  ];

  const interestCollectionMethodOptions = [
    {
      value: "upfront",
      label: "Upfront",
      description: "Interest is collected at loan disbursement",
    },
    {
      value: "with_repayment",
      label: "With Repayment",
      description: "Interest is collected with each repayment installment",
    },
  ];

  const interestRecognitionCriteriaOptions = [
    {
      value: "cash_basis",
      label: "Cash Basis",
      description: "Interest is recognized only when payment is received",
    },
    {
      value: "accrual_basis",
      label: "Accrual Basis",
      description:
        "Interest is recognized as it is earned, regardless of when payment is received",
    },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <h2 className="text-base font-medium mb-4">Loan repayment terms</h2>

          <FormField
            control={form.control}
            name="repaymentCycle"
            render={({ field }) => (
              <FormItem className="mb-6">
                <FormLabel className="text-sm font-normal">
                  Loan repayment cycle <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <SelectWithDescription
                    options={repaymentCycleOptions}
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Select repayment cycle"
                    error={!!form.formState.errors.repaymentCycle}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-8 mb-6">
            <FormField
              control={form.control}
              name="specificRepaymentDay"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-normal">
                    Specific repayment day{" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter the day of the month"
                      className="h-9 text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-gray-500 mt-1">
                    The loan will be due every __ day of the month
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="minDaysBeforeFirstPayment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-normal">
                    Minimum days before first payment{" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter value"
                      className="h-9 text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-gray-500 mt-1">
                    If the loan is disbursed close to the repayment date, the
                    first payment will be moved to the following month if the
                    gap is shorter than this number of days.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="mb-8">
            <FormLabel className="text-sm font-normal">
              Grace period (optional)
            </FormLabel>
            <FormField
              control={form.control}
              name="gracePeriod"
              render={({ field }) => (
                <FormItem className="mt-1">
                  <FormControl>
                    <InputWithDropdown
                      {...field}
                      placeholder="Enter value"
                      options={gracePeriodOptions}
                      dropdownValue={form.watch("gracePeriodUnit") || "days"}
                      onDropdownValueChange={(value) =>
                        form.setValue("gracePeriodUnit", value)
                      }
                      className="h-9 text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <h2 className="text-base font-medium mb-6">
              Loan interest details
            </h2>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <FormLabel className="text-sm font-normal">
                  Interest rate (%) <span className="text-red-500">*</span>
                </FormLabel>
                <FormField
                  control={form.control}
                  name="interestRate"
                  render={({ field }) => (
                    <FormItem className="mt-1">
                      <FormControl>
                        <InputWithDropdown
                          {...field}
                          placeholder="Enter percentage"
                          options={interestRatePeriodOptions}
                          dropdownValue={
                            form.watch("interestRatePeriod") || "per_month"
                          }
                          onDropdownValueChange={(value) =>
                            form.setValue("interestRatePeriod", value)
                          }
                          error={!!form.formState.errors.interestRate}
                          className=""
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="interestCalculationMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-normal">
                      Interest calculation method{" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <SelectWithDescription
                        options={interestCalculationMethodOptions}
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="Select interest calculation method"
                        error={
                          !!form.formState.errors.interestCalculationMethod
                        }
                        className="mt-1"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="interestCollectionMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-normal">
                      Interest collection method{" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <SelectWithDescription
                        options={interestCollectionMethodOptions}
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="Select interest collection method"
                        error={!!form.formState.errors.interestCollectionMethod}
                        className="mt-1"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="interestRecognitionCriteria"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-normal">
                      Interest recognition criteria{" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <SelectWithDescription
                        options={interestRecognitionCriteriaOptions}
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="Select interest recognition criteria"
                        error={
                          !!form.formState.errors.interestRecognitionCriteria
                        }
                        className="mt-1"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="mt-8">
            <Button
              type="submit"
              className="w-full h-10 bg-[#B6BABC] hover:bg-gray-500 mb-4"
            >
              Continue
            </Button>

            <div className="flex justify-center">
              <Button
                type="button"
                variant="link"
                className="text-black"
                onClick={() => dispatch(prevStep())}
              >
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
        </div>
      </form>
    </Form>
  );
}
