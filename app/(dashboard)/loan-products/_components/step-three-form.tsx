"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import {
  prevStep,
  resetForm,
  updateFormData,
} from "@/lib/redux/features/loan-product-form.slice";
import { useCreateLoanProductMutation } from "@/lib/redux/services/loan-product";
import { RootState } from "@/lib/redux/store";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectWithDescription } from "@/components/ui/select-with-description";

const formSchema = z.object({
  paymentsAllocationSequence: z.string({
    required_error: "Please select a payment allocation sequence.",
  }),
  paymentAllocationStrategy: z.string({
    required_error: "Please select a payment allocation strategy.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface StepThreeFormProps {
  initialData?: Partial<FormValues>;
}

const StepThreeForm = ({ initialData }: StepThreeFormProps) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [createLoanProduct, { isLoading }] = useCreateLoanProductMutation();
  const formData = useSelector(
    (state: RootState) => state.loanProductForm.formData,
  );
  const { toast } = useToast();

  // State to track loan fees
  const [loanFees, setLoanFees] = useState<
    { id: string; name: string; amount: string; type: string }[]
  >([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      paymentsAllocationSequence:
        initialData?.paymentsAllocationSequence ||
        "FEES_INTEREST_PRINCIPAL_PENALTIES",
      paymentAllocationStrategy: initialData?.paymentAllocationStrategy || "",
    },
  });

  // Handle adding a new loan fee
  const handleAddLoanFee = () => {
    // This would typically open a modal or form to add a new fee
    // For now, we'll just add a placeholder fee
    const newFee = {
      id: `fee-${loanFees.length + 1}`,
      name: `Fee ${loanFees.length + 1}`,
      amount: "0",
      type: "fixed",
    };
    setLoanFees([...loanFees, newFee]);
  };

  const onSubmit = async (data: FormValues) => {
    try {
      // Update form data in Redux
      dispatch(
        updateFormData({
          ...formData,
          paymentsAllocationSequence: data.paymentsAllocationSequence,
          paymentAllocationStrategy: data.paymentAllocationStrategy,
        }),
      );

      // Combine all form data
      const finalFormData = {
        ...formData,
        paymentsAllocationSequence: data.paymentsAllocationSequence,
        paymentAllocationStrategy: data.paymentAllocationStrategy,
      };

      // Transform data to match API requirements
      const apiPayload = {
        loanName: finalFormData.loanName,
        description: finalFormData.loanDescription,
        partnerReference: "MK-001", // Since this is an MK loan product
        integrationType: 1, // Assuming 1 is for MK products
        loanProductType:
          finalFormData.loanType === "personal"
            ? 1
            : finalFormData.loanType === "business"
              ? 2
              : finalFormData.loanType === "education"
                ? 3
                : 4,
        loanPriceMax: parseFloat(finalFormData.maximumLoanAmount),
        loanInterest: parseFloat(finalFormData.interestRate),
        currency: finalFormData.currency,
      };

      // Call API to create loan product
      await createLoanProduct(apiPayload).unwrap();

      toast({
        title: "Success!",
        description: "Loan product has been created successfully.",
      });

      // Reset form and redirect to loan products page
      dispatch(resetForm());
      router.push("/loan-products");
    } catch (error) {
      console.error("Failed to create loan product:", error);
      toast({
        title: "Error",
        description: "Failed to create loan product. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBack = () => {
    dispatch(prevStep());
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className={"space-y-2"}>
          <div className="flex gap-2 justify-between items-center">
            <h2 className="text-xl font-medium mb-4">Loan fees</h2>
            <Button
              type="button"
              className="flex items-center gap-1"
              onClick={handleAddLoanFee}
            >
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
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Add Loan Fee
            </Button>
          </div>

          <div className="border border-dashed border-gray-300 rounded-md p-8 mb-4 relative">
            {loanFees.length === 0 ? (
              <div className="text-center text-gray-500">
                <p>No loan fees have been added yet!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {loanFees.map((fee) => (
                  <div
                    key={fee.id}
                    className="flex justify-between items-center p-3 border rounded-md"
                  >
                    <div>
                      <p className="font-medium">{fee.name}</p>
                      <p className="text-sm text-gray-500">
                        {fee.amount} ({fee.type})
                      </p>
                    </div>
                    <Button variant="outline" size="sm" type="button">
                      Edit
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-medium mb-4">
            Payment allocation & loan closure
          </h2>

          <div className="space-y-6">
            <FormField
              control={form.control}
              name="paymentsAllocationSequence"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Loan payments allocation sequence{" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select allocation sequence" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="FEES_INTEREST_PRINCIPAL_PENALTIES">
                        FEES, INTEREST, PRINCIPAL, PENALTIES
                      </SelectItem>
                      <SelectItem value="PRINCIPAL_INTEREST_PENALTIES_FEES">
                        PRINCIPAL, INTEREST, PENALTIES, FEES
                      </SelectItem>
                      <SelectItem value="INTEREST_PRINCIPAL_PENALTIES_FEES">
                        INTEREST, PRINCIPAL, PENALTIES, FEES
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paymentAllocationStrategy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Loan payment allocation strategy{" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <SelectWithDescription
                      options={[
                        {
                          value: "installment_schedule",
                          label: "Allocate Based on Installment Schedule",
                          description:
                            "Allocates payments based on the installment schedule without regard to whether interest has been fully accrued.",
                        },
                        {
                          value: "accrued_value_to_date",
                          label:
                            "Allocate Based on Accrued Value to Date (Allow Early Settlement)",
                          description:
                            "Allocations apply to the principal and interest accrued up to the current date. The loan is considered fully paid once the principal is settled, enabling early repayment.",
                        },
                      ]}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Select allocation strategy"
                      error={!!form.formState.errors.paymentAllocationStrategy}
                    />
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
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
          <div className="flex justify-center">
            <Button
              type="button"
              variant="link"
              className="px-0 text-black"
              onClick={handleBack}
              disabled={isLoading}
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

export default StepThreeForm;
