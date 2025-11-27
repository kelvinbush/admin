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
import { useSMEOnboarding } from "../_context/sme-onboarding-context";
import { useCreateSMEUser, useUpdateSMEUserStep1, useSMEUser } from "@/lib/api/hooks/sme";
import { toast } from "sonner";
import { useEffect } from "react";

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
  const { userId, setUserId, refreshState } = useSMEOnboarding();
  const createUserMutation = useCreateSMEUser();
  const updateUserMutation = useUpdateSMEUserStep1();
  
  // Fetch full user details if userId is present
  const { data: userDetail, isLoading: isLoadingUser } = useSMEUser(userId || "", {
    enabled: !!userId,
  });

  // Determine if we're editing (userId exists, regardless of completion status)
  const isEditing = !!userId;

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

  // Load existing data if userId is present
  useEffect(() => {
    if (userId && userDetail?.user) {
      const user = userDetail.user;
      form.reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phoneNumber: user.phone || "",
        gender: user.gender || "",
        dateOfBirth: user.dob ? new Date(user.dob) : undefined,
        positionHeld: user.position || "",
        specifyPosition: user.position || "",
      });
    }
  }, [userId, userDetail, form]);

  const positionHeld = form.watch("positionHeld");

  const onSubmit = async (data: EntrepreneurDetailsFormData) => {
    try {
      // Format date for API (YYYY-MM-DD)
      const dob = data.dateOfBirth ? format(data.dateOfBirth, "yyyy-MM-dd") : "";
      const position = data.positionHeld === "other" ? data.specifyPosition : data.positionHeld;

      let newUserId = userId;

      if (userId) {
        // Update existing user (edit mode)
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
        toast.success("Entrepreneur details updated successfully.");
      } else {
        // Create new user
        const response = await createUserMutation.mutateAsync({
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phoneNumber || "",
          dob,
          gender: data.gender,
          position: position || "",
        });
        
        // Set userId and update URL
        newUserId = response.userId;
        setUserId(newUserId);
        toast.success("Entrepreneur created successfully. Proceeding to next step.");
      }

      // Refresh state and navigate to next step
      refreshState();
      router.push(`/entrepreneurs/create?userId=${newUserId}&step=2`);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error || error?.message || "Failed to save entrepreneur details.";
      toast.error(errorMessage);
    }
  };

  const handleCancel = () => {
    router.push("/entrepreneurs");
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-primary-green">STEP 1/7</div>
          {isEditing && (
            <div className="text-xs text-primaryGrey-400 bg-primaryGrey-50 px-2 py-1 rounded">
              Editing existing data
            </div>
          )}
        </div>
        <h2 className="text-2xl font-semibold text-midnight-blue mb-2">
          Entrepreneur Details
        </h2>
        <p className="text-sm text-primaryGrey-500">
          Provide the personal information of the entrepreneur
        </p>
      </div>

      {isLoadingUser && userId ? (
        <div className="flex items-center justify-center py-8">
          <p className="text-sm text-primaryGrey-500">Loading entrepreneur data...</p>
        </div>
      ) : (
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
                      <PopoverContent className="w-auto p-0 z-50" align="start" sideOffset={4}>
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          captionLayout="dropdown"
                          fromYear={1900}
                          toYear={new Date().getFullYear()}
                          disabled={(date) => date > new Date()}
                          initialFocus
                          className="rounded-md border"
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
              disabled={createUserMutation.isPending || updateUserMutation.isPending || isLoadingUser}
              style={{
                background:
                  "linear-gradient(90deg, var(--green-500, #0C9) 0%, var(--pink-500, #F0459C) 100%)",
              }}
            >
              {isLoadingUser
                ? "Loading..."
                : createUserMutation.isPending || updateUserMutation.isPending
                ? "Saving..."
                : "Save & Continue"}
            </Button>
          </div>
        </form>
      </Form>
      )}
    </div>
  );
}
