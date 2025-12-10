"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateLoanFee } from "@/lib/api/hooks/loan-fees";
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

const createLoanFeeSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name must be less than 255 characters"),
  calculationMethod: z.enum(["flat", "percentage"], {
    required_error: "Calculation method is required",
  }),
  rate: z.string().min(1, "Rate is required").refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Rate must be a valid number",
  }),
  collectionRule: z.enum(["upfront", "end_of_term"], {
    required_error: "Collection rule is required",
  }),
  allocationMethod: z.string().min(1, "Allocation method is required"),
  calculationBasis: z.enum(["principal", "total_disbursed"], {
    required_error: "Calculation basis is required",
  }),
});

type CreateLoanFeeFormData = z.infer<typeof createLoanFeeSchema>;

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

interface CreateLoanFeeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
}

export function CreateLoanFeeModal({ open, onOpenChange, onCreated }: CreateLoanFeeModalProps) {
  const createMutation = useCreateLoanFee();

  const form = useForm<CreateLoanFeeFormData>({
    resolver: zodResolver(createLoanFeeSchema),
    defaultValues: {
      name: "",
      calculationMethod: undefined,
      rate: "",
      collectionRule: undefined,
      allocationMethod: "",
      calculationBasis: undefined,
    },
  });

  const onSubmit = async (data: CreateLoanFeeFormData) => {
    try {
      await createMutation.mutateAsync({
        name: data.name,
        calculationMethod: data.calculationMethod,
        rate: Number(data.rate),
        collectionRule: data.collectionRule,
        allocationMethod: data.allocationMethod,
        calculationBasis: data.calculationBasis,
      });
      toast.success("Loan fee created successfully");
      form.reset();
      onOpenChange(false);
      if (onCreated) onCreated();
    } catch (error: any) {
      console.error("Failed to create loan fee:", error);
      toast.error(error?.response?.data?.message || "Failed to create loan fee");
    }
  };

  const handleClose = () => {
    if (!createMutation.isPending) {
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
              Create Loan Fee
            </DialogTitle>
            <DialogDescription className="text-primaryGrey-500">
              Fill in the details below to create a new loan fee.
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
                  disabled={createMutation.isPending}
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
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? "Creating..." : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

