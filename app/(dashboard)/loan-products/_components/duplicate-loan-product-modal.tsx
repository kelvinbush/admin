"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Switch } from "@/components/ui/switch";

const formSchema = z.object({
  name: z.string().min(1, "New loan product name is required."),
  copyFees: z.boolean().default(false),
});

export type DuplicateLoanProductFormValues = z.infer<typeof formSchema>;

interface DuplicateLoanProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultName?: string;
  onSubmit: (values: DuplicateLoanProductFormValues) => void;
  isLoading?: boolean;
}

export function DuplicateLoanProductModal({
  open,
  onOpenChange,
  defaultName,
  onSubmit,
  isLoading = false,
}: DuplicateLoanProductModalProps) {
  // Use untyped form instance to avoid strict generic mismatch between
  // react-hook-form and Zod resolver (similar to other forms in this project).
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: defaultName ?? "",
      copyFees: false,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: defaultName ?? "",
        copyFees: false,
      });
    }
  }, [open, defaultName, form]);

  const handleSubmit = (values: any) => {
    onSubmit(values as DuplicateLoanProductFormValues);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[720px]">
        <DialogHeader>
          <DialogTitle className="text-3xl font-medium text-midnight-blue">
            Duplicate loan product
          </DialogTitle>
        </DialogHeader>
        <p className="text-base text-primaryGrey-500">
          Create a copy of this loan product to quickly set up a similar one.
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8 mt-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New loan product name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter loan product name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4 pt-2 border-t border-primaryGrey-100">
              <h3 className="text-base font-medium text-midnight-blue">
                Duplication options
              </h3>
              <FormField
                control={form.control}
                name="copyFees"
                render={({ field }) => (
                  <FormItem className="flex items-start gap-3">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1">
                      <FormLabel className="text-sm font-medium text-midnight-blue">
                        Copy loan fees
                      </FormLabel>
                      <p className="text-xs text-primaryGrey-500">
                        Include associated fees in the new loan product.
                      </p>
                    </div>
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
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                className="text-white border-0"
                style={{
                  background:
                    "linear-gradient(90deg, var(--green-500, #0C9) 0%, var(--pink-500, #F0459C) 100%)",
                }}
              >
                {isLoading ? "Duplicating..." : "Duplicate"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

