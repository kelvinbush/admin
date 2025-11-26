"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSMEOnboarding } from "../_context/sme-onboarding-context";
import { useSaveCompanyDocuments, useSMEBusinessDocuments } from "@/lib/api/hooks/sme";
import { toast } from "@/hooks/use-toast";

const companyRegistrationDocumentsSchema = z.object({
  certificateOfRegistration: z.string().min(1, "Certificate of registration/incorporation is required"),
  cr1: z.string().optional(),
  cr2: z.string().optional(),
  cr8: z.string().optional(),
  cr12: z.string().optional(),
  memorandumOfAssociation: z.string().optional(),
  articlesOfAssociation: z.string().optional(),
  companyTaxRegistrationCertificate: z.string().min(1, "Company tax registration certificate is required"),
  companyTaxClearanceCertificate: z.string().min(1, "Company tax clearance certificate is required"),
});

type CompanyRegistrationDocumentsFormData = z.infer<typeof companyRegistrationDocumentsSchema>;

export function Step5CompanyRegistrationDocuments() {
  const router = useRouter();
  const { userId, onboardingState, refreshState } = useSMEOnboarding();
  const saveDocumentsMutation = useSaveCompanyDocuments();
  
  const isEditing = !!userId && onboardingState?.completedSteps?.includes(5);
  
  // Fetch existing business documents if editing
  const { data: existingDocuments } = useSMEBusinessDocuments(userId || "", {
    enabled: isEditing && !!userId,
  });

  const form = useForm<CompanyRegistrationDocumentsFormData>({
    resolver: zodResolver(companyRegistrationDocumentsSchema),
    defaultValues: {
      certificateOfRegistration: "",
      cr1: "",
      cr2: "",
      cr8: "",
      cr12: "",
      memorandumOfAssociation: "",
      articlesOfAssociation: "",
      companyTaxRegistrationCertificate: "",
      companyTaxClearanceCertificate: "",
    },
  });

  // Load existing data if editing
  useEffect(() => {
    if (isEditing && existingDocuments) {
      // Map existing documents to form fields
      const certificateOfReg = existingDocuments.find(d => 
        d.docType === "certificate_of_incorporation" || d.docType === "business_registration"
      );
      const cr1 = existingDocuments.find(d => d.docType === "CR1");
      const cr2 = existingDocuments.find(d => d.docType === "CR2");
      const cr8 = existingDocuments.find(d => d.docType === "CR8");
      const cr12 = existingDocuments.find(d => d.docType === "CR12");
      const memorandum = existingDocuments.find(d => d.docType === "memorandum_of_association");
      const articles = existingDocuments.find(d => d.docType === "articles_of_association");
      const taxReg = existingDocuments.find(d => d.docType === "tax_registration_certificate");
      const taxClearance = existingDocuments.find(d => d.docType === "tax_clearance_certificate");
      
      form.reset({
        certificateOfRegistration: certificateOfReg?.docUrl || "",
        cr1: cr1?.docUrl || "",
        cr2: cr2?.docUrl || "",
        cr8: cr8?.docUrl || "",
        cr12: cr12?.docUrl || "",
        memorandumOfAssociation: memorandum?.docUrl || "",
        articlesOfAssociation: articles?.docUrl || "",
        companyTaxRegistrationCertificate: taxReg?.docUrl || "",
        companyTaxClearanceCertificate: taxClearance?.docUrl || "",
      });
    }
  }, [isEditing, existingDocuments, form]);

  const handleCancel = () => {
    if (userId) {
      router.push(`/entrepreneurs/create?userId=${userId}&step=4`);
    } else {
      router.push("/entrepreneurs/create?step=1");
    }
  };

  const onSubmit = async (data: CompanyRegistrationDocumentsFormData) => {
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
        isPasswordProtected?: boolean;
        docPassword?: string;
      }> = [];

      // Add certificate of registration/incorporation
      if (data.certificateOfRegistration) {
        documents.push({
          docType: "certificate_of_incorporation",
          docUrl: data.certificateOfRegistration,
          isPasswordProtected: false,
        });
      }

      // Add CR documents
      if (data.cr1) {
        documents.push({
          docType: "CR1",
          docUrl: data.cr1,
          isPasswordProtected: false,
        });
      }
      if (data.cr2) {
        documents.push({
          docType: "CR2",
          docUrl: data.cr2,
          isPasswordProtected: false,
        });
      }
      if (data.cr8) {
        documents.push({
          docType: "CR8",
          docUrl: data.cr8,
          isPasswordProtected: false,
        });
      }
      if (data.cr12) {
        documents.push({
          docType: "CR12",
          docUrl: data.cr12,
          isPasswordProtected: false,
        });
      }

      // Add memorandum and articles
      if (data.memorandumOfAssociation) {
        documents.push({
          docType: "memorandum_of_association",
          docUrl: data.memorandumOfAssociation,
          isPasswordProtected: false,
        });
      }
      if (data.articlesOfAssociation) {
        documents.push({
          docType: "articles_of_association",
          docUrl: data.articlesOfAssociation,
          isPasswordProtected: false,
        });
      }

      // Add tax certificates
      if (data.companyTaxRegistrationCertificate) {
        documents.push({
          docType: "tax_registration_certificate",
          docUrl: data.companyTaxRegistrationCertificate,
          isPasswordProtected: false,
        });
      }
      if (data.companyTaxClearanceCertificate) {
        documents.push({
          docType: "tax_clearance_certificate",
          docUrl: data.companyTaxClearanceCertificate,
          isPasswordProtected: false,
        });
      }

      if (documents.length === 0) {
        toast({
          title: "Error",
          description: "Please upload at least the required documents.",
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
        description: "Company registration documents saved successfully.",
      });

      refreshState();
      router.push(`/entrepreneurs/create?userId=${userId}&step=6`);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error || error?.message || "Failed to save documents.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-primary-green">STEP 5/7</div>
          {isEditing && (
            <div className="text-xs text-primaryGrey-400 bg-primaryGrey-50 px-2 py-1 rounded">
              Editing existing data
            </div>
          )}
        </div>
        <h2 className="text-2xl font-semibold text-midnight-blue mb-2">
          Company Registration Documents
        </h2>
        <p className="text-sm text-primaryGrey-500">
          Provide company registration and tax compliance documents.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Proof of Registration Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-midnight-blue">
              Proof of registration
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Certificate of Registration/Incorporation */}
              <FormField
                control={form.control}
                name="certificateOfRegistration"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormControl>
                      <FileUpload
                        value={field.value}
                        onChange={field.onChange}
                        label="Upload certificate of registration/incorporation"
                        required
                        error={!!form.formState.errors.certificateOfRegistration}
                        errorMessage={form.formState.errors.certificateOfRegistration?.message}
                        acceptedFormats={["PDF", "PNG", "JPG", "JPEG"]}
                        maxSizeMB={8}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* CR1 */}
              <FormField
                control={form.control}
                name="cr1"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormControl>
                      <FileUpload
                        value={field.value}
                        onChange={field.onChange}
                        label="Upload copy of CR1"
                        acceptedFormats={["PDF", "PNG", "JPG", "JPEG"]}
                        maxSizeMB={8}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* CR2 */}
              <FormField
                control={form.control}
                name="cr2"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormControl>
                      <FileUpload
                        value={field.value}
                        onChange={field.onChange}
                        label="Upload copy of CR2"
                        acceptedFormats={["PDF", "PNG", "JPG", "JPEG"]}
                        maxSizeMB={8}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* CR8 */}
              <FormField
                control={form.control}
                name="cr8"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormControl>
                      <FileUpload
                        value={field.value}
                        onChange={field.onChange}
                        label="Upload copy of CR8"
                        acceptedFormats={["PDF", "PNG", "JPG", "JPEG"]}
                        maxSizeMB={8}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* CR12 */}
              <FormField
                control={form.control}
                name="cr12"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormControl>
                      <FileUpload
                        value={field.value}
                        onChange={field.onChange}
                        label="Upload the most recent CR12"
                        acceptedFormats={["PDF", "PNG", "JPG", "JPEG"]}
                        maxSizeMB={8}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Memorandum of Association */}
              <FormField
                control={form.control}
                name="memorandumOfAssociation"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormControl>
                      <FileUpload
                        value={field.value}
                        onChange={field.onChange}
                        label="Memorandum of association"
                        acceptedFormats={["PDF", "PNG", "JPG", "JPEG"]}
                        maxSizeMB={8}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Articles of Association */}
              <FormField
                control={form.control}
                name="articlesOfAssociation"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormControl>
                      <FileUpload
                        value={field.value}
                        onChange={field.onChange}
                        label="Articles of association"
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

          {/* Tax Compliance Documents Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-midnight-blue">
              Tax compliance documents
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Company Tax Registration Certificate */}
              <FormField
                control={form.control}
                name="companyTaxRegistrationCertificate"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormControl>
                      <FileUpload
                        value={field.value}
                        onChange={field.onChange}
                        label="Upload company tax registration certificate"
                        required
                        error={!!form.formState.errors.companyTaxRegistrationCertificate}
                        errorMessage={form.formState.errors.companyTaxRegistrationCertificate?.message}
                        acceptedFormats={["PDF", "PNG", "JPG", "JPEG"]}
                        maxSizeMB={8}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Company Tax Clearance Certificate */}
              <FormField
                control={form.control}
                name="companyTaxClearanceCertificate"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormControl>
                      <FileUpload
                        value={field.value}
                        onChange={field.onChange}
                        label="Upload company tax clearance certificate"
                        required
                        error={!!form.formState.errors.companyTaxClearanceCertificate}
                        errorMessage={form.formState.errors.companyTaxClearanceCertificate?.message}
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
