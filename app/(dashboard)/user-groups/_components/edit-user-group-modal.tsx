"use client";

import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
import { UserGroup } from "./user-groups-table";

interface EditUserGroupModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: UserGroupFormValues) => void;
  userGroup: UserGroup | null;
}

const userGroupSchema = z.object({
  name: z.string().min(1, "Group name is required"),
  identifier: z.string().optional(),
  loanProductVisibility: z.string().min(1, "Loan product visibility is required"),
  description: z.string().optional(),
  addExistingCustomers: z.boolean().optional(),
});

type UserGroupFormValues = z.infer<typeof userGroupSchema>;

export function EditUserGroupModal({
  open,
  onClose,
  onSave,
  userGroup,
}: EditUserGroupModalProps) {
  const form = useForm<UserGroupFormValues>({
    resolver: zodResolver(userGroupSchema) as any,
    defaultValues: {
      name: "",
      identifier: "",
      loanProductVisibility: "",
      description: "",
      addExistingCustomers: false,
    },
  });

  // Reset form and populate with userGroup data when modal opens or userGroup changes
  useEffect(() => {
    if (open && userGroup) {
      form.reset({
        name: userGroup.name,
        identifier: userGroup.groupNo,
        loanProductVisibility: userGroup.productVisibility[0],
        description: "", // Assuming description is not in the table data
        addExistingCustomers: false,
      });
    }
  }, [open, userGroup, form]);

  const handleSubmit = form.handleSubmit((data) => {
    onSave(data);
    onClose();
  });

  // Sample loan products
  const loanProducts = [
    { id: "All loan products", name: "All loan products" },
    { id: "Ecobank loans", name: "Ecobank loans" },
    { id: "Absa loans", name: "Absa loans" },
  ];

  if (!userGroup) return null;

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl p-0 overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl">Edit user group</h2>
              <p className="text-gray-600 mt-1">Update the details below</p>
            </div>
            <DialogClose className="h-6 w-6 rounded-md">
              <X className="h-4 w-4" />
            </DialogClose>
          </div>

        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
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
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Group no/identifier (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter user group identifier" {...field} />
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
                    Loan product visibility <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select loan product" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {loanProducts.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
            
            <FormField
              control={form.control}
              name="addExistingCustomers"
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

            <div className="pt-6 border-t mt-6 flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="w-32 h-11"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="w-32 h-11 bg-gradient-to-r from-[#0C9] to-[#F0459C] text-white hover:bg-gradient-to-l hover:from-[#F0459C] hover:to-[#0C9]"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
