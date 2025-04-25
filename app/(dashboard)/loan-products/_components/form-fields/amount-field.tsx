import * as React from "react";
import { Control, UseFormSetValue, UseFormWatch } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { InputWithCurrency } from "@/components/ui/input-with-currency";

interface AmountFieldProps {
  name: string;
  label: string;
  control: Control<any>;
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
  currencyFieldName: string;
  required?: boolean;
  placeholder?: string;
}

export function AmountField({
  name,
  label,
  control,
  setValue,
  watch,
  currencyFieldName,
  required = false,
  placeholder = "Enter amount",
}: AmountFieldProps) {
  // Watch the currency field to ensure it's always up to date
  const currencyValue = watch(currencyFieldName);
  return (
    <FormField
      control={control as any}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>
            {label} {required && <span className="text-red-500">*</span>}
          </FormLabel>
          <FormControl>
            <InputWithCurrency
              placeholder={placeholder}
              {...field}
              currencyValue={currencyValue}
              onCurrencyValueChange={(value) => {
                // Use the setValue function passed as prop
                setValue(currencyFieldName, value);
              }}
              error={!!fieldState.error}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
