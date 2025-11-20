"use client";

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { SelectWithDescription, type SelectOption } from "@/components/ui/select-with-description";
import { FileUpload } from "@/components/ui/file-upload";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Control, UseFormWatch } from "react-hook-form";

export interface FinancialStatementData {
  year: string;
  statementFile: string;
}

interface FinancialStatementEntryProps {
  index: number;
  control: Control<any>;
  watch: UseFormWatch<any>;
  onRemove: () => void;
  yearOptions: SelectOption[];
  usedYears: string[];
}

export function FinancialStatementEntry({
  index,
  control,
  watch,
  onRemove,
  yearOptions,
  usedYears,
}: FinancialStatementEntryProps) {
  const selectedYear = watch(`financialStatements.${index}.year`);
  
  // Filter out already used years from options (but keep the current selection)
  const availableYearOptions = yearOptions.filter(
    (option) => !usedYears.includes(option.value) || option.value === selectedYear
  );

  return (
    <div className="space-y-4 p-4 border border-primaryGrey-200 rounded-md bg-white">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-midnight-blue">
          Financial Statement {index + 1}
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

      {/* Financial Statement Year */}
      <FormField
        control={control}
        name={`financialStatements.${index}.year`}
        render={({ field }) => (
          <FormItem>
            <FormLabel required className="text-primaryGrey-400">
              Financial statement year
            </FormLabel>
            <FormControl>
              <SelectWithDescription
                options={availableYearOptions}
                value={field.value}
                onValueChange={field.onChange}
                placeholder="Select year"
                triggerClassName="h-10"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Upload Financial Statement */}
      <FormField
        control={control}
        name={`financialStatements.${index}.statementFile`}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <FileUpload
                value={field.value}
                onChange={field.onChange}
                label={`Upload financial statement for the year ${selectedYear || "____"}`}
                required
                acceptedFormats={["PDF", "PNG", "JPG", "JPEG"]}
                maxSizeMB={8}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

