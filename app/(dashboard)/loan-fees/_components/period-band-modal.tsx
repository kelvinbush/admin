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
import { PeriodBand } from "./period-band-table";

interface PeriodBandModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (band: PeriodBand) => void;
  isEditing?: boolean;
  initialValues?: PeriodBand;
  feeLabel: string;
  isRate: boolean;
}

const periodBandSchema = z
  .object({
    minPeriod: z.number({
      required_error: "Minimum period is required",
      invalid_type_error: "Minimum period must be a number",
    }),
    maxPeriod: z.number({
      required_error: "Maximum period is required",
      invalid_type_error: "Maximum period must be a number",
    }),
    fee: z.number({
      required_error: "Fee value is required",
      invalid_type_error: "Fee value must be a number",
    }),
  })
  .refine((data) => data.maxPeriod > data.minPeriod, {
    message: "Maximum period must be greater than minimum period",
    path: ["maxPeriod"],
  });

type FormValues = z.infer<typeof periodBandSchema>;

export function PeriodBandModal({
  open,
  onClose,
  onSave,
  isEditing = false,
  initialValues,
  feeLabel,
  isRate,
}: PeriodBandModalProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(periodBandSchema),
    defaultValues: initialValues || {
      minPeriod: undefined,
      maxPeriod: undefined,
      fee: undefined,
    },
  });

  // Reset form when modal opens with new values
  useEffect(() => {
    if (open && initialValues) {
      form.reset(initialValues);
    } else if (open) {
      form.reset({
        minPeriod: undefined,
        maxPeriod: undefined,
        fee: undefined,
      });
    }
  }, [open, initialValues, form]);

  const minPeriod = form.watch("minPeriod");
  const maxPeriod = form.watch("maxPeriod");
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
    const min = minPeriod !== undefined ? minPeriod : "[min]";
    const max = maxPeriod !== undefined ? maxPeriod : "[max]";
    const feeValue = fee !== undefined ? fee : "[fee]";

    if (isRate) {
      return `This will apply a ${feeValue}% fee for loan periods between ${min} and ${max} months.`;
    } else {
      return `This will apply a fixed fee of ${feeValue} EUR for loan periods between ${min} and ${max} months.`;
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className={"text-3xl font-medium"}>
            {isEditing ? "Edit period band" : "Add period band"}
          </DialogTitle>
          <DialogDescription className={"text-primaryGrey-400 text-xl"}>
            Define a loan tenure range and the fee to be charged.
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
                name="minPeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Min period (months){" "}
                      <span className="text-red-500">*</span>
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
                name="maxPeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Max period (months){" "}
                      <span className="text-red-500">*</span>
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
