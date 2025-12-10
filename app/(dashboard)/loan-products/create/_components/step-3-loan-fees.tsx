"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { SearchableSelect } from "@/components/ui/searchable-select";
import { useLoanProductForm, type LoanFee } from "../_context/loan-product-form-context";
import { useCreateLoanProduct } from "@/lib/api/hooks/loan-products";

type Step3LoanFeesProps = {
  onBack?: () => void;
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

export function Step3LoanFees({ onBack }: Step3LoanFeesProps) {
  const router = useRouter();
  const { formState, addFee, removeFee, getCombinedFormData, clearForm } = useLoanProductForm();
  const createLoanProductMutation = useCreateLoanProduct();
  const [addFeeOpen, setAddFeeOpen] = useState(false);
  const [createFeeOpen, setCreateFeeOpen] = useState(false);

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

  const handleOpenAddFee = () => {
    setAddFeeOpen(true);
  };

  const handleCloseAddFee = () => {
    setAddFeeOpen(false);
    addFeeForm.reset();
  };

  const handleOpenCreateFee = () => {
    setCreateFeeOpen(true);
  };

  const handleCloseCreateFee = () => {
    setCreateFeeOpen(false);
    createFeeForm.reset();
  };

  const handleSubmitAddFee = (values: LoanFeeFormValues) => {
    addFee(values as LoanFee);
    handleCloseAddFee();
  };

  const handleSubmitCreateFee = (values: LoanFeeFormValues) => {
    addFee(values as LoanFee);
    handleCloseCreateFee();
  };

  const handleSubmitAll = async () => {
    try {
      const formData = getCombinedFormData();
      await createLoanProductMutation.mutateAsync(formData);
      clearForm();
      router.push("/loan-products");
    } catch (error) {
      console.error("Failed to create loan product:", error);
      // TODO: Show error toast/notification
    }
  };

  const currentFees = formState.fees || [];

  return (
    <div className="space-y-8">
      {/* Step label */}
      <div>
        <p className="text-xs font-medium text-primary-green">STEP 3/3</p>
        <h2 className="mt-1 text-2xl font-semibold text-midnight-blue">
          Add MK loan product
        </h2>
        <p className="mt-1 text-sm text-primaryGrey-500 max-w-xl">
          Fill in the details below to create a new loan product.
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
          disabled={createLoanProductMutation.isPending}
        >
          {createLoanProductMutation.isPending ? "Creating..." : "Submit"}
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
                  <SearchableSelect
                    name="loanFeeId"
                    label="Loan fee"
                    notFound="No loan fees found"
                    options={[]}
                    placeholder="Select loan fee"
                    control={addFeeForm.control}
                    required
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
                          <SearchableSelect
                            name="calculationMethod"
                            label=""
                            notFound="No methods found"
                            options={calculationMethodOptions}
                            placeholder="Select calculation method"
                            control={addFeeForm.control}
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

                <SearchableSelect
                  name="collectionRule"
                  label="Fee collection rule"
                  notFound="No collection rules found"
                  options={collectionRuleOptions}
                  placeholder="Select fee collection rule"
                  control={addFeeForm.control}
                  required
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
                          <SearchableSelect
                            name="allocationMethod"
                            label=""
                            notFound="No methods found"
                            options={allocationMethodOptions}
                            placeholder="Select allocation method"
                            control={addFeeForm.control}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <SearchableSelect
                    name="calculationBasis"
                    label="Calculate fee on"
                    notFound="No calculation basis found"
                    options={calculationBasisOptions}
                    placeholder="Select calculation basis"
                    control={addFeeForm.control}
                    required
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
        <DialogContent className="max-w-[900px] p-0 overflow-hidden">
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
                          <SearchableSelect
                            name="calculationMethod"
                            label=""
                            notFound="No methods found"
                            options={calculationMethodOptions}
                            placeholder="Select calculation method"
                            control={createFeeForm.control}
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

                <SearchableSelect
                  name="collectionRule"
                  label="Fee collection rule"
                  notFound="No collection rules found"
                  options={collectionRuleOptions}
                  placeholder="Select fee collection rule"
                  control={createFeeForm.control}
                  required
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
                          <SearchableSelect
                            name="allocationMethod"
                            label=""
                            notFound="No methods found"
                            options={allocationMethodOptions}
                            placeholder="Select allocation method"
                            control={createFeeForm.control}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <SearchableSelect
                    name="calculationBasis"
                    label="Calculate fee on"
                    notFound="No calculation basis found"
                    options={calculationBasisOptions}
                    placeholder="Select calculation basis"
                    control={createFeeForm.control}
                    required
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
    </div>
  );
}


