"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { useRouter } from "next/navigation";

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

  const handleCancel = () => {
    router.push("/entrepreneurs/create?step=4");
  };

  const onSubmit = (data: CompanyRegistrationDocumentsFormData) => {
    console.log("Step 5 data:", data);
    router.push("/entrepreneurs/create?step=6");
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm text-primary-green mb-2">STEP 5/7</div>
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
