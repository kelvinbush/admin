"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GradientButton } from "./gradient-button";
import { Input } from "@/components/ui/input";
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
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ValueBand } from "./value-band-table";

interface ValueBandModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (band: ValueBand) => void;
  isEditing?: boolean;
  initialValues?: ValueBand;
  feeLabel: string;
  isRate: boolean;
}

const valueBandSchema = z
  .object({
    minAmount: z.number({
      required_error: "Minimum amount is required",
      invalid_type_error: "Minimum amount must be a number",
    }),
    maxAmount: z.number({
      required_error: "Maximum amount is required",
      invalid_type_error: "Maximum amount must be a number",
    }),
    fee: z.number({
      required_error: "Fee value is required",
      invalid_type_error: "Fee value must be a number",
    }),
  })
  .refine((data) => data.maxAmount > data.minAmount, {
    message: "Maximum amount must be greater than minimum amount",
    path: ["maxAmount"],
  });

type FormValues = z.infer<typeof valueBandSchema>;

export function ValueBandModal({
  open,
  onClose,
  onSave,
  isEditing = false,
  initialValues,
  feeLabel,
  isRate,
}: ValueBandModalProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(valueBandSchema),
    defaultValues: initialValues || {
      minAmount: undefined,
      maxAmount: undefined,
      fee: undefined,
    },
  });

  // Reset form when modal opens with new values
  useEffect(() => {
    if (open && initialValues) {
      form.reset(initialValues);
    } else if (open) {
      form.reset({
        minAmount: undefined,
        maxAmount: undefined,
        fee: undefined,
      });
    }
  }, [open, initialValues, form]);

  const minAmount = form.watch("minAmount");
  const maxAmount = form.watch("maxAmount");
  const fee = form.watch("fee");

  const handleSubmit = (data: FormValues) => {
    onSave({
      ...data,
      id: initialValues?.id,
    });
    onClose();
  };

  // Generate tip text based on form values
  const getTipText = () => {
    const min = minAmount !== undefined ? minAmount : "[min]";
    const max = maxAmount !== undefined ? maxAmount : "[max]";
    const feeValue = fee !== undefined ? fee : "[fee]";

    if (isRate) {
      return `This will apply a ${feeValue}% fee for loans between ${min} and ${max}.`;
    } else {
      return `This will apply a fixed fee of ${feeValue} EUR for loans between ${min} and ${max}.`;
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className={"text-3xl font-medium"}>
            {isEditing ? "Edit value band" : "Add value band"}
          </DialogTitle>
          <DialogDescription className={"text-primaryGrey-400 text-xl"}>
            Define a loan amount range and the loan fee to be charged
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="minAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Min amount (EUR) <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter value"
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : parseFloat(e.target.value),
                          )
                        }
                        value={field.value === undefined ? "" : field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Max amount (EUR) <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter value"
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : parseFloat(e.target.value),
                          )
                        }
                        value={field.value === undefined ? "" : field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="fee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {feeLabel} <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter value"
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ""
                            ? undefined
                            : parseFloat(e.target.value),
                        )
                      }
                      value={field.value === undefined ? "" : field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <p className="text-sm text-primaryGrey-900">
              <span className="font-medium">TIP:</span> {getTipText()}
            </p>

            <DialogFooter className="flex justify-between gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                size={"lg"}
              >
                Cancel
              </Button>
              <GradientButton type="submit" size={"lg"}>
                {isEditing ? "Save Changes" : "Add Band"}
              </GradientButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
