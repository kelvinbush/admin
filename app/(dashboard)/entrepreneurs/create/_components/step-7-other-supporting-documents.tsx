"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { useRouter } from "next/navigation";

const otherSupportingDocumentsSchema = z.object({
  businessPermit: z.string().min(1, "Business permit is required"),
  companyPitchDeck: z.string().min(1, "Company pitch deck / company profile is required"),
});

type OtherSupportingDocumentsFormData = z.infer<typeof otherSupportingDocumentsSchema>;

export function Step7OtherSupportingDocuments() {
  const router = useRouter();

  const form = useForm<OtherSupportingDocumentsFormData>({
    resolver: zodResolver(otherSupportingDocumentsSchema),
    defaultValues: {
      businessPermit: "",
      companyPitchDeck: "",
    },
  });

  const handleCancel = () => {
    router.push("/entrepreneurs/create?step=6");
  };

  const onSubmit = (data: OtherSupportingDocumentsFormData) => {
    console.log("Step 7 data:", data);
    // TODO: Submit all form data and redirect to entrepreneurs list
    router.push("/entrepreneurs");
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm text-primary-green mb-2">STEP 7/7</div>
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
              style={{
                background:
                  "linear-gradient(90deg, var(--green-500, #0C9) 0%, var(--pink-500, #F0459C) 100%)",
              }}
            >
              Save & Continue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
