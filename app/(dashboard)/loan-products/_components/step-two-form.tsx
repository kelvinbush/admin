"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { updateFormData, nextStep, prevStep } from "@/lib/redux/features/loan-product-form.slice";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formSchema, FormData, defaultValues } from "./_schemas/step-two-form-schema";

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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <h2 className="text-base font-medium mb-4">Loan repayment terms</h2>
          
          <FormField
            control={form.control}
            name="repaymentCycle"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel>Loan repayment cycle <span className="text-red-500">*</span></FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select repayment cycle" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="specificRepaymentDay"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specific repayment day <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Enter the day of the month" {...field} />
                  </FormControl>
                  <FormDescription className="text-xs">
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
                  <FormLabel>Minimum days before first payment <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Enter value" {...field} />
                  </FormControl>
                  <FormDescription className="text-xs">
                    If the loan is disbursed close to the repayment date, the first payment will be moved to the following month if the gap is shorter than this number of days.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="mt-4">
            <FormLabel>Grace period (optional)</FormLabel>
            <div className="flex gap-2">
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="gracePeriod"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Enter value" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-32">
                <FormField
                  control={form.control}
                  name="gracePeriodUnit"
                  render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Unit" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="days">days</SelectItem>
                          <SelectItem value="weeks">weeks</SelectItem>
                          <SelectItem value="months">months</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-base font-medium mb-4">Loan interest details</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FormLabel>Interest rate (%) <span className="text-red-500">*</span></FormLabel>
              <div className="flex gap-2">
                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name="interestRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Enter percentage" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="w-32">
                  <FormField
                    control={form.control}
                    name="interestRatePeriod"
                    render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Period" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="per_month">per month</SelectItem>
                            <SelectItem value="per_annum">per annum</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <FormField
              control={form.control}
              name="interestCalculationMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interest calculation method <span className="text-red-500">*</span></FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select interest calculation method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="flat">Flat</SelectItem>
                      <SelectItem value="declining_balance">Declining Balance</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="interestCollectionMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interest collection method <span className="text-red-500">*</span></FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select interest collection method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="upfront">Upfront</SelectItem>
                      <SelectItem value="with_repayment">With Repayment</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="interestRecognitionCriteria"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interest recognition criteria <span className="text-red-500">*</span></FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select interest recognition criteria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="cash_basis">Cash Basis</SelectItem>
                      <SelectItem value="accrual_basis">Accrual Basis</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="mt-8">
          <Button
            type="submit"
            className="w-full bg-[#B6BABC] hover:bg-gray-500 mb-4"
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
      </form>
    </Form>
  );
}
