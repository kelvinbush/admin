"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { ModalSelect } from "@/components/ui/modal-select";
import { useLoanProductForm, type LoanFee } from "../_context/loan-product-form-context";
import { useCreateLoanProduct, useUpdateLoanProduct } from "@/lib/api/hooks/loan-products";
import { useLoanFees, useCreateLoanFee, useUpdateLoanFee } from "@/lib/api/hooks/loan-fees";

type Step3LoanFeesProps = {
  onBack?: () => void;
  loanProductId?: string;
};

type LoanFeeFormValues = {
  loanFeeId?: string;
  feeName?: string;
  calculationMethod: string;
  rate: string;
  collectionRule: string;
  allocationMethod: string;
  calculationBasis: string;
};

const calculationMethodOptions = [
  { label: "Flat", value: "flat" },
  { label: "Percentage", value: "percentage" },
];

const collectionRuleOptions = [
  { label: "Upfront", value: "upfront" },
  { label: "End-of-term", value: "end_of_term" },
];

const allocationMethodOptions = [
  { label: "Cleared in the 1st installment", value: "first_installment" },
  { label: "Spread over installments", value: "spread_installments" },
];

const calculationBasisOptions = [
  { label: "Principal", value: "principal" },
  { label: "Total disbursed amount", value: "total_disbursed" },
];

export function Step3LoanFees({ onBack, loanProductId }: Step3LoanFeesProps) {
  const router = useRouter();
  const { formState, addFee, updateFee, removeFee, getCombinedFormData, clearForm, isEditMode } = useLoanProductForm();
  const createLoanProductMutation = useCreateLoanProduct();
  const updateLoanProductMutation = useUpdateLoanProduct(loanProductId || "");
  
  // Fetch loan fees for dropdown
  const { data: loanFeesData } = useLoanFees(undefined, { page: 1, limit: 100 });
  
  // Transform loan fees to options
  const loanFeeOptions = useMemo(() => {
    if (!loanFeesData?.items) return [];
    return loanFeesData.items
      .filter((fee) => !fee.isArchived) // Only show non-archived fees
      .map((fee) => ({
        label: fee.name,
        value: fee.id,
      }));
  }, [loanFeesData]);
  
  // Mutations for creating/updating loan fees
  const createLoanFeeMutation = useCreateLoanFee();
  const [editingFeeIndex, setEditingFeeIndex] = useState<number | null>(null);
  const [editingFeeId, setEditingFeeId] = useState<string | null>(null);
  
  const [addFeeOpen, setAddFeeOpen] = useState(false);
  const [createFeeOpen, setCreateFeeOpen] = useState(false);
  const [editFeeOpen, setEditFeeOpen] = useState(false);

  const addFeeForm = useForm<LoanFeeFormValues>({
    defaultValues: {
      loanFeeId: "",
      calculationMethod: "",
      rate: "",
      collectionRule: "",
      allocationMethod: "",
      calculationBasis: "",
    },
  });

  const createFeeForm = useForm<LoanFeeFormValues>({
    defaultValues: {
      feeName: "",
      calculationMethod: "",
      rate: "",
      collectionRule: "",
      allocationMethod: "",
      calculationBasis: "",
    },
  });

  const editFeeForm = useForm<LoanFeeFormValues>({
    defaultValues: {
      loanFeeId: "",
      feeName: "",
      calculationMethod: "",
      rate: "",
      collectionRule: "",
      allocationMethod: "",
      calculationBasis: "",
    },
  });

  const handleOpenAddFee = () => {
    setAddFeeOpen(true);
  };

  const handleCloseAddFee = () => {
    setAddFeeOpen(false);
    addFeeForm.reset();
  };

  const handleOpenCreateFee = () => {
    // Close the add fee modal first to avoid z-index conflicts
    setAddFeeOpen(false);
    // Small delay to ensure the first modal closes before opening the second
    setTimeout(() => {
      setCreateFeeOpen(true);
    }, 100);
  };

  const handleCloseCreateFee = () => {
    setCreateFeeOpen(false);
    createFeeForm.reset();
  };

  const handleSubmitAddFee = (values: LoanFeeFormValues) => {
    addFee(values as LoanFee);
    handleCloseAddFee();
  };

  const handleSubmitCreateFee = async (values: LoanFeeFormValues) => {
    try {
      // If creating a new fee, save it to the backend first
      if (!values.loanFeeId && values.feeName) {
        const createdFee = await createLoanFeeMutation.mutateAsync({
          name: values.feeName,
          calculationMethod: values.calculationMethod as "flat" | "percentage",
          rate: Number(values.rate),
          collectionRule: values.collectionRule as "upfront" | "end_of_term",
          allocationMethod: values.allocationMethod,
          calculationBasis: values.calculationBasis as "principal" | "total_disbursed",
        });
        
        // Add to form with the created fee ID
        addFee({
          ...values,
          loanFeeId: createdFee.id,
        } as LoanFee);
        toast.success("Loan fee created and added");
      } else {
        // Just add to form (using existing fee ID)
        addFee(values as LoanFee);
      }
      handleCloseCreateFee();
    } catch (error: any) {
      console.error("Failed to create loan fee:", error);
      toast.error(error?.response?.data?.message || "Failed to create loan fee");
    }
  };
  
  const handleOpenEditFee = (index: number, fee: LoanFee) => {
    setEditingFeeIndex(index);
    setEditingFeeId(fee.loanFeeId || null);
    editFeeForm.reset({
      loanFeeId: fee.loanFeeId,
      feeName: fee.feeName,
      calculationMethod: fee.calculationMethod,
      rate: fee.rate,
      collectionRule: fee.collectionRule,
      allocationMethod: fee.allocationMethod,
      calculationBasis: fee.calculationBasis,
    });
    setEditFeeOpen(true);
  };
  
  const handleCloseEditFee = () => {
    setEditFeeOpen(false);
    setEditingFeeIndex(null);
    setEditingFeeId(null);
    editFeeForm.reset();
  };
  
  // Create update mutation - we'll use it conditionally
  const updateLoanFeeMutation = editingFeeId ? useUpdateLoanFee(editingFeeId) : null;
  
  const handleSubmitEditFee = async (values: LoanFeeFormValues) => {
    try {
      if (editingFeeIndex === null) return;
      
      // If editing an existing fee that has an ID, update it in the backend
      if (editingFeeId && updateLoanFeeMutation && values.loanFeeId === editingFeeId) {
        await updateLoanFeeMutation.mutateAsync({
          name: values.feeName,
          calculationMethod: values.calculationMethod as "flat" | "percentage",
          rate: Number(values.rate),
          collectionRule: values.collectionRule as "upfront" | "end_of_term",
          allocationMethod: values.allocationMethod,
          calculationBasis: values.calculationBasis as "principal" | "total_disbursed",
        });
        toast.success("Loan fee updated");
      }
      
      // Update the fee in the form state using updateFee
      updateFee(editingFeeIndex, values as LoanFee);
      
      handleCloseEditFee();
    } catch (error: any) {
      console.error("Failed to update loan fee:", error);
      toast.error(error?.response?.data?.message || "Failed to update loan fee");
    }
  };

  const handleSubmitAll = async () => {
    try {
      const formData = getCombinedFormData();
      
      // Validate required fields before submission
      if (formData.interestRate === undefined || formData.interestRate === null) {
        toast.error("Interest rate is required. Please go back to Step 2 and fill in the interest rate.");
        return;
      }
      
      if (isEditMode && loanProductId) {
        await updateLoanProductMutation.mutateAsync(formData);
        toast.success("Loan product updated successfully");
      } else {
        await createLoanProductMutation.mutateAsync(formData);
        toast.success("Loan product created successfully");
      }
      
      clearForm();
      router.push("/loan-products");
    } catch (error: any) {
      console.error(`Failed to ${isEditMode ? "update" : "create"} loan product:`, error);
      const errorMessage = error?.response?.data?.message || error?.message || `Failed to ${isEditMode ? "update" : "create"} loan product. Please try again.`;
      toast.error(errorMessage);
    }
  };

  const currentFees = formState.fees || [];

  return (
    <div className="space-y-8">
      {/* Step label */}
      <div>
        <p className="text-xs font-medium text-primary-green">STEP 3/3</p>
        <h2 className="mt-1 text-2xl font-semibold text-midnight-blue">
          {isEditMode ? "Edit loan product" : "Add loan product"}
        </h2>
        <p className="mt-1 text-sm text-primaryGrey-500 max-w-xl">
          {isEditMode
            ? "Update the details below to modify this loan product."
            : "Fill in the details below to create a new loan product."}
        </p>
      </div>

      {/* Loan fees section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-midnight-blue">Loan fees</h3>
          <Button
            type="button"
            className="h-9 px-4 text-white border-0"
            style={{
              background:
                "linear-gradient(90deg, var(--green-500, #0C9) 0%, var(--pink-500, #F0459C) 100%)",
            }}
            onClick={handleOpenAddFee}
          >
            + Add loan fee
          </Button>
        </div>

        {currentFees.length === 0 ? (
          <div className="mt-2 flex items-center justify-center rounded-xl border border-dashed border-primaryGrey-300 bg-white px-6 py-16 text-sm text-primaryGrey-500">
            No loan fees have been added yet!
          </div>
        ) : (
          <div className="mt-2 space-y-3">
            {currentFees.map((fee, index) => (
              <div
                key={index}
                className="rounded-md border border-primaryGrey-100 bg-primaryGrey-25 px-4 py-3 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-midnight-blue">
                    {fee.feeName || fee.loanFeeId || "Unnamed fee"}
                  </p>
                  <p className="text-xs text-primaryGrey-500">
                    {fee.calculationMethod} - {fee.rate}%
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingFeeIndex(index);
                      setEditingFeeId(fee.loanFeeId || null);
                      // Pre-fill edit form
                      editFeeForm.reset({
                        loanFeeId: fee.loanFeeId,
                        feeName: fee.feeName,
                        calculationMethod: fee.calculationMethod,
                        rate: fee.rate,
                        collectionRule: fee.collectionRule,
                        allocationMethod: fee.allocationMethod,
                        calculationBasis: fee.calculationBasis,
                      });
                      setEditFeeOpen(true);
                    }}
                    className="text-primary-green hover:text-primary-green hover:bg-green-50"
                  >
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFee(index)}
                    className="text-primaryGrey-500 hover:text-red-600"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer actions */}
      <div className="mt-16 flex flex-col gap-4">
        <Button
          type="button"
          className="w-full h-11 border-0 text-sm text-white"
          style={{
            background:
              "linear-gradient(90deg, var(--green-500, #0C9) 0%, var(--pink-500, #F0459C) 100%)",
          }}
          onClick={handleSubmitAll}
          disabled={createLoanProductMutation.isPending || updateLoanProductMutation.isPending}
        >
          {createLoanProductMutation.isPending || updateLoanProductMutation.isPending
            ? (isEditMode ? "Updating..." : "Creating...")
            : "Submit"}
        </Button>
        <button
          type="button"
          className="mx-auto text-sm text-primaryGrey-500 hover:text-midnight-blue"
          onClick={onBack}
        >
          ← Back
        </button>
      </div>

      {/* Add loan fee modal */}
      <Dialog open={addFeeOpen} onOpenChange={setAddFeeOpen}>
        <DialogContent className="max-w-[900px] p-0 overflow-hidden">
          <div className="px-8 py-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-medium text-midnight-blue">
                Add loan fee
              </DialogTitle>
              <DialogDescription className="text-primaryGrey-500">
                Select an existing loan fee or create a new one to attach to
                this loan product.
              </DialogDescription>
            </DialogHeader>

            <Form {...addFeeForm}>
              <form
                className="mt-6 space-y-6"
                onSubmit={addFeeForm.handleSubmit(handleSubmitAddFee)}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                  <FormField
                    control={addFeeForm.control}
                    name="loanFeeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required className="text-sm text-[#444C53]">
                          Loan fee
                        </FormLabel>
                        <FormControl>
                          <ModalSelect
                            options={loanFeeOptions.map(opt => ({ value: opt.value, label: opt.label }))}
                            value={field.value}
                            onValueChange={field.onChange}
                            placeholder="Select loan fee"
                            searchable
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end mt-8 md:mt-[26px]">
                    <button
                      type="button"
                      className="text-xs font-medium text-primary-green hover:underline"
                      onClick={handleOpenCreateFee}
                    >
                      + New loan fee
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={addFeeForm.control}
                    name="calculationMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          required
                          className="text-sm text-[#444C53]"
                        >
                          Fee calculation method
                        </FormLabel>
                        <FormControl>
                          <ModalSelect
                            options={calculationMethodOptions.map(opt => ({ value: opt.value, label: opt.label }))}
                            value={addFeeForm.watch("calculationMethod")}
                            onValueChange={(value) => addFeeForm.setValue("calculationMethod", value)}
                            placeholder="Select calculation method"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={addFeeForm.control}
                    name="rate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          required
                          className="text-sm text-[#444C53]"
                        >
                          Rate (%)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            placeholder="Enter value"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={addFeeForm.control}
                  name="collectionRule"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required className="text-sm text-[#444C53]">
                        Fee collection rule
                      </FormLabel>
                      <FormControl>
                        <ModalSelect
                          options={collectionRuleOptions.map(opt => ({ value: opt.value, label: opt.label }))}
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder="Select fee collection rule"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={addFeeForm.control}
                    name="allocationMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          required
                          className="text-sm text-[#444C53]"
                        >
                          Fee allocation method
                        </FormLabel>
                        <FormControl>
                          <ModalSelect
                            options={allocationMethodOptions.map(opt => ({ value: opt.value, label: opt.label }))}
                            value={addFeeForm.watch("allocationMethod")}
                            onValueChange={(value) => addFeeForm.setValue("allocationMethod", value)}
                            placeholder="Select allocation method"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={addFeeForm.control}
                    name="calculationBasis"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required className="text-sm text-[#444C53]">
                          Calculate fee on
                        </FormLabel>
                        <FormControl>
                          <ModalSelect
                            options={calculationBasisOptions.map(opt => ({ value: opt.value, label: opt.label }))}
                            value={field.value}
                            onValueChange={field.onChange}
                            placeholder="Select calculation basis"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter className="mt-8 border-t pt-6 flex items-center justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseAddFee}
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
                  >
                    Save
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create loan fee modal */}
      <Dialog open={createFeeOpen} onOpenChange={setCreateFeeOpen}>
        <DialogContent className="max-w-[900px] p-0 overflow-hidden" style={{ zIndex: 100 }}>
          <div className="px-8 py-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-medium text-midnight-blue">
                Create loan fee
              </DialogTitle>
              <DialogDescription className="text-primaryGrey-500">
                Fill in the details below to create a new loan fee.
              </DialogDescription>
            </DialogHeader>

            <Form {...createFeeForm}>
              <form
                className="mt-6 space-y-6"
                onSubmit={createFeeForm.handleSubmit(handleSubmitCreateFee)}
              >
                <FormField
                  control={createFeeForm.control}
                  name="feeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        required
                        className="text-sm text-[#444C53]"
                      >
                        Loan fee name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter loan fee name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={createFeeForm.control}
                    name="calculationMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          required
                          className="text-sm text-[#444C53]"
                        >
                          Fee calculation method
                        </FormLabel>
                        <FormControl>
                          <ModalSelect
                            options={calculationMethodOptions.map(opt => ({ value: opt.value, label: opt.label }))}
                            value={createFeeForm.watch("calculationMethod")}
                            onValueChange={(value) => createFeeForm.setValue("calculationMethod", value)}
                            placeholder="Select calculation method"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={createFeeForm.control}
                    name="rate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          required
                          className="text-sm text-[#444C53]"
                        >
                          Rate (%)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            placeholder="Enter value"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={createFeeForm.control}
                  name="collectionRule"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required className="text-sm text-[#444C53]">
                        Fee collection rule
                      </FormLabel>
                      <FormControl>
                        <ModalSelect
                          options={collectionRuleOptions.map(opt => ({ value: opt.value, label: opt.label }))}
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder="Select fee collection rule"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={createFeeForm.control}
                    name="allocationMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          required
                          className="text-sm text-[#444C53]"
                        >
                          Fee allocation method
                        </FormLabel>
                        <FormControl>
                          <ModalSelect
                            options={allocationMethodOptions.map(opt => ({ value: opt.value, label: opt.label }))}
                            value={createFeeForm.watch("allocationMethod")}
                            onValueChange={(value) => createFeeForm.setValue("allocationMethod", value)}
                            placeholder="Select allocation method"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={createFeeForm.control}
                    name="calculationBasis"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required className="text-sm text-[#444C53]">
                          Calculate fee on
                        </FormLabel>
                        <FormControl>
                          <ModalSelect
                            options={calculationBasisOptions.map(opt => ({ value: opt.value, label: opt.label }))}
                            value={field.value}
                            onValueChange={field.onChange}
                            placeholder="Select calculation basis"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter className="mt-8 border-t pt-6 flex items-center justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseCreateFee}
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
                  >
                    Save
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit loan fee modal */}
      <Dialog open={editFeeOpen} onOpenChange={setEditFeeOpen}>
        <DialogContent className="max-w-[900px] p-0 overflow-hidden" style={{ zIndex: 100 }}>
          <div className="px-8 py-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-medium text-midnight-blue">
                Edit loan fee
              </DialogTitle>
              <DialogDescription className="text-primaryGrey-500">
                Update the details below to modify this loan fee.
              </DialogDescription>
            </DialogHeader>

            <Form {...editFeeForm}>
              <form
                className="mt-6 space-y-6"
                onSubmit={editFeeForm.handleSubmit(handleSubmitEditFee)}
              >
                <FormField
                  control={editFeeForm.control}
                  name="feeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        required
                        className="text-sm text-[#444C53]"
                      >
                        Loan fee name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter loan fee name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={editFeeForm.control}
                    name="calculationMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required className="text-sm text-[#444C53]">
                          Calculation method
                        </FormLabel>
                        <FormControl>
                          <ModalSelect
                            options={calculationMethodOptions.map(opt => ({ value: opt.value, label: opt.label }))}
                            value={field.value}
                            onValueChange={field.onChange}
                            placeholder="Select calculation method"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editFeeForm.control}
                    name="rate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          required
                          className="text-sm text-[#444C53]"
                        >
                          Fee rate/percentage
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            placeholder="Enter value"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={editFeeForm.control}
                  name="collectionRule"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required className="text-sm text-[#444C53]">
                        Fee collection rule
                      </FormLabel>
                      <FormControl>
                        <ModalSelect
                          options={collectionRuleOptions.map(opt => ({ value: opt.value, label: opt.label }))}
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder="Select fee collection rule"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={editFeeForm.control}
                    name="allocationMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          required
                          className="text-sm text-[#444C53]"
                        >
                          Fee allocation method
                        </FormLabel>
                        <FormControl>
                          <ModalSelect
                            options={allocationMethodOptions.map(opt => ({ value: opt.value, label: opt.label }))}
                            value={editFeeForm.watch("allocationMethod")}
                            onValueChange={(value) => editFeeForm.setValue("allocationMethod", value)}
                            placeholder="Select allocation method"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editFeeForm.control}
                    name="calculationBasis"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required className="text-sm text-[#444C53]">
                          Calculate fee on
                        </FormLabel>
                        <FormControl>
                          <ModalSelect
                            options={calculationBasisOptions.map(opt => ({ value: opt.value, label: opt.label }))}
                            value={field.value}
                            onValueChange={field.onChange}
                            placeholder="Select calculation basis"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter className="mt-8 border-t pt-6 flex items-center justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseEditFee}
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
                    disabled={editingFeeId ? false : true}
                  >
                    {editingFeeId ? "Update" : "Save"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}


