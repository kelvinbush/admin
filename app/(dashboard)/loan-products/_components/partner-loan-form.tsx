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
import { NewPartnerModal } from "./new-partner-modal";
import { InputWithDropdown } from "@/components/ui/input-with-dropdown";
import { Textarea } from "@/components/ui/textarea";
import {
  defaultValues,
  FormData,
  formSchema,
} from "./_schemas/partner-loan-form-schema";
import {
  loanTypeOptions as defaultLoanTypeOptions,
  periodOptions,
  processingMethodOptions,
  termUnitOptions,
  interestCalculationMethodOptions,
} from "./_options/partner-loan-options";
import { currencyOptions } from "./_options/currency-options";
import { useEffect, useState } from "react";
import { useGetAllPartnersQuery } from "@/lib/redux/services/partner";
import { selectCurrentToken } from "@/lib/redux/features/authSlice";
import { useAppSelector } from "@/lib/redux/hooks";
import { PlusCircle } from "lucide-react";
import { CurrencySelect } from "./currency-select";

interface PartnerLoanFormProps {
  onSubmit: (data: FormData) => void;
  initialData?: FormData;
  isEditMode?: boolean;
}

export function PartnerLoanForm({
  onSubmit,
  initialData,
  isEditMode = false,
}: PartnerLoanFormProps) {
  const [isNewPartnerModalOpen, setIsNewPartnerModalOpen] = useState(false);

  const guid = useAppSelector(selectCurrentToken);
  const { data: partners, isLoading: isLoadingPartners } =
    useGetAllPartnersQuery(guid as string);

  const [partnerOptions, setPartnerOptions] = useState<
    Array<{
      value: string;
      label: string;
      description?: string;
    }>
  >([]);

  // Update partner options when partners data is loaded
  useEffect(() => {
    if (partners) {
      setPartnerOptions(
        partners.map((partner) => ({
          value: partner.companyReference,
          label: partner.companyName,
          description: `Partner organization`,
        })),
      );
    }
  }, [partners]);

  const [loanTypeOptions] = useState(defaultLoanTypeOptions);

  // Handle new partner creation
  const handlePartnerCreated = (partnerId: string, partnerName: string) => {
    setPartnerOptions((prev) => [
      ...prev,
      {
        value: partnerId,
        label: partnerName,
        description: `Partner organization`,
      },
    ]);

    // Set the newly created partner as the selected value
    form.setValue("partnerReference", partnerId);
  };

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || defaultValues,
  });

  // Handle form submission with logging
  const handleSubmit = (data: FormData) => {
    console.log("Form submitted with data:", data);
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div>
          <h2 className="text-base font-medium mb-4">
            {isEditMode ? "Edit" : "Basic"} loan details
          </h2>
          <div className="grid grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="loanName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-normal">
                    Loan name <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter loan name"
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
              name="partnerReference"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel className="text-sm font-normal">
                      Partner
                    </FormLabel>
                    <Button
                      type="button"
                      variant="link"
                      className="h-6 px-2 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                      onClick={() => setIsNewPartnerModalOpen(true)}
                    >
                      <PlusCircle className="h-3 w-3 mr-1" /> New partner
                    </Button>
                  </div>
                  <FormControl>
                    <SelectWithDescription
                      value={field.value || ""}
                      onValueChange={field.onChange}
                      options={partnerOptions}
                      placeholder={
                        isLoadingPartners
                          ? "Loading partners..."
                          : "Select partner"
                      }
                      error={!!form.formState.errors.partnerReference}
                      disabled={isLoadingPartners}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="disbursementAccount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-normal">
                    Disbursement account <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <SelectWithDescription
                      value={field.value || ""}
                      onValueChange={field.onChange}
                      options={[
                        {
                          value: "BANK",
                          label: "Bank account",
                          description:
                            "Funds will be disbursed to a bank account",
                        },
                        {
                          value: "CASH_WALLET",
                          label: "Cash wallet",
                          description:
                            "Funds will be disbursed to a digital wallet",
                        },
                      ]}
                      placeholder="Select disbursement method"
                      error={!!form.formState.errors.disbursementAccount}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="loanProductType"
              render={({ field }) => {
                const stringValue =
                  field.value !== undefined ? field.value.toString() : "";

                return (
                  <FormItem>
                    <FormLabel className="text-sm font-normal">
                      Loan product type <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <SelectWithDescription
                        value={stringValue}
                        onValueChange={(value) => {
                          console.log("Selected loan type:", value);
                          field.onChange(parseInt(value, 10));
                        }}
                        options={loanTypeOptions}
                        placeholder="Select loan type"
                        error={!!form.formState.errors.loanProductType}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="integrationType"
              render={({ field }) => {
                const stringValue =
                  field.value !== undefined ? field.value.toString() : "";

                return (
                  <FormItem>
                    <FormLabel className="text-sm font-normal">
                      Integration type <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <SelectWithDescription
                        value={stringValue}
                        onValueChange={(value) => {
                          console.log("Selected integration type:", value);
                          field.onChange(parseInt(value, 10));
                        }}
                        options={processingMethodOptions}
                        placeholder="Select integration type"
                        error={!!form.formState.errors.integrationType}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
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

          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem className="mt-6">
                <FormLabel className="text-sm font-normal">
                  Currency <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <CurrencySelect
                    value={field.value}
                    onValueChange={field.onChange}
                    options={currencyOptions}
                    placeholder="Select currency"
                    error={!!form.formState.errors.currency}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="interestCalculationMethod"
            render={({ field }) => (
              <FormItem className="mt-6">
                <FormLabel className="text-sm font-normal">
                  Interest calculation method{" "}
                  <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <SelectWithDescription
                    value={field.value}
                    onValueChange={field.onChange}
                    options={interestCalculationMethodOptions}
                    placeholder="Select calculation method"
                    error={!!form.formState.errors.interestCalculationMethod}
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
              name="loanPriceMin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-normal">
                    Minimum loan amount <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      value={field.value.toString()}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                      placeholder="Enter amount"
                      className={`h-9 text-sm ${!!form.formState.errors.loanPriceMin ? "border-red-500" : ""}`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="loanPriceMax"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-normal">
                    Maximum loan amount <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      value={field.value.toString()}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                      placeholder="Enter amount"
                      className={`h-9 text-sm ${!!form.formState.errors.loanPriceMax ? "border-red-500" : ""}`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="minimumTerm"
              render={({ field }) => {
                const termPeriod = form.watch("termPeriod");

                return (
                  <FormItem>
                    <FormLabel className="text-sm font-normal">
                      Minimum term <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <InputWithDropdown
                        value={field.value}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          field.onChange(e.target.value)
                        }
                        placeholder="Enter minimum term"
                        type="text"
                        options={termUnitOptions.map((option) => ({
                          label: option.label,
                          value: option.value,
                        }))}
                        dropdownValue={termPeriod}
                        onDropdownValueChange={(value: string) => {
                          form.setValue("termPeriod", value);
                        }}
                        error={!!form.formState.errors.minimumTerm}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="maximumTerm"
              render={({ field }) => {
                const termPeriod = form.watch("termPeriod");

                return (
                  <FormItem>
                    <FormLabel className="text-sm font-normal">
                      Maximum term <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <InputWithDropdown
                        value={field.value}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          field.onChange(e.target.value)
                        }
                        placeholder="Enter maximum term"
                        type="text"
                        options={termUnitOptions.map((option) => ({
                          label: option.label,
                          value: option.value,
                        }))}
                        dropdownValue={termPeriod}
                        onDropdownValueChange={(value: string) => {
                          form.setValue("termPeriod", value);
                        }}
                        error={!!form.formState.errors.maximumTerm}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="loanInterest"
              render={({ field }) => {
                // Watch the interestPeriod to make the dropdown reactive
                const interestPeriod = form.watch("interestPeriod");

                return (
                  <FormItem>
                    <FormLabel className="text-sm font-normal">
                      Interest rate <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <InputWithDropdown
                        value={field.value.toString()}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                        placeholder="Enter interest rate"
                        type="number"
                        options={periodOptions.map((option) => ({
                          label: option.label,
                          value: option.value,
                        }))}
                        dropdownValue={interestPeriod}
                        onDropdownValueChange={(value: string) => {
                          form.setValue("interestPeriod", value);
                        }}
                        error={!!form.formState.errors.loanInterest}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-10 bg-primary-green hover:bg-primary-green/90 text-white"
        >
          {isEditMode ? "Update" : "Create"} Loan Product
        </Button>
      </form>

      <NewPartnerModal
        open={isNewPartnerModalOpen}
        onClose={() => setIsNewPartnerModalOpen(false)}
        onSave={handlePartnerCreated}
      />
    </Form>
  );
}
