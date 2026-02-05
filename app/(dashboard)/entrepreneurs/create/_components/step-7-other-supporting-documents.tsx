"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { SMESuccessModal } from "./sme-success-modal";
import { useSMEOnboarding } from "../_context/sme-onboarding-context";
import { useSMEUser, useSavePermitsAndPitchDeck, useSendSMEInvitation, useSMEBusinessDocuments } from "@/lib/api/hooks/sme";
import { toast } from "sonner";

const otherSupportingDocumentsSchema = z.object({
  businessPermit: z.string().min(1, "Business permit is required"),
  companyPitchDeck: z.string().min(1, "Company pitch deck / company profile is required"),
});

// Allow all common document types (PDF, Word, Excel, PowerPoint, images, etc.)
const OTHER_SUPPORTING_DOC_ACCEPTED_FORMATS = [
  "PDF",
  "PNG",
  "JPG",
  "JPEG",
  "DOC",
  "DOCX",
  "XLS",
  "XLSX",
  "CSV",
  "PPT",
  "PPTX",
] as const;

type OtherSupportingDocumentsFormData = z.infer<typeof otherSupportingDocumentsSchema>;

export function Step7OtherSupportingDocuments() {
  const router = useRouter();
  const { userId, onboardingState, refreshState } = useSMEOnboarding();
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  
  const savePermitsMutation = useSavePermitsAndPitchDeck();
  const sendInvitationMutation = useSendSMEInvitation();
  
  // Fetch full user details if userId is present
  const { data: userDetail, isLoading: isLoadingUser } = useSMEUser(userId || "", {
    enabled: !!userId,
  });
  
  // Determine if we're editing (userId exists, regardless of completion status)
  const isEditing = !!userId;
  const userEmail = onboardingState?.user?.email || userDetail?.user?.email || "";
  
  // Fetch existing business documents if userId is present
  const { data: existingDocuments, isLoading: isLoadingDocuments } = useSMEBusinessDocuments(userId || "", {
    enabled: !!userId,
  });

  const form = useForm<OtherSupportingDocumentsFormData>({
    resolver: zodResolver(otherSupportingDocumentsSchema),
    defaultValues: {
      businessPermit: "",
      companyPitchDeck: "",
    },
  });

  // Load existing data if userId is present
  useEffect(() => {
    if (userId && existingDocuments) {
      // Map existing documents to form fields
      const businessPermit = existingDocuments.find(d => d.docType === "business_permit");
      const pitchDeck = existingDocuments.find(d => d.docType === "pitch_deck");
      
      form.reset({
        businessPermit: businessPermit?.docUrl || "",
        companyPitchDeck: pitchDeck?.docUrl || "",
      });
    }
  }, [userId, existingDocuments, form]);

  const handleCancel = () => {
    if (userId) {
      router.push(`/entrepreneurs/create?userId=${userId}&step=6`);
    } else {
      router.push("/entrepreneurs/create?step=6");
    }
  };

  const onSubmit = async (data: OtherSupportingDocumentsFormData) => {
    if (!userId) {
      toast.error("Please complete previous steps first.");
      router.push("/entrepreneurs/create?step=1");
      return;
    }

    try {
      // Map form data to API format
      const documents: Array<{
        docType: string;
        docUrl: string;
        isPasswordProtected?: boolean;
        docPassword?: string;
      }> = [];

      if (data.businessPermit) {
        documents.push({
          docType: "business_permit",
          docUrl: data.businessPermit,
          isPasswordProtected: false,
        });
      }

      if (data.companyPitchDeck) {
        documents.push({
          docType: "pitch_deck",
          docUrl: data.companyPitchDeck,
          isPasswordProtected: false,
        });
      }

      // Save Step 7 documents
      await savePermitsMutation.mutateAsync({
        userId,
        data: { documents },
      });

      // Automatically send invitation after Step 7 is complete
      try {
        await sendInvitationMutation.mutateAsync({ userId });
        setSubmittedEmail(userEmail);
        setSuccessModalOpen(true);
        refreshState();
      } catch (inviteError: any) {
        // If invitation fails, still show success for Step 7
        const inviteErrorMessage = inviteError?.response?.data?.error || inviteError?.message || "Failed to send invitation.";
        toast.error(`Documents saved, but invitation failed: ${inviteErrorMessage}`);
        // Still show success modal
        setSubmittedEmail(userEmail);
        setSuccessModalOpen(true);
        refreshState();
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error || error?.message || "Failed to save documents.";
      toast.error(errorMessage);
    }
  };

  const handleCloseSuccessModal = () => {
    setSuccessModalOpen(false);
    router.push("/entrepreneurs");
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-primary-green">STEP 7/7</div>
          {isEditing && (
            <div className="text-xs text-primaryGrey-400 bg-primaryGrey-50 px-2 py-1 rounded">
              Editing existing data
            </div>
          )}
        </div>
        <h2 className="text-2xl font-semibold text-midnight-blue mb-2">
          Other Supporting Documents
        </h2>
        <p className="text-sm text-primaryGrey-500">
          Upload additional documents relevant to the company&apos;s operations.
        </p>
      </div>

      {(isLoadingUser || isLoadingDocuments) && userId ? (
        <div className="flex items-center justify-center py-8">
          <p className="text-sm text-primaryGrey-500">Loading supporting documents...</p>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Regulatory Documents Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-midnight-blue">
              Regulatory documents
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Business Permit */}
              <FormField
                control={form.control}
                name="businessPermit"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormControl>
                      <FileUpload
                        value={field.value}
                        onChange={field.onChange}
                        label="Upload business permit"
                        required
                        error={!!form.formState.errors.businessPermit}
                        errorMessage={form.formState.errors.businessPermit?.message}
                        acceptedFormats={[...OTHER_SUPPORTING_DOC_ACCEPTED_FORMATS]}
                        maxSizeMB={8}
                        showUploadedState={!!field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Strategic Documents Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-midnight-blue">
              Strategic documents
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Company Pitch Deck / Company Profile */}
              <FormField
                control={form.control}
                name="companyPitchDeck"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormControl>
                      <FileUpload
                        value={field.value}
                        onChange={field.onChange}
                        label="Upload company pitch deck / company profile"
                        required
                        error={!!form.formState.errors.companyPitchDeck}
                        errorMessage={form.formState.errors.companyPitchDeck?.message}
                        acceptedFormats={[...OTHER_SUPPORTING_DOC_ACCEPTED_FORMATS]}
                        maxSizeMB={8}
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
              disabled={savePermitsMutation.isPending || sendInvitationMutation.isPending || isLoadingUser || isLoadingDocuments}
              style={{
                background:
                  "linear-gradient(90deg, var(--green-500, #0C9) 0%, var(--pink-500, #F0459C) 100%)",
              }}
            >
              {isLoadingUser || isLoadingDocuments
                ? "Loading..."
                : savePermitsMutation.isPending || sendInvitationMutation.isPending
                ? "Saving & Sending Invitation..."
                : "Save & Send Invitation"}
            </Button>
          </div>
        </form>
      </Form>
      )}

      <SMESuccessModal
        open={successModalOpen}
        onOpenChange={handleCloseSuccessModal}
        email={submittedEmail}
      />
    </div>
  );
}
