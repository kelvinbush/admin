"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { updateFormData, nextStep, prevStep } from "@/lib/redux/features/loan-product-form.slice";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  creditLimitDuration: z.string().optional(),
  creditLimitPeriod: z.string().optional(),
  minimumLoanDuration: z.string().min(1, {
    message: "Minimum loan duration is required.",
  }),
  minimumLoanPeriod: z.string({
    required_error: "Please select a period.",
  }),
  maximumLoanDuration: z.string().min(1, {
    message: "Maximum loan duration is required.",
  }),
  maximumLoanPeriod: z.string({
    required_error: "Please select a period.",
  }),
  minimumLoanAmount: z.string().min(1, {
    message: "Minimum loan amount is required.",
  }),
  maximumLoanAmount: z.string().min(1, {
    message: "Maximum loan amount is required.",
  }),
  currency: z.string({
    required_error: "Please select a currency.",
  }),
  interestRate: z.string().min(1, {
    message: "Interest rate is required.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface StepTwoFormProps {
  initialData?: Partial<FormValues>;
}

const StepTwoForm = ({ initialData }: StepTwoFormProps) => {
  const dispatch = useDispatch();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      creditLimitDuration: initialData?.creditLimitDuration || "",
      creditLimitPeriod: initialData?.creditLimitPeriod || "days",
      minimumLoanDuration: initialData?.minimumLoanDuration || "",
      minimumLoanPeriod: initialData?.minimumLoanPeriod || "days",
      maximumLoanDuration: initialData?.maximumLoanDuration || "",
      maximumLoanPeriod: initialData?.maximumLoanPeriod || "days",
      minimumLoanAmount: initialData?.minimumLoanAmount || "",
      maximumLoanAmount: initialData?.maximumLoanAmount || "",
      currency: initialData?.currency || "USD",
      interestRate: initialData?.interestRate || "",
    },
  });

  // Sync loan period between min and max
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "minimumLoanPeriod") {
        form.setValue("maximumLoanPeriod", value.minimumLoanPeriod || "days");
      } else if (name === "maximumLoanPeriod") {
        form.setValue("minimumLoanPeriod", value.maximumLoanPeriod || "days");
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Sync currency between min and max amount
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "currency") {
        // Currency is already a single field that applies to both min and max
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmit = (data: FormValues) => {
    dispatch(updateFormData({
      creditLimitDuration: data.creditLimitDuration,
      minimumLoanDuration: `${data.minimumLoanDuration} ${data.minimumLoanPeriod}`,
      maximumLoanDuration: `${data.maximumLoanDuration} ${data.maximumLoanPeriod}`,
      minimumLoanAmount: data.minimumLoanAmount,
      maximumLoanAmount: data.maximumLoanAmount,
      currency: data.currency as SupportedCurrency,
      interestRate: data.interestRate,
    }));
    dispatch(nextStep());
  };

  const handleBack = () => {
    dispatch(prevStep());
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-xl font-semibold">Loan terms & conditions</h2>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <FormLabel>Credit limit duration (for revolving credit lines)</FormLabel>
            <div className="flex gap-2">
              <div className="w-2/3">
                <FormField
                  control={form.control}
                  name="creditLimitDuration"
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
              <div className="w-1/3">
                <FormField
                  control={form.control}
                  name="creditLimitPeriod"
                  render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Period" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="days">days</SelectItem>
                          <SelectItem value="weeks">weeks</SelectItem>
                          <SelectItem value="months">months</SelectItem>
                          <SelectItem value="years">years</SelectItem>
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
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <FormLabel>Minimum loan duration <span className="text-red-500">*</span></FormLabel>
            <div className="flex gap-2">
              <div className="w-2/3">
                <FormField
                  control={form.control}
                  name="minimumLoanDuration"
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
              <div className="w-1/3">
                <FormField
                  control={form.control}
                  name="minimumLoanPeriod"
                  render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Period" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="days">days</SelectItem>
                          <SelectItem value="weeks">weeks</SelectItem>
                          <SelectItem value="months">months</SelectItem>
                          <SelectItem value="years">years</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
          
          <div>
            <FormLabel>Maximum loan duration <span className="text-red-500">*</span></FormLabel>
            <div className="flex gap-2">
              <div className="w-2/3">
                <FormField
                  control={form.control}
                  name="maximumLoanDuration"
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
              <div className="w-1/3">
                <FormField
                  control={form.control}
                  name="maximumLoanPeriod"
                  render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Period" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="days">days</SelectItem>
                          <SelectItem value="weeks">weeks</SelectItem>
                          <SelectItem value="months">months</SelectItem>
                          <SelectItem value="years">years</SelectItem>
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
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <FormLabel>Minimum loan amount <span className="text-red-500">*</span></FormLabel>
            <div className="flex gap-2">
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="minimumLoanAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Enter loan amount" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
          
          <div>
            <FormLabel>Maximum loan amount <span className="text-red-500">*</span></FormLabel>
            <div className="flex gap-2">
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="maximumLoanAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Enter loan amount" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency <span className="text-red-500">*</span></FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="KES">KES</SelectItem>
                    <SelectItem value="NGN">NGN</SelectItem>
                    <SelectItem value="ZAR">ZAR</SelectItem>
                    <SelectItem value="GHS">GHS</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="interestRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Interest rate (%) <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="Enter interest rate" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={handleBack}>
            Back
          </Button>
          <Button type="submit">Continue</Button>
        </div>
      </form>
    </Form>
  );
};

export default StepTwoForm;
