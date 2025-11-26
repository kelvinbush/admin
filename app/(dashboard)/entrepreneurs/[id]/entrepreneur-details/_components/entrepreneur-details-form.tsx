"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SelectWithDescription, type SelectOption } from "@/components/ui/select-with-description";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useUpdateSMEUserStep1, useSavePersonalDocuments, useSMEPersonalDocuments } from "@/lib/api/hooks/sme";
import { toast } from "@/hooks/use-toast";

const entrepreneurDetailsSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  phoneNumber: z.string().optional(),
  gender: z.string().min(1, "Gender is required"),
  dateOfBirth: z.date().optional(),
  identificationNumber: z.string().optional(),
  taxIdentificationNumber: z.string().optional(),
  positionHeld: z.string().optional(),
  specifyPosition: z.string().optional(),
}).refine((data) => {
  // If positionHeld is "other", specifyPosition is required
  if (data.positionHeld === "other" && !data.specifyPosition) {
    return false;
  }
  return true;
}, {
  message: "Please specify the position title",
  path: ["specifyPosition"],
});

type EntrepreneurDetailsFormData = z.infer<typeof entrepreneurDetailsSchema>;

const genderOptions: SelectOption[] = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

const positionOptions: SelectOption[] = [
  {
    value: "founder",
    label: "Founders",
    description: "Founder, Co-founder",
  },
  {
    value: "executive",
    label: "Executive Management",
    description: "CEO, COO, CFO, CTO, CPO etc",
  },
  {
    value: "senior",
    label: "Senior Management",
    description: "VP, Director, General Manager etc",
  },
  {
    value: "other",
    label: "Other",
  },
];

interface EntrepreneurDetailsFormProps {
  userId: string;
  initialData?: Partial<EntrepreneurDetailsFormData>;
}

export function EntrepreneurDetailsForm({ userId, initialData }: EntrepreneurDetailsFormProps) {
  const form = useForm<EntrepreneurDetailsFormData>({
    resolver: zodResolver(entrepreneurDetailsSchema),
    defaultValues: {
      firstName: initialData?.firstName || "",
      lastName: initialData?.lastName || "",
      email: initialData?.email || "",
      phoneNumber: initialData?.phoneNumber || "",
      gender: initialData?.gender || "",
      dateOfBirth: initialData?.dateOfBirth,
      identificationNumber: initialData?.identificationNumber || "",
      taxIdentificationNumber: initialData?.taxIdentificationNumber || "",
      positionHeld: initialData?.positionHeld || "",
      specifyPosition: initialData?.specifyPosition || "",
    },
  });

  const positionHeld = form.watch("positionHeld");

  const updateUserMutation = useUpdateSMEUserStep1();
  const savePersonalDocsMutation = useSavePersonalDocuments();
  const { data: existingPersonalDocs } = useSMEPersonalDocuments(userId, {
    enabled: !!userId,
  });

  const onSubmit = async (data: EntrepreneurDetailsFormData) => {
    try {
      const dob = data.dateOfBirth ? format(data.dateOfBirth, "yyyy-MM-dd") : "";
      const position =
        data.positionHeld === "other" ? data.specifyPosition : data.positionHeld;

      // Update core user details (Step 1)
      await updateUserMutation.mutateAsync({
        userId,
        data: {
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phoneNumber || "",
          dob,
          gender: data.gender,
          position: position || "",
        },
      });

      // Update identification / tax numbers via Step 4 endpoint (preserving existing documents)
      const idNumber = data.identificationNumber || undefined;
      const taxNumber = data.taxIdentificationNumber || undefined;
      let idType: string | undefined;

      if (idNumber) {
        // For now, default to national_id; can be refined later if multiple ID types are supported
        idType = "national_id";
      }

      if (idNumber || taxNumber || idType) {
        const documents =
          existingPersonalDocs?.map((doc) => ({
            docType: doc.docType,
            docUrl: doc.docUrl,
          })) ?? [];

        await savePersonalDocsMutation.mutateAsync({
          userId,
          data: {
            documents,
            ...(idNumber && { idNumber }),
            ...(taxNumber && { taxNumber }),
            ...(idType && { idType }),
          },
        });
      }

      toast({
        title: "Success",
        description: "Entrepreneur details updated successfully.",
      });
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.error ||
        error?.message ||
        "Failed to update entrepreneur details.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primaryGrey-400">First name</FormLabel>
                  <FormControl>
                    <Input  
                      placeholder="Enter first name"
                      {...field}
                      className={cn(
                        "h-10",
                        form.formState.errors.firstName && "border-red-500"
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Last Name */}
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primaryGrey-400">Last name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter last name"
                      {...field}
                      className={cn(
                        "h-10",
                        form.formState.errors.lastName && "border-red-500"
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email - Read-only */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primaryGrey-400">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      {...field}
                      disabled
                      className={cn(
                        "h-10 bg-primaryGrey-50 text-primaryGrey-400 cursor-not-allowed",
                        form.formState.errors.email && "border-red-500"
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone Number - Read-only */}
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primaryGrey-400">Phone number</FormLabel>
                  <FormControl>
                    <div className="[&_.react-tel-input]:w-full">
                      <PhoneInput
                        country="ke"
                        value={field.value || ""}
                        onChange={(value) => field.onChange(value)}
                        disabled
                        inputClass={cn(
                          "!h-10 !w-full !rounded-md !border !border-input px-3 !py-1 !text-sm !shadow-sm !bg-primaryGrey-50 !text-primaryGrey-400 !cursor-not-allowed",
                          form.formState.errors.phoneNumber && "!border-red-500"
                        )}
                        buttonClass="!h-10 !rounded-l-md !border-r !border-input !bg-primaryGrey-50 !rounded-r-none !cursor-not-allowed"
                        containerClass="w-full"
                        placeholder="Enter phone number"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Gender */}
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primaryGrey-400">Gender</FormLabel>
                  <FormControl>
                    <SelectWithDescription
                      options={genderOptions}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Select gender"
                      error={!!form.formState.errors.gender}
                      triggerClassName="h-10"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date of Birth */}
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primaryGrey-400">Date of birth</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal h-10",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "MM/dd/yyyy")
                          ) : (
                            <span>Enter date of birth</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Identification Number */}
            <FormField
              control={form.control}
              name="identificationNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primaryGrey-400">Identification number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter identification number"
                      {...field}
                      className={cn(
                        "h-10",
                        form.formState.errors.identificationNumber && "border-red-500"
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tax Identification Number */}
            <FormField
              control={form.control}
              name="taxIdentificationNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primaryGrey-400">Tax identification number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter tax identification number"
                      {...field}
                      className={cn(
                        "h-10",
                        form.formState.errors.taxIdentificationNumber && "border-red-500"
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Position Held - Spans two columns */}
            <FormField
              control={form.control}
              name="positionHeld"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="text-primaryGrey-400">Position held</FormLabel>
                  <FormControl>
                    <SelectWithDescription
                      options={positionOptions}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Select position"
                      triggerClassName="h-10"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Specify Position - Only show if "Other" is selected */}
          {positionHeld === "other" && (
            <FormField
              control={form.control}
              name="specifyPosition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primaryGrey-400">Specify position</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter position title"
                      {...field}
                      className={cn(
                        "h-10",
                        form.formState.errors.specifyPosition && "border-red-500"
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Action Button */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              size="lg"
              type="submit"
              className="text-white border-0"
              style={{
                background:
                  "linear-gradient(90deg, var(--green-500, #0C9) 0%, var(--pink-500, #F0459C) 100%)",
              }}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

