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
import { Input } from "@/components/ui/input";
import { FileUploadInput } from "./file-upload-input";

const formSchema = z.object({
  amountDisbursed: z
    .string()
    .min(1, "Amount disbursed is required.")
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0,
      "Amount must be a positive number."
    ),
  currency: z.string().min(3, "Currency is required.").max(10),
  disbursementReceipt: z
    .object({
      docUrl: z.string(),
      docName: z.string(),
    })
    .refine((val) => val && !!val.docUrl, "Disbursement receipt is required."),
});

export type DisburseLoanFormValues = z.infer<typeof formSchema>;

interface DisburseLoanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: DisburseLoanFormValues) => void;
  isLoading: boolean;
  defaultCurrency?: string;
}

export function DisburseLoanModal({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
  defaultCurrency = "EUR",
}: DisburseLoanModalProps) {
  const form = useForm<DisburseLoanFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amountDisbursed: "",
      currency: defaultCurrency,
      disbursementReceipt: undefined,
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset({
        amountDisbursed: "",
        currency: defaultCurrency,
        disbursementReceipt: undefined,
      });
    }
  }, [open, form, defaultCurrency]);

  const handleSubmit = (values: DisburseLoanFormValues) => {
    onSubmit({
      ...values,
      amountDisbursed: values.amountDisbursed, // Keep as string for form, will be converted in parent
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-medium">
            Additional details
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-500">
          Fill in the required information below to proceed to the next step
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="amountDisbursed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount disbursed *</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="Enter value"
                          {...field}
                          className="flex-1"
                        />
                      </FormControl>
                      <FormField
                        control={form.control}
                        name="currency"
                        render={({ field: currencyField }) => (
                          <Select
                            onValueChange={currencyField.onChange}
                            defaultValue={currencyField.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-[120px]">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="EUR">EUR</SelectItem>
                              <SelectItem value="USD">USD</SelectItem>
                              <SelectItem value="GBP">GBP</SelectItem>
                              <SelectItem value="KES">KES</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="disbursementReceipt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload disbursement receipt *</FormLabel>
                    <FormControl>
                      <FileUploadInput
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isLoading}
                        docName="Disbursement Receipt"
                      />
                    </FormControl>
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
