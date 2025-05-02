import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SelectWithDescription } from "@/components/ui/select-with-description";
import { NewOrganizationModal } from "./new-organization-modal";
import { PlusCircle } from "lucide-react";
import { InputWithDropdown } from "@/components/ui/input-with-dropdown";
import { Textarea } from "@/components/ui/textarea";
import {
  formSchema,
  FormData,
  defaultValues,
} from "./_schemas/partner-loan-form-schema";
import {
  loanTypeOptions,
  userGroupOptions,
  processingMethodOptions,
  periodOptions,
  termUnitOptions,
} from "./_options/partner-loan-options";
import { useState } from "react";

interface PartnerLoanFormProps {
  onSubmit: (data: FormData) => void;
}

export function PartnerLoanForm({ onSubmit }: PartnerLoanFormProps) {
  // State for new organization modal
  const [isNewOrgModalOpen, setIsNewOrgModalOpen] = useState(false);
  
  // State for loan provider options
  const [loanProviderOptions, setLoanProviderOptions] = useState([
    {
      value: "melanin-kapital",
      label: "Melanin Kapital",
      description: "Main lending partner",
    },
    {
      value: "equity-bank",
      label: "Equity Bank",
      description: "Banking partner for loan disbursements",
    },
    {
      value: "cooperative-bank",
      label: "Cooperative Bank",
      description: "Banking partner for SME loans",
    },
  ]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h2 className="text-base font-medium mb-4">Basic loan details</h2>
          <div className="grid grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="productName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-normal">
                    Loan product name <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter loan product name"
                      className="h-9 text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-normal">
                    Loan code/identifier <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter loan code"
                      className="h-9 text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="provider"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel className="text-sm font-normal">
                      Loan provider/organization{" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <Button
                      type="button"
                      variant="link"
                      className="h-auto p-0 text-xs text-green-500 hover:text-green-600"
                      onClick={() => setIsNewOrgModalOpen(true)}
                    >
                      + New loan provider
                    </Button>
                  </div>
                  <FormControl>
                    <SelectWithDescription
                      value={field.value}
                      onValueChange={field.onChange}
                      options={loanProviderOptions}
                      placeholder="Select loan provider"
                      error={!!form.formState.errors.provider}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-normal">
                    Loan type <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <SelectWithDescription
                      value={field.value}
                      onValueChange={field.onChange}
                      options={loanTypeOptions}
                      placeholder="Select loan type"
                      error={!!form.formState.errors.type}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="visibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-normal">
                    Loan visibility <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <SelectWithDescription
                      value={field.value}
                      onValueChange={field.onChange}
                      options={userGroupOptions}
                      placeholder="Select user group"
                      error={!!form.formState.errors.visibility}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="processingMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-normal">
                    Loan processing method{" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <SelectWithDescription
                      value={field.value}
                      onValueChange={field.onChange}
                      options={processingMethodOptions}
                      placeholder="Select loan processing method"
                      error={!!form.formState.errors.processingMethod}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="mt-6">
                <FormLabel className="text-sm font-normal">
                  Loan description (optional)
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Briefly describe the loan product"
                    className="resize-none h-24"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <h2 className="text-base font-medium mb-4">
            Loan terms & conditions
          </h2>
          <div className="grid grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="minAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-normal">
                    Minimum loan amount <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <InputWithDropdown
                      {...field}
                      placeholder="Enter amount"
                      type="number"
                      options={[{ label: "KES", value: "KES" }]}
                      dropdownValue="KES"
                      onDropdownValueChange={() => {}}
                      error={!!form.formState.errors.minAmount}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-normal">
                    Maximum loan amount <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <InputWithDropdown
                      {...field}
                      placeholder="Enter amount"
                      type="number"
                      options={[{ label: "KES", value: "KES" }]}
                      dropdownValue="KES"
                      onDropdownValueChange={() => {}}
                      error={!!form.formState.errors.maxAmount}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="minTerm"
              render={({ field: { ...field } }) => (
                <FormItem>
                  <FormLabel className="text-sm font-normal">
                    Minimum loan term <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <InputWithDropdown
                      {...field}
                      placeholder="Enter value"
                      type="number"
                      options={termUnitOptions}
                      dropdownValue={form.watch("minTermUnit") || "months"}
                      onDropdownValueChange={(value) =>
                        form.setValue("minTermUnit", value)
                      }
                      error={!!form.formState.errors.minTerm}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxTerm"
              render={({ field: { ...field } }) => (
                <FormItem>
                  <FormLabel className="text-sm font-normal">
                    Maximum loan term <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <InputWithDropdown
                      {...field}
                      placeholder="Enter value"
                      type="number"
                      options={termUnitOptions}
                      dropdownValue={form.watch("maxTermUnit") || "months"}
                      onDropdownValueChange={(value) =>
                        form.setValue("maxTermUnit", value)
                      }
                      error={!!form.formState.errors.maxTerm}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="interestRate"
              render={({ field: { ...field } }) => (
                <FormItem>
                  <FormLabel className="text-sm font-normal">
                    Interest rate (%) <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <InputWithDropdown
                      {...field}
                      placeholder="Enter percentage"
                      type="number"
                      options={periodOptions}
                      dropdownValue={
                        form.watch("interestRatePeriod") || "per_month"
                      }
                      onDropdownValueChange={(value) =>
                        form.setValue("interestRatePeriod", value)
                      }
                      error={!!form.formState.errors.interestRate}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-10 bg-[#B6BABC] hover:bg-gray-500"
        >
          Submit
        </Button>
      </form>

      {/* New Organization Modal */}
      <NewOrganizationModal
        open={isNewOrgModalOpen}
        onClose={() => setIsNewOrgModalOpen(false)}
        onSave={(org) => {
          // Add the new organization to the loan provider options
          const newOption = {
            value: org.name.toLowerCase().replace(/\s+/g, '-'),
            label: org.name,
            description: org.description || `${org.name} (${org.type})`
          };
          
          // Update the options
          setLoanProviderOptions([...loanProviderOptions, newOption]);
          
          // Set the form value to the new organization
          form.setValue('provider', newOption.value);
          
          // Close the modal
          setIsNewOrgModalOpen(false);
        }}
      />
    </Form>
  );
}
