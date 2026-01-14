"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  reason: z.string().min(1, "Rejection reason is required."),
});

export type RejectLoanFormValues = z.infer<typeof formSchema>;

interface RejectLoanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: RejectLoanFormValues) => void;
  isLoading: boolean;
}

export function RejectLoanModal({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: RejectLoanModalProps) {
  const form = useForm<RejectLoanFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reason: "",
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
          <DialogTitle className="text-2xl font-medium">Reject Loan Application</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-500">
          Please provide a reason for rejecting this loan application.
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rejection Reason</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter rejection reason..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" size="lg" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="destructive" size="lg" disabled={isLoading}>
                {isLoading ? "Rejecting..." : "Reject"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
