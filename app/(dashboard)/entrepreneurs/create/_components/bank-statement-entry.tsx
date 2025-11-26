"use client";

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SelectWithDescription, type SelectOption } from "@/components/ui/select-with-description";
import { FileUpload } from "@/components/ui/file-upload";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Control, UseFormWatch } from "react-hook-form";

export interface BankStatementData {
  bankName: string;
  specifyBankName: string;
  statementFile: string;
  password: string;
}

interface BankStatementEntryProps {
  index: number;
  control: Control<any>;
  watch: UseFormWatch<any>;
  onRemove: () => void;
  bankOptions: SelectOption[];
}

export function BankStatementEntry({
  index,
  control,
  watch,
  onRemove,
  bankOptions,
}: BankStatementEntryProps) {
  const bankName = watch(`bankStatements.${index}.bankName`);

  return (
    <div className="space-y-4 p-4 border border-primaryGrey-200 rounded-md bg-white">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-midnight-blue">
          Bank Statement {index + 1}
        </h4>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Remove
        </Button>
      </div>

      {/* Bank Name */}
      <FormField
        control={control}
        name={`bankStatements.${index}.bankName`}
        render={({ field }) => (
          <FormItem>
            <FormLabel required className="text-primaryGrey-400">
              Bank name
            </FormLabel>
            <FormControl>
              <SelectWithDescription
                options={bankOptions}
                value={field.value}
                onValueChange={field.onChange}
                placeholder="Select bank"
                triggerClassName="h-10"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Specify Bank Name - Only show if "Other" is selected */}
      {bankName === "other" && (
        <FormField
          control={control}
          name={`bankStatements.${index}.specifyBankName`}
          render={({ field }) => (
            <FormItem>
              <FormLabel required className="text-primaryGrey-400">
                Specify bank name
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter bank name"
                  {...field}
                  className="h-10"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* Upload Bank Statement */}
      <FormField
        control={control}
        name={`bankStatements.${index}.statementFile`}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <FileUpload
                value={field.value}
                onChange={field.onChange}
                label="Upload bank statement for the last 12 months"
                required
                acceptedFormats={["PDF", "PNG", "JPG", "JPEG"]}
                maxSizeMB={8}
                showUploadedState={!!field.value}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Bank Statement Password */}
      <FormField
        control={control}
        name={`bankStatements.${index}.password`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-primaryGrey-400">
              Bank statement password (if applicable)
            </FormLabel>
            <FormControl>
              <Input
                type="password"
                placeholder="Enter password"
                {...field}
                className="h-10"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

