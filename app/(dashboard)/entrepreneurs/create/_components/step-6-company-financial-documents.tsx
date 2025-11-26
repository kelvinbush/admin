"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { SelectWithDescription, type SelectOption } from "@/components/ui/select-with-description";
import { BankStatementEntry } from "./bank-statement-entry";
import { FinancialStatementEntry } from "./financial-statement-entry";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { useEffect } from "react";
import { useSMEOnboarding } from "../_context/sme-onboarding-context";
import { useSaveFinancialDocuments, useSMEBusinessDocuments } from "@/lib/api/hooks/sme";
import { toast } from "@/hooks/use-toast";

const bankStatementSchema = z.object({
  bankName: z.string().min(1, "Bank name is required"),
  specifyBankName: z.string().optional(),
  statementFile: z.string().min(1, "Bank statement file is required"),
  password: z.string().optional(),
}).refine((data) => {
  if (data.bankName === "other" && !data.specifyBankName) {
    return false;
  }
  return true;
}, {
  message: "Please specify the bank name",
  path: ["specifyBankName"],
});

const financialStatementSchema = z.object({
  year: z.string().min(1, "Financial statement year is required"),
  statementFile: z.string().min(1, "Financial statement file is required"),
});

const companyFinancialDocumentsSchema = z.object({
  hasBankStatements: z.enum(["yes", "no"]),
  bankStatements: z.array(bankStatementSchema).optional(),
  financialStatements: z.array(financialStatementSchema).min(1, "At least one financial statement is required"),
  businessPlan: z.string().min(1, "Company business plan is required"),
  managementAccounts: z.string().optional(),
}).refine((data) => {
  if (data.hasBankStatements === "yes" && (!data.bankStatements || data.bankStatements.length === 0)) {
    return false;
  }
  return true;
}, {
  message: "At least one bank statement is required",
  path: ["bankStatements"],
});

type CompanyFinancialDocumentsFormData = z.infer<typeof companyFinancialDocumentsSchema>;

// Bank options
const bankOptions: SelectOption[] = [
  { value: "equity", label: "Equity Bank" },
  { value: "kcb", label: "KCB Bank" },
  { value: "cooperative", label: "Cooperative Bank" },
  { value: "absa", label: "Absa Bank" },
  { value: "standard-chartered", label: "Standard Chartered" },
  { value: "diamond-trust", label: "Diamond Trust Bank" },
  { value: "ncba", label: "NCBA Bank" },
  { value: "stanbic", label: "Stanbic Bank" },
  { value: "citibank", label: "Citibank" },
  { value: "other", label: "Other" },
];

// Generate year options (current year and past 10 years)
const generateYearOptions = (): SelectOption[] => {
  const currentYear = new Date().getFullYear();
  const years: SelectOption[] = [];
  for (let i = 0; i <= 10; i++) {
    const year = currentYear - i;
    years.push({ value: year.toString(), label: year.toString() });
  }
  return years;
};

export function Step6CompanyFinancialDocuments() {
  const router = useRouter();
  const { userId, onboardingState, refreshState } = useSMEOnboarding();
  const yearOptions = generateYearOptions();
  const saveDocumentsMutation = useSaveFinancialDocuments();
  
  const isEditing = !!userId && onboardingState?.completedSteps?.includes(6);
  
  // Fetch existing business documents if editing
  const { data: existingDocuments } = useSMEBusinessDocuments(userId || "", {
    enabled: isEditing && !!userId,
  });

  const form = useForm<CompanyFinancialDocumentsFormData>({
    resolver: zodResolver(companyFinancialDocumentsSchema),
    defaultValues: {
      hasBankStatements: undefined,
      bankStatements: [],
      financialStatements: [{ year: "", statementFile: "" }],
      businessPlan: "",
      managementAccounts: "",
    },
  });

  const {
    fields: bankStatementFields,
    append: appendBankStatement,
    remove: removeBankStatement,
  } = useFieldArray({
    control: form.control,
    name: "bankStatements",
  });

  const {
    fields: financialStatementFields,
    append: appendFinancialStatement,
    remove: removeFinancialStatement,
  } = useFieldArray({
    control: form.control,
    name: "financialStatements",
  });

  const watchHasBankStatements = form.watch("hasBankStatements");
  const watchFinancialStatements = form.watch("financialStatements");

  // Load existing data if editing
  useEffect(() => {
    if (isEditing && existingDocuments) {
      // Map existing documents to form fields
      const bankStatements = existingDocuments.filter(d => d.docType === "annual_bank_statement");
      const financialStatements = existingDocuments.filter(d => d.docType === "audited_financial_statements");
      const businessPlan = existingDocuments.find(d => d.docType === "business_plan");
      const managementAccounts = existingDocuments.find(d => d.docType === "income_statements");
      
      // Set has bank statements
      if (bankStatements.length > 0) {
        form.setValue("hasBankStatements", "yes");
        // Populate bank statements
        bankStatements.forEach((stmt, index) => {
          if (index === 0) {
            form.setValue("bankStatements", [{
              bankName: stmt.docBankName || "other",
              specifyBankName: stmt.docBankName || "",
              statementFile: stmt.docUrl,
              password: stmt.docPassword || "",
            }]);
          } else {
            const current = form.getValues("bankStatements") || [];
            form.setValue("bankStatements", [...current, {
              bankName: stmt.docBankName || "other",
              specifyBankName: stmt.docBankName || "",
              statementFile: stmt.docUrl,
              password: stmt.docPassword || "",
            }]);
          }
        });
      }
      
      // Populate financial statements
      if (financialStatements.length > 0) {
        const statements = financialStatements.map(stmt => ({
          year: stmt.docYear?.toString() || "",
          statementFile: stmt.docUrl,
        }));
        form.setValue("financialStatements", statements);
      }
      
      if (businessPlan) form.setValue("businessPlan", businessPlan.docUrl);
      if (managementAccounts) form.setValue("managementAccounts", managementAccounts.docUrl);
    }
  }, [isEditing, existingDocuments, form]);

  const handleCancel = () => {
    if (userId) {
      router.push(`/entrepreneurs/create?userId=${userId}&step=5`);
    } else {
      router.push("/entrepreneurs/create?step=5");
    }
  };

  const onSubmit = async (data: CompanyFinancialDocumentsFormData) => {
    if (!userId) {
      toast({
        title: "Error",
        description: "Please complete previous steps first.",
        variant: "destructive",
      });
      router.push("/entrepreneurs/create?step=1");
      return;
    }

    try {
      const documents: Array<{
        docType: string;
        docUrl: string;
        docYear?: number;
        docBankName?: string;
        isPasswordProtected?: boolean;
        docPassword?: string;
      }> = [];

      // Add bank statements
      if (data.hasBankStatements === "yes" && data.bankStatements) {
        data.bankStatements.forEach((statement) => {
          if (statement.statementFile) {
            const bankName = statement.bankName === "other" 
              ? statement.specifyBankName 
              : statement.bankName;
            
            documents.push({
              docType: "annual_bank_statement",
              docUrl: statement.statementFile,
              docBankName: bankName || undefined,
              isPasswordProtected: !!statement.password,
              docPassword: statement.password || undefined,
            });
          }
        });
      }

      // Add financial statements
      if (data.financialStatements) {
        data.financialStatements.forEach((statement) => {
          if (statement.statementFile && statement.year) {
            documents.push({
              docType: "audited_financial_statements",
              docUrl: statement.statementFile,
              docYear: parseInt(statement.year, 10),
              isPasswordProtected: false,
            });
          }
        });
      }

      // Add business plan (goes to Step 7, but we can save it here if provided)
      if (data.businessPlan) {
        documents.push({
          docType: "business_plan",
          docUrl: data.businessPlan,
          isPasswordProtected: false,
        });
      }

      // Add management accounts (income statements)
      if (data.managementAccounts) {
        documents.push({
          docType: "income_statements",
          docUrl: data.managementAccounts,
          isPasswordProtected: false,
        });
      }

      if (documents.length === 0) {
        toast({
          title: "Error",
          description: "Please upload at least one financial document.",
          variant: "destructive",
        });
        return;
      }

      await saveDocumentsMutation.mutateAsync({
        userId,
        data: { documents },
      });

      toast({
        title: "Success",
        description: "Financial documents saved successfully.",
      });

      refreshState();
      router.push(`/entrepreneurs/create?userId=${userId}&step=7`);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error || error?.message || "Failed to save financial documents.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleAddBankStatement = () => {
    appendBankStatement({
      bankName: "",
      specifyBankName: "",
      statementFile: "",
      password: "",
    });
  };

  const handleAddFinancialStatement = () => {
    appendFinancialStatement({
      year: "",
      statementFile: "",
    });
  };

  // Get used years for financial statements (to prevent duplicates)
  const getAllUsedYears = () => {
    return watchFinancialStatements
      ?.map((stmt, index) => form.watch(`financialStatements.${index}.year`))
      .filter((year) => year) || [];
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-primary-green">STEP 6/7</div>
          {isEditing && (
            <div className="text-xs text-primaryGrey-400 bg-primaryGrey-50 px-2 py-1 rounded">
              Editing existing data
            </div>
          )}
        </div>
        <h2 className="text-2xl font-semibold text-midnight-blue mb-2">
          Financial Documents
        </h2>
        <p className="text-sm text-primaryGrey-500">
          Provide the company's financial statements and supporting records.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Do you have bank statements? */}
          <FormField
            control={form.control}
            name="hasBankStatements"
            render={({ field }) => (
              <FormItem>
                <FormLabel required className="text-primaryGrey-400">
                  Do you have any of the company's recent bank statements?
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      if (value === "no") {
                        form.setValue("bankStatements", []);
                        bankStatementFields.forEach((_, index) => {
                          removeBankStatement(index);
                        });
                      } else if (value === "yes" && bankStatementFields.length === 0) {
                        appendBankStatement({
                          bankName: "",
                          specifyBankName: "",
                          statementFile: "",
                          password: "",
                        });
                      }
                    }}
                    className="flex flex-row gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="yes-bank" />
                      <Label htmlFor="yes-bank" className="cursor-pointer text-primaryGrey-400">
                        Yes, I do
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="no-bank" />
                      <Label htmlFor="no-bank" className="cursor-pointer text-primaryGrey-400">
                        No, I don't
                      </Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Bank Statements Section - Only show if "Yes" */}
          {watchHasBankStatements === "yes" && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-midnight-blue">
                Bank statements
              </h3>

              <div className="space-y-4">
                {bankStatementFields.map((field, index) => (
                  <BankStatementEntry
                    key={field.id}
                    index={index}
                    control={form.control}
                    watch={form.watch}
                    onRemove={() => removeBankStatement(index)}
                    bankOptions={bankOptions}
                  />
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddBankStatement}
                  className="w-full md:w-auto"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add bank statement
                </Button>
              </div>
            </div>
          )}

          {/* Financial Statements Section */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-midnight-blue mb-2">
                Financial statements
              </h3>
              <p className="text-sm text-primaryGrey-400">
                Upload the most recent audited financial statements for the past three years *
              </p>
            </div>

            <div className="space-y-4">
              {financialStatementFields.map((field, index) => {
                // Get all used years except the current one
                const allUsedYears = getAllUsedYears();
                const currentYear = form.watch(`financialStatements.${index}.year`);
                const usedYearsExcludingCurrent = allUsedYears.filter((_, i) => i !== index);
                
                return (
                  <FinancialStatementEntry
                    key={field.id}
                    index={index}
                    control={form.control}
                    watch={form.watch}
                    onRemove={() => removeFinancialStatement(index)}
                    yearOptions={yearOptions}
                    usedYears={usedYearsExcludingCurrent}
                  />
                );
              })}

              <Button
                type="button"
                variant="outline"
                onClick={handleAddFinancialStatement}
                className="w-full md:w-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add financial statement
              </Button>
            </div>
          </div>

          {/* Additional Documents Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-midnight-blue">
              Additional Documents
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Business Plan */}
              <FormField
                control={form.control}
                name="businessPlan"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormControl>
                      <FileUpload
                        value={field.value}
                        onChange={field.onChange}
                        label="Upload company business plan with financial projections"
                        required
                        error={!!form.formState.errors.businessPlan}
                        errorMessage={form.formState.errors.businessPlan?.message}
                        acceptedFormats={["PDF", "PNG", "JPG", "JPEG"]}
                        maxSizeMB={8}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Management Accounts */}
              <FormField
                control={form.control}
                name="managementAccounts"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormControl>
                      <FileUpload
                        value={field.value}
                        onChange={field.onChange}
                        label="Upload recent management accounts (e.g., income statement, balance sheet, cash flow etc.) (optional)"
                        acceptedFormats={["PDF", "PNG", "JPG", "JPEG"]}
                        maxSizeMB={8}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              size="lg"
              type="button"
              variant="outline"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              size="lg"
              type="submit"
              className="text-white border-0"
              disabled={saveDocumentsMutation.isPending}
              style={{
                background:
                  "linear-gradient(90deg, var(--green-500, #0C9) 0%, var(--pink-500, #F0459C) 100%)",
              }}
            >
              {saveDocumentsMutation.isPending ? "Saving..." : "Save & Continue"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
