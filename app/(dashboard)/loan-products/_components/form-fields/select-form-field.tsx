import * as React from "react";
import { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { SelectWithDescription } from "@/components/ui/select-with-description";
import { Button } from "@/components/ui/button";

export type SelectOption = {
  value: string;
  label: string;
  description?: string;
};

interface SelectFormFieldProps {
  name: string;
  label: string;
  options: SelectOption[];
  control: Control<any>;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  description?: string;
  addNewOption?: {
    label: string;
    onClick: () => void;
  };
}

export function SelectFormField({
  name,
  label,
  options,
  control,
  placeholder = "Select an option",
  required = false,
  disabled = false,
  description,
  addNewOption,
}: SelectFormFieldProps) {
  return (
    <FormField
      control={control as any}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <div className="flex justify-between items-center">
            <FormLabel>
              {label} {required && <span className="text-red-500">*</span>}
            </FormLabel>
            {addNewOption && (
              <Button
                variant="link"
                className="h-auto p-0 text-xs text-green-500 hover:text-green-600"
                type="button"
                onClick={addNewOption.onClick}
              >
                {addNewOption.label}
              </Button>
            )}
          </div>
          <FormControl>
            <SelectWithDescription
              options={options}
              value={field.value}
              onValueChange={field.onChange}
              placeholder={placeholder}
              error={!!fieldState.error}
              disabled={disabled}
            />
          </FormControl>
          <FormMessage />
          {description && (
            <FormDescription className="text-xs">
              {description}
            </FormDescription>
          )}
        </FormItem>
      )}
    />
  );
}
