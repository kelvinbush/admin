"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SelectWithDescription, type SelectOption } from "@/components/ui/select-with-description";
import { FileUpload } from "@/components/ui/file-upload";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSMEOnboarding } from "../_context/sme-onboarding-context";
import { useSavePersonalDocuments, useSMEPersonalDocuments, useSMEUser } from "@/lib/api/hooks/sme";
import { toast } from "sonner";

const entrepreneurDocumentsSchema = z.object({
  hasIdentificationDocuments: z.enum(["yes", "no"]),
  documentType: z.string().optional(),
  identificationNumber: z.string().optional(),
  passportNumber: z.string().optional(),
  frontIdDocument: z.string().optional(),
  backIdDocument: z.string().optional(),
  passportBioPage: z.string().optional(),
  passportPhoto: z.string().optional(),
  personalTaxIdNumber: z.string().min(1, "Personal tax identification number is required"),
  personalTaxCertificate: z.string().min(1, "Personal tax registration certificate is required"),
  idNumber: z.string().optional(),
  taxNumber: z.string().optional(),
  idType: z.string().optional(),
}).refine((data) => {
  // If has documents is "yes", document type is required
  if (data.hasIdentificationDocuments === "yes" && !data.documentType) {
    return false;
  }
  return true;
}, {
  message: "Document type is required",
  path: ["documentType"],
}).refine((data) => {
  // If has documents is "yes" and document type is "identity-card", require identification fields
  if (data.hasIdentificationDocuments === "yes" && data.documentType === "identity-card") {
    if (!data.identificationNumber) return false;
    if (!data.frontIdDocument) return false;
    if (!data.backIdDocument) return false;
  }
  return true;
}, {
  message: "All identity card fields are required",
  path: ["identificationNumber"],
}).refine((data) => {
  // If has documents is "yes" and document type is "passport", require passport fields
  if (data.hasIdentificationDocuments === "yes" && data.documentType === "passport") {
    if (!data.passportNumber) return false;
    if (!data.passportBioPage) return false;
  }
  return true;
}, {
  message: "All passport fields are required",
  path: ["passportNumber"],
});

type EntrepreneurDocumentsFormData = z.infer<typeof entrepreneurDocumentsSchema>;

const documentTypeOptions: SelectOption[] = [
  { value: "identity-card", label: "Identity Card" },
  { value: "passport", label: "Passport" },
];

export function Step4EntrepreneurDocuments() {
  const router = useRouter();
  const { userId, onboardingState, refreshState } = useSMEOnboarding();
  const [, setHasDocuments] = useState<"yes" | "no" | undefined>(undefined);
  const [, setDocumentType] = useState<string>("");
  const saveDocumentsMutation = useSavePersonalDocuments();
  
  // Determine if we're editing (userId exists, regardless of completion status)
  const isEditing = !!userId;
  
  // Fetch existing personal documents if userId is present
  const { data: existingDocuments, isLoading: isLoadingDocuments } = useSMEPersonalDocuments(userId || "", {
    enabled: !!userId,
  });

  // Fetch user detail to get idNumber, taxNumber, idType
  const { data: userDetail } = useSMEUser(userId || "", {
    enabled: !!userId,
  });

  const form = useForm<EntrepreneurDocumentsFormData>({
    resolver: zodResolver(entrepreneurDocumentsSchema),
    defaultValues: {
      hasIdentificationDocuments: undefined,
      documentType: "",
      identificationNumber: "",
      passportNumber: "",
      frontIdDocument: "",
      backIdDocument: "",
      passportBioPage: "",
      passportPhoto: "",
      personalTaxIdNumber: "",
      personalTaxCertificate: "",
      idNumber: "",
      taxNumber: "",
      idType: "",
    },
  });

  // Load existing data if userId is present
  useEffect(() => {
    if (userId) {
      // Use userDetail if available, otherwise fallback to onboardingState
      const user = userDetail?.user || onboardingState?.user;
      
      if (!user) return;
      
      // Load idNumber, taxNumber, idType from user detail
      if (user.idNumber) {
        form.setValue("idNumber", user.idNumber);
      }
      if (user.taxNumber) {
        form.setValue("taxNumber", user.taxNumber);
        form.setValue("personalTaxIdNumber", user.taxNumber);
      }
      if (user.idType) {
        form.setValue("idType", user.idType);
        
        // Map idType to documentType and set related fields
        if (user.idType === "national_id") {
          form.setValue("documentType", "identity-card");
          form.setValue("hasIdentificationDocuments", "yes");
          setHasDocuments("yes");
          setDocumentType("identity-card");
          // Set identificationNumber from idNumber
          if (user.idNumber) {
            form.setValue("identificationNumber", user.idNumber);
          }
        } else if (user.idType === "passport") {
          form.setValue("documentType", "passport");
          form.setValue("hasIdentificationDocuments", "yes");
          setHasDocuments("yes");
          setDocumentType("passport");
          // Set passportNumber from idNumber
          if (user.idNumber) {
            form.setValue("passportNumber", user.idNumber);
          }
        }
      }

      // Load documents if they exist (only if idType wasn't already set)
      if (existingDocuments && existingDocuments.length > 0) {
        // Map existing documents to form fields
        const nationalIdFront = existingDocuments.find(d => d.docType === "national_id_front");
        const nationalIdBack = existingDocuments.find(d => d.docType === "national_id_back");
        const passportBio = existingDocuments.find(d => d.docType === "passport_bio_page");
        const userPhoto = existingDocuments.find(d => d.docType === "user_photo");
        const taxDoc = existingDocuments.find(d => d.docType === "personal_tax_document");
        
        // Only set document type from documents if idType wasn't already set
        if (!user.idType) {
          // Determine document type from documents
          if (nationalIdFront || nationalIdBack) {
            setHasDocuments("yes");
            setDocumentType("identity-card");
            form.setValue("hasIdentificationDocuments", "yes");
            form.setValue("documentType", "identity-card");
          } else if (passportBio) {
            setHasDocuments("yes");
            setDocumentType("passport");
            form.setValue("hasIdentificationDocuments", "yes");
            form.setValue("documentType", "passport");
          }
        }
        
        // Always load document URLs
        if (nationalIdFront) form.setValue("frontIdDocument", nationalIdFront.docUrl);
        if (nationalIdBack) form.setValue("backIdDocument", nationalIdBack.docUrl);
        if (passportBio) form.setValue("passportBioPage", passportBio.docUrl);
        if (userPhoto) form.setValue("passportPhoto", userPhoto.docUrl);
        if (taxDoc) form.setValue("personalTaxCertificate", taxDoc.docUrl);
      }
    }
  }, [userId, userDetail, onboardingState, existingDocuments, form]);

  const handleCancel = () => {
    if (userId) {
      router.push(`/entrepreneurs/create?userId=${userId}&step=3`);
    } else {
      router.push("/entrepreneurs/create?step=1");
    }
  };

  const onSubmit = async (data: EntrepreneurDocumentsFormData) => {
    if (!userId) {
      toast.error("Please complete previous steps first.");
      router.push("/entrepreneurs/create?step=1");
      return;
    }

    try {
      const documents: Array<{ docType: string; docUrl: string }> = [];

      // Add identification documents if available
      if (data.hasIdentificationDocuments === "yes") {
        if (data.documentType === "identity-card") {
          if (data.frontIdDocument) {
            documents.push({
              docType: "national_id_front",
              docUrl: data.frontIdDocument,
            });
          }
          if (data.backIdDocument) {
            documents.push({
              docType: "national_id_back",
              docUrl: data.backIdDocument,
            });
          }
        } else if (data.documentType === "passport") {
          if (data.passportBioPage) {
            documents.push({
              docType: "passport_bio_page",
              docUrl: data.passportBioPage,
            });
          }
        }
        
        // Add passport photo if available (optional)
        if (data.passportPhoto) {
          documents.push({
            docType: "user_photo",
            docUrl: data.passportPhoto,
          });
        }
      }

      // Add tax documents
      if (data.personalTaxCertificate) {
        documents.push({
          docType: "personal_tax_document",
          docUrl: data.personalTaxCertificate,
        });
      }

      if (documents.length === 0) {
        toast.error("Please upload at least one document.");
        return;
      }

      // Determine idNumber and idType based on document type
      let idNumber: string | undefined;
      let idType: string | undefined;
      
      if (data.hasIdentificationDocuments === "yes" && data.documentType === "identity-card") {
        idNumber = data.identificationNumber;
        idType = "national_id";
      } else if (data.hasIdentificationDocuments === "yes" && data.documentType === "passport") {
        idNumber = data.passportNumber;
        idType = "passport";
      }
      
      // Use form values if provided, otherwise use derived values
      const finalIdNumber = data.idNumber || idNumber;
      const finalTaxNumber = data.taxNumber || data.personalTaxIdNumber;
      const finalIdType = data.idType || idType;

      await saveDocumentsMutation.mutateAsync({
        userId,
        data: { 
          documents,
          ...(finalIdNumber && { idNumber: finalIdNumber }),
          ...(finalTaxNumber && { taxNumber: finalTaxNumber }),
          ...(finalIdType && { idType: finalIdType }),
        },
      });

      toast.success("Personal documents saved successfully.");

      refreshState();
      router.push(`/entrepreneurs/create?userId=${userId}&step=5`);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error || error?.message || "Failed to save documents.";
      toast.error(errorMessage);
    }
  };

  const watchHasDocuments = form.watch("hasIdentificationDocuments");
  const watchDocumentType = form.watch("documentType");

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-primary-green">STEP 4/7</div>
          {isEditing && (
            <div className="text-xs text-primaryGrey-400 bg-primaryGrey-50 px-2 py-1 rounded">
              Editing existing data
            </div>
          )}
        </div>
        <h2 className="text-2xl font-semibold text-midnight-blue mb-2">
          Entrepreneur Documents
        </h2>
        <p className="text-sm text-primaryGrey-500">
          Upload identification and tax documents for the entrepreneur.
        </p>
      </div>

      {isLoadingDocuments && userId ? (
        <div className="flex items-center justify-center py-8">
          <p className="text-sm text-primaryGrey-500">Loading entrepreneur documents...</p>
        </div>
      ) : (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Do you have identification documents? */}
          <FormField
            control={form.control}
            name="hasIdentificationDocuments"
            render={({ field }) => (
              <FormItem>
                <FormLabel required className="text-primaryGrey-400">
                  Do you have the entrepreneur&apos;s identification documents?
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setHasDocuments(value as "yes" | "no");
                      // Reset document fields when changing answer
                      if (value === "no") {
                        form.resetField("documentType");
                        form.resetField("identificationNumber");
                        form.resetField("passportNumber");
                        form.resetField("frontIdDocument");
                        form.resetField("backIdDocument");
                        form.resetField("passportBioPage");
                        form.resetField("passportPhoto");
                        setDocumentType("");
                      }
                    }}
                    className="flex flex-row gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="yes" />
                      <Label htmlFor="yes" className="cursor-pointer text-primaryGrey-400">
                        Yes, I do
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="no" />
                      <Label htmlFor="no" className="cursor-pointer text-primaryGrey-400">
                        No, I don&apos;t
                      </Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Identification Documents Section - Only show if "Yes" */}
          {watchHasDocuments === "yes" && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-midnight-blue">
                Identification Documents
              </h3>

              {/* Document Type - Spans 2 cols when alone, 1 col when number field is shown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Document Type */}
                <FormField
                  control={form.control}
                  name="documentType"
                  render={({ field }) => (
                    <FormItem className={!watchDocumentType ? "md:col-span-2" : ""}>
                      <FormLabel required className="text-primaryGrey-400">
                        Document type
                      </FormLabel>
                      <FormControl>
                        <SelectWithDescription
                          options={documentTypeOptions}
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            setDocumentType(value);
                            // Reset fields when changing document type
                            form.resetField("identificationNumber");
                            form.resetField("passportNumber");
                            form.resetField("frontIdDocument");
                            form.resetField("backIdDocument");
                            form.resetField("passportBioPage");
                            form.resetField("passportPhoto");
                          }}
                          placeholder="Select document type"
                          triggerClassName="h-10"
                          error={!!form.formState.errors.documentType}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Identification Number - Show when Identity Card is selected */}
                {watchDocumentType === "identity-card" && (
                  <FormField
                    control={form.control}
                    name="identificationNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required className="text-primaryGrey-400">
                          Identification number
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter ID number"
                            {...field}
                            className={cn(
                              "h-10",
                              form.formState.errors.identificationNumber && "border-red-500"
                            )}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Passport Number - Show when Passport is selected */}
                {watchDocumentType === "passport" && (
                  <FormField
                    control={form.control}
                    name="passportNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required className="text-primaryGrey-400">
                          Passport number
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter passport number"
                            {...field}
                            className={cn(
                              "h-10",
                              form.formState.errors.passportNumber && "border-red-500"
                            )}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              {/* Identity Card Fields */}
              {watchDocumentType === "identity-card" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* Upload Front ID Document */}
                  <FormField
                    control={form.control}
                    name="frontIdDocument"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormControl>
                          <FileUpload
                            value={field.value}
                            onChange={field.onChange}
                            label="Upload front ID document"
                            required
                            error={!!form.formState.errors.frontIdDocument}
                            errorMessage={form.formState.errors.frontIdDocument?.message}
                            acceptedFormats={["PDF", "PNG", "JPG", "JPEG"]}
                            maxSizeMB={5}
                            showUploadedState={!!field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Upload Back ID Document */}
                  <FormField
                    control={form.control}
                    name="backIdDocument"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormControl>
                          <FileUpload
                            value={field.value}
                            onChange={field.onChange}
                            label="Upload back ID document"
                            required
                            error={!!form.formState.errors.backIdDocument}
                            errorMessage={form.formState.errors.backIdDocument?.message}
                            acceptedFormats={["PDF", "PNG", "JPG", "JPEG"]}
                            maxSizeMB={5}
                            showUploadedState={!!field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Upload Passport Photo (Optional) - Spans 2 columns */}
                  <FormField
                    control={form.control}
                    name="passportPhoto"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormControl>
                          <FileUpload
                            value={field.value}
                            onChange={field.onChange}
                            label="Upload passport photo (optional)"
                            acceptedFormats={["PNG", "JPG", "JPEG"]}
                            maxSizeMB={5}
                            showUploadedState={!!field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Passport Fields */}
              {watchDocumentType === "passport" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Upload Passport Bio Page */}
                  <FormField
                    control={form.control}
                    name="passportBioPage"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormControl>
                          <FileUpload
                            value={field.value}
                            onChange={field.onChange}
                            label="Upload passport bio page"
                            required
                            error={!!form.formState.errors.passportBioPage}
                            errorMessage={form.formState.errors.passportBioPage?.message}
                            acceptedFormats={["PDF", "PNG", "JPG", "JPEG"]}
                            maxSizeMB={5}
                            showUploadedState={!!field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Upload Passport Photo (Optional) - Spans 2 columns */}
                  <FormField
                    control={form.control}
                    name="passportPhoto"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormControl>
                          <FileUpload
                            value={field.value}
                            onChange={field.onChange}
                            label="Upload passport photo (optional)"
                            acceptedFormats={["PNG", "JPG", "JPEG"]}
                            maxSizeMB={5}
                            showUploadedState={!!field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>
          )}

          {/* Tax Documents Section - Always shown */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-midnight-blue">
              Tax Documents
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Tax Identification Number - Spans 2 columns */}
              <FormField
                control={form.control}
                name="personalTaxIdNumber"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel required className="text-primaryGrey-400">
                      Personal tax identification number
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter tax identification number"
                        {...field}
                        className={cn(
                          "h-10",
                          form.formState.errors.personalTaxIdNumber && "border-red-500"
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Upload Personal Tax Registration Certificate */}
              <FormField
                control={form.control}
                name="personalTaxCertificate"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormControl>
                      <FileUpload
                        value={field.value}
                        onChange={field.onChange}
                        label="Upload personal tax registration certificate"
                        required
                        error={!!form.formState.errors.personalTaxCertificate}
                        errorMessage={form.formState.errors.personalTaxCertificate?.message}
                        acceptedFormats={["PDF", "PNG", "JPG", "JPEG"]}
                        maxSizeMB={5}
                        showUploadedState={!!field.value}
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
              disabled={saveDocumentsMutation.isPending || isLoadingDocuments}
              style={{
                background:
                  "linear-gradient(90deg, var(--green-500, #0C9) 0%, var(--pink-500, #F0459C) 100%)",
              }}
            >
              {isLoadingDocuments
                ? "Loading..."
                : saveDocumentsMutation.isPending
                ? "Saving..."
                : "Save & Continue"}
            </Button>
          </div>
        </form>
      </Form>
      )}
    </div>
  );
}
