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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FileUploadInput } from "./file-upload-input";

interface SimplifiedUser {
  clerkId?: string;
  name?: string;
  email?: string;
}

const fileSchema = z.object({
  docUrl: z.string(),
  docName: z.string(),
});

const formSchema = z.object({
  supportingDocuments: fileSchema,
  creditMemo: fileSchema,
  offTakerAgreement: fileSchema.optional(),
  parentGuaranteeAgreement: fileSchema.optional(),
  assessmentComment: z
    .string()
    .min(1, "Credit assessment comment is required."),
  nextApproverId: z.string().min(1, "Next approver is required."),
});

export type CreditAssessmentFormValues = z.infer<typeof formSchema>;

interface CreditAssessmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: CreditAssessmentFormValues) => void;
  users: SimplifiedUser[];
  isLoading: boolean;
}

export function CreditAssessmentModal({
  open,
  onOpenChange,
  onSubmit,
  users,
  isLoading,
}: CreditAssessmentModalProps) {
  const selectableUsers = users.filter(
    (user): user is SimplifiedUser & { clerkId: string; name: string } =>
      !!user.clerkId && user.clerkId.trim() !== "" && !!user.name,
  );

  const form = useForm<CreditAssessmentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      assessmentComment: "",
      nextApproverId: "",
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  const selectedApproverEmail =
    selectableUsers.find((u) => u.clerkId === form.watch("nextApproverId"))?.email || "";

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
              <h3 className="text-sm font-medium text-primary-green">
                Credit assessment details
              </h3>
              <FormField
                control={form.control}
                name="supportingDocuments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Upload supporting loan documents (e.g., invoices, purchase
                      orders, etc.) *
                    </FormLabel>
                    <FormControl>
                      <FileUploadInput
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isLoading}
                        docName="Supporting Documents"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="creditMemo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload credit memo *</FormLabel>
                    <FormControl>
                      <FileUploadInput
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isLoading}
                        docName="Credit Memo"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="offTakerAgreement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Upload off-taker agreement (if applicable)
                    </FormLabel>
                    <FormControl>
                      <FileUploadInput
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isLoading}
                        docName="Off-taker Agreement"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="parentGuaranteeAgreement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Upload parent guarantee agreement (if applicable)
                    </FormLabel>
                    <FormControl>
                      <FileUploadInput
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isLoading}
                        docName="Parent Guarantee Agreement"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="assessmentComment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Credit assessment comment (optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide additional observations, concerns or recommendation based on your credit assessment"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-primary-green">
                Next approver&apos;s details
              </h3>
              <FormField
                control={form.control}
                name="nextApproverId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select approver(s) *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select approver" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {selectableUsers.map((user) => (
                          <SelectItem key={user.clerkId} value={user.clerkId}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem>
                <FormLabel>Approver&apos;s email(s) *</FormLabel>
                <FormControl>
                  <Textarea readOnly value={selectedApproverEmail} />
                </FormControl>
              </FormItem>
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
