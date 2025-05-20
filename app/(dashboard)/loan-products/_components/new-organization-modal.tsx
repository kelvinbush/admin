"use client";

import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SelectWithDescription } from "@/components/ui/select-with-description";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { GradientButton } from "@/app/(dashboard)/loan-fees/_components/gradient-button";

interface NewOrganizationModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (organization: OrganizationFormValues) => void;
}

const organizationSchema = z.object({
  name: z.string().min(1, "Organization name is required"),
  type: z.string().min(1, "Affiliation type is required"),
  description: z.string().optional(),
});

// Affiliation type options with descriptions
const affiliationTypeOptions = [
  {
    value: "partner",
    label: "Partner",
    description:
      "Organizations that collaborate with Melanin Kapital on various initiatives",
  },
  {
    value: "lender",
    label: "Lender",
    description:
      "Financial institutions that provide loans through the platform",
  },
  {
    value: "fintech",
    label: "Fintech",
    description:
      "Technology companies offering financial services or solutions",
  },
  {
    value: "bank",
    label: "Bank",
    description:
      "Traditional banking institutions working with Melanin Kapital",
  },
  {
    value: "other",
    label: "Other",
    description:
      "Any other type of organization not covered by the categories above",
  },
];

type OrganizationFormValues = z.infer<typeof organizationSchema>;

export function NewOrganizationModal({
  open,
  onClose,
  onSave,
}: NewOrganizationModalProps) {
  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationSchema) as any,
    defaultValues: {
      name: "",
      type: "",
      description: "",
    },
  });

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      form.reset();
    }
  }, [open, form]);

  const handleSubmit = form.handleSubmit((data) => {
    onSave(data as OrganizationFormValues);
    onClose();
  });

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-medium">
            Create new organization
          </DialogTitle>
          <DialogDescription className={"text-xl"}>
            Fill in the details below to create a new organization
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Organization name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter organization name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Affiliation type <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <SelectWithDescription
                        value={field.value}
                        onValueChange={field.onChange}
                        options={affiliationTypeOptions}
                        placeholder="Select affiliation type"
                        error={!!form.formState.errors.type}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization description (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Briefly describe what the organization does or its business relationship with Melanin Kapital here..."
                      className="resize-none"
                      maxLength={150}
                      {...field}
                    />
                  </FormControl>
                  <div className="text-xs text-gray-500 text-right">
                    {field.value?.length || 0}/150
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4 border-t flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="w-full sm:w-auto h-11"
                size={"lg"}
              >
                Cancel
              </Button>
              <GradientButton type="submit" size={"lg"}>
                Create Organization
              </GradientButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
