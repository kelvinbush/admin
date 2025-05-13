"use client";

import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { GradientButton } from "@/app/(dashboard)/loan-fees/_components/gradient-button";
import { useCreatePartnerMutation } from "@/lib/redux/services/partner";
import { selectCurrentToken } from "@/lib/redux/features/authSlice";
import { useAppSelector } from "@/lib/redux/hooks";

interface NewPartnerModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (partnerId: string, partnerName: string) => void;
}

const partnerSchema = z.object({
  companyName: z.string().min(1, "Partner name is required"),
});

type PartnerFormValues = z.infer<typeof partnerSchema>;

export function NewPartnerModal({
  open,
  onClose,
  onSave,
}: NewPartnerModalProps) {
  const guid = useAppSelector(selectCurrentToken);
  const [createPartner, { isLoading }] = useCreatePartnerMutation();

  const form = useForm<PartnerFormValues>({
    resolver: zodResolver(partnerSchema),
    defaultValues: {
      companyName: "",
    },
  });

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      form.reset();
    }
  }, [open, form]);

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await createPartner({
        adminguid: guid as string,
        companyname: data.companyName,
      }).unwrap();

      // We don't have the partner ID here since the API doesn't return it
      // In a real implementation, you might want to fetch the partners again
      // or have the API return the created partner
      onSave("temp-id", data.companyName);
      onClose();
    } catch (error) {
      console.error("Failed to create partner:", error);
    }
  });

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium">
            Create new partner
          </DialogTitle>
          <DialogDescription>
            Add a new partner organization to the system
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Partner name <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter partner name" {...field} />
                  </FormControl>
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
                disabled={isLoading}
              >
                Cancel
              </Button>
              <GradientButton type="submit" size={"lg"} disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Partner"}
              </GradientButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
