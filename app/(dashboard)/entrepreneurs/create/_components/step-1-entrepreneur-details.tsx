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
import { useRouter } from "next/navigation";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const entrepreneurDetailsSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  phoneNumber: z.string().optional(),
  gender: z.string().min(1, "Gender is required"),
  dateOfBirth: z.date().optional(),
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

export function Step1EntrepreneurDetails() {
  const router = useRouter();

  const form = useForm<EntrepreneurDetailsFormData>({
    resolver: zodResolver(entrepreneurDetailsSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      gender: "",
      dateOfBirth: undefined,
      positionHeld: "",
      specifyPosition: "",
    },
  });

  const positionHeld = form.watch("positionHeld");

  const onSubmit = (data: EntrepreneurDetailsFormData) => {
    console.log("Form data:", data);
    // Navigate to next step
    router.push("/entrepreneurs/create?step=2");
  };

  const handleCancel = () => {
    router.push("/entrepreneurs");
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm text-primary-green mb-2">STEP 1/7</div>
        <h2 className="text-2xl font-semibold text-midnight-blue mb-2">
          Entrepreneur Details
        </h2>
        <p className="text-sm text-primaryGrey-500">
          Provide the personal information of the entrepreneur
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required className="text-primaryGrey-400">First name</FormLabel>
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
                  <FormLabel required className="text-primaryGrey-400">Last name</FormLabel>
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

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required className="text-primaryGrey-400">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      {...field}
                      className={cn(
                        "h-10",
                        form.formState.errors.email && "border-red-500"
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone Number */}
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primaryGrey-400">Phone number (optional)</FormLabel>
                  <FormControl>
                    <div className="[&_.react-tel-input]:w-full">
                      <PhoneInput
                        country="ke"
                        value={field.value || ""}
                        onChange={(value) => field.onChange(value)}
                        inputClass={cn(
                          "!h-10 !w-full !rounded-md !border !border-input px-3 !py-1 !text-sm !shadow-sm",
                          form.formState.errors.phoneNumber && "!border-red-500"
                        )}
                        buttonClass="!h-10 !rounded-l-md !border-r !border-input !bg-primaryGrey-50 !rounded-r-none"
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
                  <FormLabel required className="text-primaryGrey-400">Gender</FormLabel>
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
                  <FormLabel className="text-primaryGrey-400">Date of birth (optional)</FormLabel>
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
                            format(field.value, "PPP")
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

            {/* Position Held - Spans two columns */}
            <FormField
              control={form.control}
              name="positionHeld"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="text-primaryGrey-400">Position held (optional)</FormLabel>
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
                  <FormLabel required className="text-primaryGrey-400">Specify position</FormLabel>
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

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
            size="lg"
              type="button"
              variant="outline"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
            size="lg"
              type="submit"
              className="text-white border-0"
              style={{
                background:
                  "linear-gradient(90deg, var(--green-500, #0C9) 0%, var(--pink-500, #F0459C) 100%)",
              }}
            >
              Save & Continue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
