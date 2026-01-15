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
  supportingDocument: fileSchema, // Changed from approvedCreditMemo
  assessmentComment: z.string().optional(),
  ceoId: z.string().min(1, "CEO name is required."),
});

export type HeadOfCreditReviewFormValues = z.infer<typeof formSchema>;

interface HeadOfCreditReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: HeadOfCreditReviewFormValues) => void;
  users: SimplifiedUser[];
  isLoading: boolean;
}

export function HeadOfCreditReviewModal({
  open,
  onOpenChange,
  onSubmit,
  users,
  isLoading,
}: HeadOfCreditReviewModalProps) {
  const form = useForm<HeadOfCreditReviewFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      assessmentComment: "",
      ceoId: "",
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  const selectedCeoEmail =
    users.find((u) => u.clerkId === form.watch("ceoId"))?.email || "";

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
                name="supportingDocument"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload approved credit memo *</FormLabel>
                    <FormControl>
                      <FileUploadInput
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isLoading}
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
                name="ceoId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Melanin Kapital&apos;s CEO name *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select user" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem key={user.clerkId} value={user.clerkId!}>
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
                <FormLabel>Melanin Kapital&apos;s CEO email *</FormLabel>
                <FormControl>
                  <Textarea readOnly value={selectedCeoEmail} />
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
