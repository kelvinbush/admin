import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import React, { useEffect } from "react";
import { Loader2 } from "lucide-react";
import {
  useGetBusinessProfileByPersonalGuidQuery,
  useUpdateBusinessProfileMutation,
} from "@/lib/redux/services/user";
import {
  AddBusinessSchemaWithoutPosition,
  TAddBusinessExcludingPosition,
} from "@/components/auth/forms/add-business.validation";
import {
  incorporationTypeOptions,
  sampleSectors,
  years,
} from "@/lib/types/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { SearchableSelect } from "@/components/ui/searchable-select";

const BusinessProfileForm = ({ userId }: { userId: string }) => {
  const { data: response, isLoading } =
    useGetBusinessProfileByPersonalGuidQuery(
      { guid: userId || "" },
      { skip: !userId },
    );

  const [updateBusinessProfile, { isLoading: isUpdating }] =
    useUpdateBusinessProfileMutation();

  const form = useForm<TAddBusinessExcludingPosition>({
    resolver: zodResolver(AddBusinessSchemaWithoutPosition),
    defaultValues: {
      name: "",
      description: "",
      incorporation: "",
      year: "",
      sector: "",
    },
  });

  useEffect(() => {
    if (response?.business) {
      const business = response.business;
      form.reset({
        name: business.businessName,
        description: business.businessDescription,
        incorporation: business.typeOfIncorporation,
        year: business.yearOfRegistration ?? "",
        sector: business.sector,
      });
    }
  }, [response, form]);

  const onSubmit = async (data: TAddBusinessExcludingPosition) => {
    if (!response?.business) {
      toast.error("Business profile data not found");
      return;
    }

    toast.promise(
      updateBusinessProfile({
        businessName: data.name,
        businessDescription: data.description,
        typeOfIncorporation: data.incorporation,
        sector: data.sector,
        location: response.business.country,
        city: response.business.city,
        country: response.business.country, // Use the selected location as country
        street1: response.business.street1,
        street2: response.business.street2,
        postalCode: response.business.postalCode,
        averageAnnualTurnover: response.business.averageAnnualTurnover,
        averageMonthlyTurnover: response.business.averageMonthlyTurnover,
        previousLoans: response.business.previousLoans,
        loanAmount: response.business.loanAmount,
        recentLoanStatus: response.business.recentLoanStatus,
        defaultReason: response.business.defaultReason,
        businessGuid: response.business.businessGuid,
        businessLogo: response.business.businessLogo || "",
        yearOfRegistration: data.year,
        isBeneficalOwner: response.business.isBeneficalOwner,
        defaultCurrency: response.business.defaultCurrency,
      }).unwrap(),
      {
        loading: "Updating business profile...",
        success: "Business profile updated successfully",
        error: "Failed to update business profile",
      },
    );
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Business name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SearchableSelect
              name="incorporation"
              label="Business legal entity type"
              notFound="No legal entity type was found"
              options={incorporationTypeOptions}
              placeholder="Select business type"
              required={true}
              control={form.control}
            />

            <SearchableSelect
              name="year"
              label="Year of business registration"
              notFound="No year was found"
              options={years}
              placeholder="Select year of incorporation"
              required={true}
              control={form.control}
            />
            <SearchableSelect
              name="sector"
              label="Sector"
              notFound="No sector was found"
              options={sampleSectors}
              placeholder="Select business sector"
              required={true}
              control={form.control}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel required>Business description</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={4} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              size="lg"
              disabled={
                isUpdating || !form.formState.isValid || !form.formState.isDirty
              }
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

export default BusinessProfileForm;
