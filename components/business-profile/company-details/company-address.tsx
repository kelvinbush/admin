"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { userApiSlice } from "@/lib/redux/services/user";
import { cn } from "@/lib/utils";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { locationOptions } from "@/lib/types/types";

const formSchema = z.object({
  streetAddress: z.string().min(1, "Street address is required"),
  additionalDetails: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  zipCode: z.string().min(1, "Zip code is required"),
});

const CompanyAddress = ({ userId }: { userId: string }) => {
  const [, setIsDirty] = useState(false);
  const { data: response, isLoading } =
    userApiSlice.useGetBusinessProfileByPersonalGuidQuery({
      guid: userId as string,
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      streetAddress: "",
      additionalDetails: "",
      country: "",
      city: "",
      zipCode: "",
    },
  });

  // Watch for form changes
  useEffect(() => {
    const subscription = form.watch(() => {
      setIsDirty(true);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  useEffect(() => {
    if (response?.business) {
      const business = response.business;
      form.reset({
        streetAddress: business.street1 || "",
        additionalDetails: business.street2 || "",
        country: business.country || "",
        city: business.city || "",
        zipCode: business.postalCode || "",
      });
      setIsDirty(false);
    }
  }, [response, form]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!response?.business) return;
    console.log(data);
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className={cn("space-y-6")}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="streetAddress"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel required>Street address</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="additionalDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional details</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SearchableSelect
              name="country"
              label="Country"
              notFound="No country was found"
              options={locationOptions}
              placeholder="Select country"
              required={true}
              control={form.control}
              disabled
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>City</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Zip code</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CompanyAddress;
