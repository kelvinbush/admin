import * as React from "react";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { StepOneFormValues } from "../../_schemas/loan-product-schemas";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SelectFormField, SelectOption } from "../form-fields/select-form-field";
import { UserGroupModal } from "../user-group-modal";

// Define provider options
const providerOptions: SelectOption[] = [
  {
    value: "MK Foundation",
    label: "MK Foundation",
    description: "Default loan provider",
  },
];

// Define loan type options
const loanTypeOptions: SelectOption[] = [
  {
    value: "secured",
    label: "Secured",
    description: "Loan backed by collateral",
  },
  {
    value: "unsecured",
    label: "Unsecured",
    description: "Loan without collateral",
  },
];

// Define disbursement method options
const disbursementMethodOptions: SelectOption[] = [
  {
    value: "bank_account",
    label: "Bank Account",
    description: "Disburse funds to a bank account",
  },
  {
    value: "cash_wallet",
    label: "Cash Wallet",
    description: "Disburse funds to a digital wallet",
  },
];

// Define visibility options
const visibilityOptions: SelectOption[] = [
  {
    value: "all_users",
    label: "All Users",
    description: "Visible to all platform users",
  },
  {
    value: "tuungane",
    label: "Tuungane Users",
    description: "Only visible to Tuungane program users",
  },
  {
    value: "giz",
    label: "GIZ-SAIS Users",
    description: "Only visible to GIZ-SAIS program users",
  },
  {
    value: "ecobank",
    label: "Ecobank Users",
    description: "Only visible to Ecobank customers",
  },
];

interface BasicDetailsSectionProps {
  form: UseFormReturn<StepOneFormValues>;
}

export function BasicDetailsSection({ form }: BasicDetailsSectionProps) {
  const [isUserGroupModalOpen, setIsUserGroupModalOpen] = useState(false);

  const handleAddUserGroup = (data: any) => {
    // Add the new user group to the visibility options
    const newOption: SelectOption = {
      value: data.groupName.toLowerCase().replace(/\s+/g, '_'),
      label: data.groupName,
      description: data.description || `${data.groupName} user group`,
    };
    
    // Update the visibilityOptions array (in a real app, this would likely be an API call)
    visibilityOptions.push(newOption);
    
    // Set the form value to the new option
    form.setValue("loanVisibility", newOption.value);
  };

  return (
    <div>
      <h2 className="text-xl font-medium mb-4">Basic loan details</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Loan Name */}
        <FormField
          control={form.control as any}
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

        {/* Loan Code */}
        <FormField
          control={form.control as any}
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

        {/* Loan Provider */}
        <SelectFormField
          name="loanProvider"
          label="Loan provider/organization"
          options={providerOptions}
          control={form.control}
          placeholder="Select provider"
          required={true}
          disabled={true}
        />

        {/* Loan Type */}
        <SelectFormField
          name="loanType"
          label="Loan type"
          options={loanTypeOptions}
          control={form.control}
          placeholder="Select loan type"
          required={true}
        />

        {/* Disbursement Method */}
        <SelectFormField
          name="disbursementMethod"
          label="Disbursement method"
          options={disbursementMethodOptions}
          control={form.control}
          placeholder="Select disbursement method"
          required={true}
        />

        {/* Loan Visibility */}
        <SelectFormField
          name="loanVisibility"
          label="Loan visibility"
          options={visibilityOptions}
          control={form.control}
          placeholder="Select user group"
          required={true}
          addNewOption={{
            label: "+ New user group",
            onClick: () => setIsUserGroupModalOpen(true),
          }}
        />
      </div>

      {/* User Group Modal */}
      <UserGroupModal
        open={isUserGroupModalOpen}
        onClose={() => setIsUserGroupModalOpen(false)}
        onSave={handleAddUserGroup}
      />
    </div>
  );
}
