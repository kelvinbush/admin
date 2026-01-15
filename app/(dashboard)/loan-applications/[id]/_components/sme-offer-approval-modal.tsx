"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { FileUploadInput } from "./file-upload-input";

const fileSchema = z.object({
  docUrl: z.string().min(1, "Term sheet is required."),
  docName: z.string(),
});

const formSchema = z.object({
  termSheet: fileSchema,
});

export type SmeOfferApprovalFormValues = z.infer<typeof formSchema>;

interface SmeOfferApprovalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: SmeOfferApprovalFormValues) => void;
  applicantName: string;
  applicantEmail: string;
  isLoading: boolean;
}

export function SmeOfferApprovalModal({
  open,
  onOpenChange,
  onSubmit,
  applicantName,
  applicantEmail,
  isLoading,
}: SmeOfferApprovalModalProps) {
  const form = useForm<SmeOfferApprovalFormValues>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  const handleFileChange = (file?: { docUrl: string; docName: string }) => {
    if (file) {
      form.setValue("termSheet", { ...file, docName: "Term Sheet" });
    } else {
      form.setValue("termSheet", undefined as any);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-medium">
            Additional details
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-500">
          Fill in the required information below to proceed to the next step
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="termSheet"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload term sheet *</FormLabel>
                    <FormControl>
                      <FileUploadInput
                        value={field.value}
                        onChange={handleFileChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-primary-green">
                Loan applicant&apos;s details
              </h3>
              <FormItem>
                <FormLabel>Loan applicant&apos;s name *</FormLabel>
                <FormControl>
                  <Input readOnly value={applicantName} />
                </FormControl>
              </FormItem>
              <FormItem>
                <FormLabel>Loan applicant&apos;s email *</FormLabel>
                <FormControl>
                  <Input readOnly value={applicantEmail} />
                </FormControl>
              </FormItem>
            </div>

            <div className="text-sm text-blue-800 bg-blue-50 p-3 rounded-md border border-blue-200">
              A loan approval email notification will be sent to the loan
              applicant with the attached term sheet for approval.
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="lg" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
