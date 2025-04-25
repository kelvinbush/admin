"use client";

import { useForm } from "react-hook-form";
import type { UseFormProps } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

/**
 * A type-safe wrapper for useForm with Zod validation
 * This ensures proper type inference and validation throughout the form
 */
export function useZodForm<TSchema extends z.ZodType>(
  props: Omit<UseFormProps<z.infer<TSchema>>, 'resolver'> & {
    schema: TSchema;
  }
) {
  const { schema, ...formProps } = props;
  
  return useForm<z.infer<TSchema>>({
    ...formProps,
    resolver: zodResolver(schema),
  });
}
