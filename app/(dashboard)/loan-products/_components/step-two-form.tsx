"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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

// Define form schema with Zod
const formSchema = z.object({
  repaymentCycle: z.string({
    required_error: "Please select a repayment cycle.",
  }),
  specificRepaymentDay: z.string().optional(),
  minDaysBeforeFirstPayment: z.string().optional(),
  gracePeriod: z.string().optional(),
  gracePeriodUnit: z.string().default("days"),
  interestRate: z.string().min(1, {
    message: "Interest rate is required.",
  }),
  interestRatePeriod: z.string({
    required_error: "Please select a period.",
  }),
  interestCalculationMethod: z.string({
    required_error: "Please select an interest calculation method.",
  }),
  interestCollectionMethod: z.string({
    required_error: "Please select an interest collection method.",
  }),
  interestRecognitionCriteria: z.string({
    required_error: "Please select interest recognition criteria.",
  }),
});

// Define the props for the form component
interface StepTwoFormProps {
  initialData?: Partial<z.infer<typeof formSchema>>;
}

// Define the form component
const StepTwoForm = ({ initialData }: StepTwoFormProps) => {
  const dispatch = useDispatch();
  
  // State to track if specific day fields should be shown
  const [showSpecificDayFields, setShowSpecificDayFields] = useState(
    initialData?.repaymentCycle === "monthly_specific_day"
  );

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      repaymentCycle: initialData?.repaymentCycle || "",
      specificRepaymentDay: initialData?.specificRepaymentDay || "",
      minDaysBeforeFirstPayment: initialData?.minDaysBeforeFirstPayment || "",
      gracePeriod: initialData?.gracePeriod || "",
      gracePeriodUnit: initialData?.gracePeriodUnit || "days",
      interestRate: initialData?.interestRate || "",
      interestRatePeriod: initialData?.interestRatePeriod || "per_month",
      interestCalculationMethod: initialData?.interestCalculationMethod || "",
      interestCollectionMethod: initialData?.interestCollectionMethod || "",
      interestRecognitionCriteria: initialData?.interestRecognitionCriteria || "",
    },
  });

  // Handle form submission
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    dispatch(
      updateFormData({
        repaymentCycle: data.repaymentCycle,
        specificRepaymentDay: data.specificRepaymentDay,
        minDaysBeforeFirstPayment: data.minDaysBeforeFirstPayment,
        gracePeriod: data.gracePeriod,
        gracePeriodUnit: data.gracePeriodUnit,
        interestRate: data.interestRate,
        interestRatePeriod: data.interestRatePeriod,
        interestCalculationMethod: data.interestCalculationMethod,
        interestCollectionMethod: data.interestCollectionMethod,
        interestRecognitionCriteria: data.interestRecognitionCriteria,
      })
    );
    dispatch(nextStep());
  };

  // Handle going back to the previous step
  const handleBack = () => {
    dispatch(prevStep());
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h2 className="text-xl font-medium mb-4">Loan repayment terms</h2>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="repaymentCycle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Loan repayment cycle <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setShowSpecificDayFields(value === "monthly_specific_day");
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select repayment cycle" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Bi-weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="monthly_specific_day">Monthly on a specific day</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="annually">Annually</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {showSpecificDayFields && (
              <>
                <FormField
                  control={form.control}
                  name="specificRepaymentDay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Specific repayment day <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter the day of the month" 
                          {...field} 
                        />
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
                      <FormLabel>
                        Minimum days before first payment <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter value" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        If the loan is disbursed close to the repayment date, the first payment will be moved to the following month if the gap is shorter than this number of days.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            
            <div>
              <FormLabel>
                Grace period (optional)
              </FormLabel>
              <div className="flex gap-2">
                <div className="w-2/3">
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
                <div className="w-1/3">
                  <FormField
                    control={form.control}
                    name="gracePeriodUnit"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Period" />
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
        </div>
        
        <div>
          <h2 className="text-xl font-medium mb-4">Loan interest details</h2>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <FormLabel>
                Interest rate (%) <span className="text-red-500">*</span>
              </FormLabel>
              <div className="flex gap-2">
                <div className="w-2/3">
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
                <div className="w-1/3">
                  <FormField
                    control={form.control}
                    name="interestRatePeriod"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
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
                  <FormLabel>
                    Interest calculation method <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select interest calculation method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="flat">Flat</SelectItem>
                      <SelectItem value="declining_balance">Declining Balance</SelectItem>
                      <SelectItem value="compound">Compound</SelectItem>
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
                  <FormLabel>
                    Interest collection method <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select interest collection method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="upfront">Upfront</SelectItem>
                      <SelectItem value="with_repayment">With Repayment</SelectItem>
                      <SelectItem value="at_maturity">At Maturity</SelectItem>
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
                  <FormLabel>
                    Interest recognition criteria <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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
        
        <div className="flex flex-col space-y-4 mt-8">
          <Button
            type="submit"
            size={"lg"}
            className="w-full bg-[#B6BABC] hover:bg-gray-500"
          >
            Continue
          </Button>
          <div className="flex justify-center">
            <Button
              type="button"
              variant="link"
              className="px-0 text-black"
              onClick={handleBack}
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
};

export default StepTwoForm;
