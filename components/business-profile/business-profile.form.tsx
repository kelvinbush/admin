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
import React, { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useGetBusinessProfileByPersonalGuidQuery } from "@/lib/redux/services/user";
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Business name</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly />
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
              disabled
            />

            <SearchableSelect
              name="year"
              label="Year of business registration"
              notFound="No year was found"
              options={years}
              placeholder="Select year of incorporation"
              required={true}
              control={form.control}
              disabled
            />
            <SearchableSelect
              name="sector"
              label="Sector"
              notFound="No sector was found"
              options={sampleSectors}
              placeholder="Select business sector"
              required={true}
              control={form.control}
              disabled
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel required>Business description</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={4} readOnly />
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

export default BusinessProfileForm;
