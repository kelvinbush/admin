"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  userApiSlice,
  useUpdateBusinessProfileMutation,
} from "@/lib/redux/services/user";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { locationOptions } from "@/lib/types/types";
import { useParams } from "next/navigation";

const formSchema = z.object({
  streetAddress: z.string().min(1, "Street address is required"),
  additionalDetails: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  zipCode: z.string().min(1, "Zip code is required"),
});

type IProps = React.HTMLAttributes<HTMLDivElement>;

const CompanyAddress = ({ className, ...props }: IProps) => {
  const { userId } = useParams();
  const [isDirty, setIsDirty] = useState(false);
  const { data: response, isLoading } =
    userApiSlice.useGetBusinessProfileByPersonalGuidQuery({
      guid: userId as string,
    });
  const [updateBusinessProfile, { isLoading: isUpdating }] =
    useUpdateBusinessProfileMutation();

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

    try {
      await updateBusinessProfile({
        businessName: response.business.businessName,
        businessDescription: response.business.businessDescription,
        typeOfIncorporation: response.business.typeOfIncorporation,
        sector: response.business.sector,
        location: response.business.location,
        city: data.city,
        country: data.country,
        street1: data.streetAddress,
        street2: data.additionalDetails || "",
        postalCode: data.zipCode,
        averageAnnualTurnover: response.business.averageAnnualTurnover,
        averageMonthlyTurnover: response.business.averageMonthlyTurnover,
        previousLoans: response.business.previousLoans,
        loanAmount: response.business.loanAmount,
        recentLoanStatus: response.business.recentLoanStatus,
        defaultReason: response.business.defaultReason,
        businessGuid: response.business.businessGuid,
        businessLogo: response.business.businessLogo || "",
        yearOfRegistration: response.business.yearOfRegistration,
        isBeneficalOwner: false,
        defaultCurrency: response.business.defaultCurrency,
      }).unwrap();

      toast.success("Company address updated successfully");
      setIsDirty(false);
    } catch (error) {
      console.error("Error updating company address:", error);
      toast.error("Failed to update company address. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)} {...props}>
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
                    <Input {...field} />
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
                    <Input {...field} />
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
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>City</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end col-span-2">
            <Button
              type="submit"
              size="lg"
              disabled={isUpdating || !form.formState.isValid || !isDirty}
              className="bg-midnight-blue hover:bg-midnight-blue/90"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CompanyAddress;
