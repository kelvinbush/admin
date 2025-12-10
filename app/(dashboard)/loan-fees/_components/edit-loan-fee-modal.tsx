"use client";

import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUpdateLoanFee } from "@/lib/api/hooks/loan-fees";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SearchableSelect } from "@/components/ui/searchable-select";

const updateLoanFeeSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name must be less than 255 characters").optional(),
  calculationMethod: z.enum(["flat", "percentage"]).optional(),
  rate: z.string().optional().refine((val) => !val || (!isNaN(Number(val)) && Number(val) >= 0), {
    message: "Rate must be a valid number",
  }),
  collectionRule: z.enum(["upfront", "end_of_term"]).optional(),
  allocationMethod: z.string().optional(),
  calculationBasis: z.enum(["principal", "total_disbursed"]).optional(),
});

type UpdateLoanFeeFormData = z.infer<typeof updateLoanFeeSchema>;

const calculationMethodOptions = [
  { label: "Flat", value: "flat" },
  { label: "Percentage", value: "percentage" },
];

const collectionRuleOptions = [
  { label: "Upfront", value: "upfront" },
  { label: "End of Term", value: "end_of_term" },
];

const allocationMethodOptions = [
  { label: "Cleared in the 1st installment", value: "first_installment" },
  { label: "Spread over installments", value: "spread_installments" },
];

const calculationBasisOptions = [
  { label: "Principal", value: "principal" },
  { label: "Total Disbursed Amount", value: "total_disbursed" },
];

interface EditLoanFeeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loanFeeId: string;
  initialData: {
    name: string;
    calculationMethod: "flat" | "percentage";
    rate: number;
    collectionRule: "upfront" | "end_of_term";
    allocationMethod: string;
    calculationBasis: "principal" | "total_disbursed";
  };
  onUpdated?: () => void;
}

export function EditLoanFeeModal({
  open,
  onOpenChange,
  loanFeeId,
  initialData,
  onUpdated,
}: EditLoanFeeModalProps) {
  const updateMutation = useUpdateLoanFee(loanFeeId);

  const form = useForm<UpdateLoanFeeFormData>({
    resolver: zodResolver(updateLoanFeeSchema),
    defaultValues: {
      name: initialData.name,
      calculationMethod: initialData.calculationMethod,
      rate: initialData.rate.toString(),
      collectionRule: initialData.collectionRule,
      allocationMethod: initialData.allocationMethod,
      calculationBasis: initialData.calculationBasis,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: initialData.name,
        calculationMethod: initialData.calculationMethod,
        rate: initialData.rate.toString(),
        collectionRule: initialData.collectionRule,
        allocationMethod: initialData.allocationMethod,
        calculationBasis: initialData.calculationBasis,
      });
    }
  }, [open, initialData, form]);

  const onSubmit = async (data: UpdateLoanFeeFormData) => {
    try {
      await updateMutation.mutateAsync({
        name: data.name,
        calculationMethod: data.calculationMethod,
        rate: data.rate ? Number(data.rate) : undefined,
        collectionRule: data.collectionRule,
        allocationMethod: data.allocationMethod,
        calculationBasis: data.calculationBasis,
      });
      toast.success("Loan fee updated successfully");
      form.reset();
      onOpenChange(false);
      if (onUpdated) onUpdated();
    } catch (error: any) {
      console.error("Failed to update loan fee:", error);
      toast.error(error?.response?.data?.message || "Failed to update loan fee");
    }
  };

  const handleClose = () => {
    if (!updateMutation.isPending) {
      form.reset();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[900px] p-0 overflow-hidden">
        <div className="px-8 py-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-medium text-midnight-blue">
              Edit Loan Fee
            </DialogTitle>
            <DialogDescription className="text-primaryGrey-500">
              Update the details below to modify this loan fee.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required className="text-sm text-[#444C53]">
                      Loan Fee Name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter loan fee name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SearchableSelect
                  name="calculationMethod"
                  label="Calculation Method"
                  notFound="No methods found"
                  options={calculationMethodOptions}
                  placeholder="Select calculation method"
                  control={form.control}
                  required
                />

                <FormField
                  control={form.control}
                  name="rate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required className="text-sm text-[#444C53]">
                        Fee Rate/Percentage
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          step="0.01"
                          placeholder="Enter value"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <SearchableSelect
                name="collectionRule"
                label="Fee Collection Rule"
                notFound="No collection rules found"
                options={collectionRuleOptions}
                placeholder="Select fee collection rule"
                control={form.control}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="allocationMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required className="text-sm text-[#444C53]">
                        Fee Allocation Method
                      </FormLabel>
                      <FormControl>
                        <SearchableSelect
                          name="allocationMethod"
                          label=""
                          notFound="No methods found"
                          options={allocationMethodOptions}
                          placeholder="Select allocation method"
                          control={form.control}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <SearchableSelect
                  name="calculationBasis"
                  label="Calculate Fee On"
                  notFound="No calculation basis found"
                  options={calculationBasisOptions}
                  placeholder="Select calculation basis"
                  control={form.control}
                  required
                />
              </div>

              <DialogFooter className="mt-8 border-t pt-6 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={updateMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="text-white border-0"
                  style={{
                    background:
                      "linear-gradient(90deg, var(--green-500, #0C9) 0%, var(--pink-500, #F0459C) 100%)",
                  }}
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? "Updating..." : "Update"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

