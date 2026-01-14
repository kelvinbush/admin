"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Info } from "lucide-react";

const schema = z.object({
  approverId: z.string().min(1, "Approver is required"),
  approverEmail: z.string().email("Invalid email address"),
});

export interface InternalUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface NextApproverModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { approverId: string; approverEmail: string }) => void;
  users: InternalUser[];
  isLoading?: boolean;
}

export function NextApproverModal({ open, onOpenChange, onSubmit, users, isLoading }: NextApproverModalProps) {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      approverId: "",
      approverEmail: "",
    },
  });

  const selectedApproverId = watch("approverId");

  useEffect(() => {
    const selectedUser = users.find((user) => user.id === selectedApproverId);
    if (selectedUser) {
      setValue("approverEmail", selectedUser.email, { shouldValidate: true });
    } else {
      setValue("approverEmail", "", { shouldValidate: true });
    }
  }, [selectedApproverId, users, setValue]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-medium text-midnight-blue mb-2">Additional details</DialogTitle>
          <p className="text-primaryGrey-400">Fill in the required information below to proceed to the next step</p>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
          <div>
            <h3 className="text-lg font-medium text-midnight-blue mb-4">Next approver's details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primaryGrey-500 mb-1">Select approver(s) *</label>
                <Controller
                  name="approverId"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select approver" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.firstName} {user.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.approverId && <p className="text-red-500 text-xs mt-1">{errors.approverId.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-primaryGrey-500 mb-1">Approver's email(s) *</label>
                <Controller
                  name="approverEmail"
                  control={control}
                  render={({ field }) => <Input {...field} placeholder="Enter email" readOnly />}
                />
                {errors.approverEmail && <p className="text-red-500 text-xs mt-1">{errors.approverEmail.message}</p>}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-md">
            <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-700">
              Please review the above details before submitting. An email notification will be sent to inform them that this loan request requires their attention.
            </p>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="text-white border-0"
              style={{
                background: 'linear-gradient(90deg, #0C9 0%, #F0459C 100%)',
              }}
            >
              {isLoading ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
