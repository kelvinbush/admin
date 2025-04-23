import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import {
  updateFormData,
  nextStep,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const formSchema = z.object({
  // Basic loan details
  loanName: z.string().min(2, {
    message: "Loan product name must be at least 2 characters.",
  }),
  loanCode: z.string().optional(),
  loanProvider: z.string(),
  loanType: z.string({
    required_error: "Please select a loan type.",
  }),
  disbursementMethod: z.string({
    required_error: "Please select a disbursement method.",
  }),
  loanVisibility: z.string({
    required_error: "Please select loan visibility.",
  }),
  availabilityWindow: z.date().optional(),
  processingMethod: z.string({
    required_error: "Please select a processing method.",
  }),
  loanDescription: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),

  // Loan terms
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

interface StepOneFormProps {
  initialData?: Partial<FormValues>;
}

const StepOneForm = ({ initialData }: StepOneFormProps) => {
  const dispatch = useDispatch();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // Basic loan details
      loanName: initialData?.loanName || "",
      loanCode: initialData?.loanCode || "",
      loanProvider: initialData?.loanProvider || "MK Foundation",
      loanType: initialData?.loanType || "",
      disbursementMethod: initialData?.disbursementMethod || "",
      loanVisibility: initialData?.loanVisibility || "",
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

  const onSubmit = (data: FormValues) => {
    dispatch(
      updateFormData({
        // Basic loan details
        loanName: data.loanName,
        loanCode: data.loanCode,
        loanProvider: data.loanProvider,
        loanType: data.loanType,
        disbursementMethod: data.disbursementMethod,
        loanVisibility: data.loanVisibility,
        availabilityWindow: data.availabilityWindow,
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
        interestRate: data.interestRate,
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="MK Foundation">
                        MK Foundation
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="loanType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Loan type <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select loan type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="personal">Personal Loan</SelectItem>
                      <SelectItem value="business">Business Loan</SelectItem>
                      <SelectItem value="education">Education Loan</SelectItem>
                      <SelectItem value="mortgage">Mortgage Loan</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="disbursementMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Disbursement method <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select disbursement method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="bank_transfer">
                        Bank Transfer
                      </SelectItem>
                      <SelectItem value="mobile_money">Mobile Money</SelectItem>
                      <SelectItem value="check">Check</SelectItem>
                      <SelectItem value="cash">Cash</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="loanVisibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Loan visibility <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select user group" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="all_users">All Users</SelectItem>
                      <SelectItem value="selected_users">
                        Selected Users
                      </SelectItem>
                      <SelectItem value="business_users">
                        Business Users
                      </SelectItem>
                      <SelectItem value="premium_users">
                        Premium Users
                      </SelectItem>
                    </SelectContent>
                  </Select>
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

            <FormField
              control={form.control}
              name="availabilityWindow"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Loan availability window (optional)</FormLabel>
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
                            <span>Enter start & end dates</span>
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
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="processingMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Loan processing method{" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select loan processing method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="automatic">Automatic</SelectItem>
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
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
                    className="min-h-[120px]"
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

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <FormLabel>
                Credit limit duration (for revolving credit lines)
              </FormLabel>
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

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mt-6">
            <div>
              <FormLabel>
                Minimum loan duration <span className="text-red-500">*</span>
              </FormLabel>
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
              <FormLabel>
                Maximum loan duration <span className="text-red-500">*</span>
              </FormLabel>
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

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mt-6">
            <div>
              <FormLabel>
                Minimum loan amount <span className="text-red-500">*</span>
              </FormLabel>
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
              <FormLabel>
                Maximum loan amount <span className="text-red-500">*</span>
              </FormLabel>
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

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mt-6">
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Currency <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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
                  <FormLabel>
                    Interest rate (%) <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter interest rate" {...field} />
                  </FormControl>
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

export default StepOneForm;
