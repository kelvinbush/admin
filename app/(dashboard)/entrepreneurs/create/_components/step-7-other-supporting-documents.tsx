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
import { toast } from "@/hooks/use-toast";

const otherSupportingDocumentsSchema = z.object({
  businessPermit: z.string().min(1, "Business permit is required"),
  companyPitchDeck: z.string().min(1, "Company pitch deck / company profile is required"),
});

type OtherSupportingDocumentsFormData = z.infer<typeof otherSupportingDocumentsSchema>;

export function Step7OtherSupportingDocuments() {
  const router = useRouter();
  const { userId, onboardingState, refreshState } = useSMEOnboarding();
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  
  const savePermitsMutation = useSavePermitsAndPitchDeck();
  const sendInvitationMutation = useSendSMEInvitation();
  
  // Fetch full user details if editing
  const { data: userDetail } = useSMEUser(userId || "", {
    enabled: !!userId && onboardingState?.completedSteps?.includes(7),
  });
  
  const isEditing = !!userId && onboardingState?.completedSteps?.includes(7);
  const userEmail = onboardingState?.user?.email || userDetail?.user?.email || "";
  
  // Fetch existing business documents if editing
  const { data: existingDocuments } = useSMEBusinessDocuments(userId || "", {
    enabled: isEditing && !!userId,
  });

  const form = useForm<OtherSupportingDocumentsFormData>({
    resolver: zodResolver(otherSupportingDocumentsSchema),
    defaultValues: {
      businessPermit: "",
      companyPitchDeck: "",
    },
  });

  // Load existing data if editing
  useEffect(() => {
    if (isEditing && existingDocuments) {
      // Map existing documents to form fields
      const businessPermit = existingDocuments.find(d => d.docType === "business_permit");
      const pitchDeck = existingDocuments.find(d => d.docType === "pitch_deck");
      const businessPlan = existingDocuments.find(d => d.docType === "business_plan");
      
      form.reset({
        businessPermit: businessPermit?.docUrl || "",
        companyPitchDeck: pitchDeck?.docUrl || "",
      });
    }
  }, [isEditing, existingDocuments, form]);

  const handleCancel = () => {
    if (userId) {
      router.push(`/entrepreneurs/create?userId=${userId}&step=6`);
    } else {
      router.push("/entrepreneurs/create?step=6");
    }
  };

  const onSubmit = async (data: OtherSupportingDocumentsFormData) => {
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
        toast({
          title: "Warning",
          description: `Documents saved, but invitation failed: ${inviteErrorMessage}`,
          variant: "destructive",
        });
        // Still show success modal
        setSubmittedEmail(userEmail);
        setSuccessModalOpen(true);
        refreshState();
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error || error?.message || "Failed to save documents.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
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
          Upload additional documents relevant to the company's operations.
        </p>
      </div>

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
              disabled={savePermitsMutation.isPending || sendInvitationMutation.isPending}
              style={{
                background:
                  "linear-gradient(90deg, var(--green-500, #0C9) 0%, var(--pink-500, #F0459C) 100%)",
              }}
            >
              {savePermitsMutation.isPending || sendInvitationMutation.isPending
                ? "Saving & Sending Invitation..."
                : "Save & Send Invitation"}
            </Button>
          </div>
        </form>
      </Form>

      <SMESuccessModal
        open={successModalOpen}
        onOpenChange={handleCloseSuccessModal}
        email={submittedEmail}
      />
    </div>
  );
}
