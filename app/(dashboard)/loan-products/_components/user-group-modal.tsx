"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { SelectWithDescription } from "@/components/ui/select-with-description";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { GradientButton } from "@/app/(dashboard)/loan-fees/_components/gradient-button";

interface UserGroupModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: UserGroupFormValues) => void;
}

const userGroupSchema = z.object({
  groupName: z.string().min(1, "Group name is required"),
  groupIdentifier: z.string().optional(),
  loanProductVisibility: z
    .string()
    .min(1, "Loan product visibility is required"),
  description: z.string().optional(),
  addAllCustomers: z.boolean().default(false),
});

type UserGroupFormValues = z.infer<typeof userGroupSchema>;

export function UserGroupModal({ open, onClose, onSave }: UserGroupModalProps) {
  const form = useForm<UserGroupFormValues>({
    resolver: zodResolver(userGroupSchema) as any,
    defaultValues: {
      groupName: "",
      groupIdentifier: "",
      loanProductVisibility: "",
      description: "",
      addAllCustomers: false,
    },
  });

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      form.reset();
    }
  }, [open, form]);

  const handleSubmit = form.handleSubmit((data) => {
    onSave(data as UserGroupFormValues);
    onClose();
  });

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-medium">
            Create user group
          </DialogTitle>
          <DialogDescription className={"text-xl"}>
            Fill in the details below to create a new user group
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="groupName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Group name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter user group name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="groupIdentifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Group no/identifier (optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter user group identifier"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="loanProductVisibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Loan product visibility{" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <SelectWithDescription
                      options={[
                        {
                          value: "all",
                          label: "All loan products",
                          description:
                            "Group will see all available loan products",
                        },
                        {
                          value: "specific",
                          label: "Specific loan products",
                          description:
                            "Group will only see selected loan products",
                        },
                      ]}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Select loan product"
                      error={!!form.formState.errors.loanProductVisibility}
                    />
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
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Briefly describe the user group here..."
                      className="min-h-[100px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-right text-xs">
                    {field.value?.length || 0}/150
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="addAllCustomers"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Add all existing customers to this group
                    </FormLabel>
                  </div>
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
                Submit
              </GradientButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
