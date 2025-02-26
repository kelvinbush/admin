import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useAppSelector } from "@/lib/redux/hooks";
import { selectCurrentToken } from "@/lib/redux/features/authSlice";
import {
  AddBusinessSchema,
  TAddBusiness,
} from "@/components/auth/forms/add-business.validation";
import { useRouter } from "next/navigation";
import { useAddBusinessMutation } from "@/lib/redux/services/user";
import { toast } from "sonner";
import {
  incorporationTypeOptions,
  locationOptions,
  sampleSectors,
  years,
} from "@/lib/types/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Icons } from "@/components/icons";
import { Card } from "@/components/ui/card";
import { useFormValidation } from "@/lib/hooks/useFormValidation";
import { SearchableSelect } from "@/components/ui/searchable-select";

type AddBusinessFormProps = React.HTMLAttributes<HTMLDivElement>;

const AddBusinessForm = ({ className, ...props }: AddBusinessFormProps) => {
  const userId = useAppSelector(selectCurrentToken);
  const form = useForm<TAddBusiness>({
    resolver: zodResolver(AddBusinessSchema),
  });

  const router = useRouter();
  const { isValid } = useFormValidation(form);

  const [addBusiness, { isLoading }] = useAddBusinessMutation();

  const onSubmit = (data: TAddBusiness) => {
    toast.promise(
      addBusiness({
        business: data,
        guid: userId!,
      }),
      {
        loading: "Setting up your business...",
        success: () => {
          router.push("/verify-identity");
          return "Your business was added successfully";
        },
        error: (err) => {
          if (err.data?.message) {
            return err.data.message;
          }
          return "An error occurred";
        },
      },
    );
  };

  const [wordCount, setWordCount] = useState(0);

  return (
    <div className={cn(className)} {...props}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-4"
        >
          <FormField
            control={form.control}
            name={"name"}
            render={({ field }) => (
              <FormItem className={"col-span-2"}>
                <FormLabel required>Business name</FormLabel>
                <FormControl>
                  <Input placeholder={"Enter business name"} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"description"}
            render={({ field }) => (
              <FormItem className={"col-span-2 relative"}>
                <FormLabel required>Business description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={"Briefly explain what your business does..."}
                    {...field}
                    onChange={(e) => {
                      const words = e.target.value.split(/\s+/).filter(Boolean);
                      if (words.length <= 150) {
                        field.onChange(e);
                        setWordCount(words.length);
                      }
                    }}
                  />
                </FormControl>
                <div className="absolute bottom-2 right-2 text-sm text-gray-500">
                  {wordCount}/150
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <SearchableSelect
            name="legal"
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
            name="location"
            label="Business location/headquarters"
            notFound="No location was found"
            options={locationOptions}
            placeholder="Select location"
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
          <div className={"col-span-2"}>
            <FormField
              control={form.control}
              name="isBeneficialOwner"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel required>
                    Are you are a beneficial owner of the company?
                  </FormLabel>
                  <Card className={"flex gap-6 p-4 shadow-md"}>
                    <Icons.needHelp className={"h-8 w-8"} />
                    <p className={"text-sm font-normal"}>
                      A beneficial owner is a legal person who owns more than
                      25% of the capital or voting rights of a company, or has
                      control over its management.
                    </p>
                  </Card>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      className="flex flex-col"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="true" />
                        </FormControl>
                        <FormLabel className="font-normal">Yes, I am</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="false" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          No, Im not
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            type={"submit"}
            className={"col-span-2 py-6"}
            disabled={isLoading || !isValid || wordCount > 150}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddBusinessForm;
