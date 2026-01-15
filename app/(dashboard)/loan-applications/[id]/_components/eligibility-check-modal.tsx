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
}

const formSchema = z.object({
  assessmentComment: z.string().min(1, "Assessment comment is required."),
  supportingDocument: z
    .object({
      docUrl: z.string(),
      docName: z.string(),
    })
    .optional(),
  nextApproverId: z.string().min(1, "Next approver is required."),
});

export type EligibilityCheckFormValues = z.infer<typeof formSchema>;

interface EligibilityCheckModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: EligibilityCheckFormValues) => void;
  users: SimplifiedUser[];
  isLoading: boolean;
}

export function EligibilityCheckModal({
  open,
  onOpenChange,
  onSubmit,
  users,
  isLoading,
}: EligibilityCheckModalProps) {
  const form = useForm<EligibilityCheckFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      assessmentComment: "",
      supportingDocument: undefined,
      nextApproverId: "",
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

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
                Eligibility check details
              </h3>
              <FormField
                control={form.control}
                name="assessmentComment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Eligibility assessment comment *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Briefly explain why the SME meets the funding criteria"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="supportingDocument"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Upload supporting documents (optional)
                    </FormLabel>
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
