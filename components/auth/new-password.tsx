"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Check, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useNewPasswordMutation } from "@/lib/redux/services/auth";
import { toast } from "sonner";
import {useFormValidation} from "@/lib/hooks/useFormValidation";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Must have at least 1 uppercase letter")
  .regex(/[a-z]/, "Must have at least 1 lowercase letter")
  .regex(/[0-9]/, "Must have at least 1 number")
  .regex(/[^A-Za-z0-9]/, "Must have at least 1 special character");

const formSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export default function PasswordResetForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassword] = useNewPasswordMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { isValid } = useFormValidation(form);

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast.promise(newPassword({ ...values, personalGuid: "" }).unwrap(), {
      loading: "Resetting password...",
      success: () => {
        return "Password reset successfully";
      },
      error: (err) => {
        if (err.data?.message) {
          return err.data.message;
        }
        return "An error occurred";
      },
    });
  }

  const watchPassword = form.watch("password");

  const requirements = [
    { label: "8 Char", test: (val: string) => val.length >= 8 },
    {
      label: "1 Uppercase",
      test: (val: string) => /[A-Z]/.test(val),
    },
    { label: "1 Lowercase", test: (val: string) => /[a-z]/.test(val) },
    {
      label: "1 Digit",
      test: (val: string) => /[0-9]/.test(val),
    },
    { label: "1 Special", test: (val: string) => /[^A-Za-z0-9]/.test(val) },
  ];

  return (
    <div className="flex flex-col justify-center gap-2 p-9 text-midnight-blue">
      <div className="">
        <h1 className="mb-2 text-4xl font-bold">Create new password</h1>
        <p className="mb-6 text-2xl">
          Your password must be different from your previously used passwords
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>New password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Confirm password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              {requirements.map((req, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-center justify-center rounded-md border p-2 text-center text-sm shadow-lg ${req.test(watchPassword) ? "border-green-500 text-green-500" : "border-gray-300 text-gray-500"}`}
                >
                  {req.test(watchPassword) && (
                    <Check className="mb-1 h-4 w-4" />
                  )}
                  {req.label}
                  <p className="text-[10px]">
                    {index === 0
                      ? "Must be at least 8 characters long"
                      : index === 4
                        ? "Must have at least 1 special character from !@#$%^&*"
                        : `Must have at least 1 ${req.label.toLowerCase()}`}
                  </p>
                </div>
              ))}
              <div
                className={`flex flex-col items-center justify-center rounded-md border p-2 text-center text-xs ${form.getValues("password") === form.getValues("confirmPassword") ? "border-green-500 text-green-500" : "border-gray-300 text-gray-500"}`}
              >
                {form.getValues("password") ===
                  form.getValues("confirmPassword") && (
                  <Check className="mb-1 h-4 w-4" />
                )}
                * _ *<p className="text-[10px]">Passwords must match</p>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={
              !isValid
            }>
              Reset Password
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
