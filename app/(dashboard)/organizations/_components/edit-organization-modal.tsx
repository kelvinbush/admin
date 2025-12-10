"use client";

import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateOrganization } from "@/lib/api/hooks/organizations";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const updateOrganizationSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name must be less than 255 characters").optional(),
  description: z.string().optional(),
});

type UpdateOrganizationFormData = z.infer<typeof updateOrganizationSchema>;

interface EditOrganizationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string;
  initialName: string;
  initialDescription?: string | null;
  onUpdated?: () => void;
}

export function EditOrganizationModal({
  open,
  onOpenChange,
  organizationId,
  initialName,
  initialDescription,
  onUpdated,
}: EditOrganizationModalProps) {
  const updateMutation = useUpdateOrganization(organizationId);

  const form = useForm<UpdateOrganizationFormData>({
    resolver: zodResolver(updateOrganizationSchema),
    defaultValues: {
      name: initialName,
      description: initialDescription || "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: initialName,
        description: initialDescription || "",
      });
    }
  }, [open, initialName, initialDescription, form]);

  const onSubmit = async (data: UpdateOrganizationFormData) => {
    try {
      await updateMutation.mutateAsync({
        name: data.name,
        description: data.description || undefined,
      });
      toast.success("Organization updated successfully");
      form.reset();
      onOpenChange(false);
      if (onUpdated) onUpdated();
    } catch (error: any) {
      console.error("Failed to update organization:", error);
      toast.error(error?.response?.data?.message || "Failed to update organization");
    }
  };

  const handleClose = () => {
    if (!updateMutation.isPending) {
      form.reset();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-medium text-midnight-blue">
            Edit Organization
          </DialogTitle>
          <DialogDescription className="text-primaryGrey-500">
            Update the details below to modify this organization.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required className="text-sm text-[#444C53]">
                    Organization Name
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-[#444C53]">
                    Description (Optional)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter organization description"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-8 border-t pt-6 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={updateMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="text-white border-0"
                style={{
                  background:
                    "linear-gradient(90deg, var(--green-500, #0C9) 0%, var(--pink-500, #F0459C) 100%)",
                }}
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? "Updating..." : "Update"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

