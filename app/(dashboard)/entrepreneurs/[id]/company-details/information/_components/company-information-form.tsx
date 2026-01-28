"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SelectWithDescription, type SelectOption } from "@/components/ui/select-with-description";
import { MultiSelectDropdown, type MultiSelectOption } from "@/components/ui/multi-select-dropdown";
import { ImageUpload } from "@/components/ui/image-upload";
import { VideoLinkInput } from "@/components/ui/video-link-input";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useSaveBusinessBasicInfo } from "@/lib/api/hooks/sme";
import { useUserGroups } from "@/lib/api/hooks/useUserGroups";
import { toast } from "sonner";
import { businessLegalEntityTypeOptions, sectorOptions } from "@/lib/constants/business-options";

const companyInformationSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  businessLegalEntityType: z
    .string()
    .min(1, "Business legal entity type is required"),
  yearOfRegistration: z
    .string()
    .min(1, "Year of business registration is required"),
  sector: z.array(z.string()).min(1, "At least one sector is required"),
  businessDescription: z
    .string()
    .min(1, "Business description is required")
    .max(500, "Business description must be 500 characters or less"),
  programUserGroup: z
    .array(z.string())
    .min(1, "At least one program/user group is required"),
  twoXCriteria: z.array(z.string()).optional(),
  numberOfEmployees: z.string().optional(),
  companyWebsite: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  businessPhotos: z.array(z.string()).optional(),
  videoLinks: z.array(z.string()).optional(),
});

type CompanyInformationFormData = z.infer<typeof companyInformationSchema>;

const yearOptions: SelectOption[] = [
  { value: "not-registered", label: "Not yet registered" },
  ...Array.from({ length: 60 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { value: year.toString(), label: year.toString() };
  }),
];

const twoXCriteriaOptions: MultiSelectOption[] = [
  { value: "founded-by-woman", label: "Founded by a woman" },
  { value: "led-by-women", label: "Led by women" },
  { value: "employing-women", label: "Employing over 30% women" },
  { value: "serving-women", label: "Serving women clients" },
  { value: "women-value-chain", label: "Working with women in the value chain" },
];

const numberOfEmployeesOptions: SelectOption[] = [
  { value: "1-10", label: "1-10 employees" },
  { value: "11-50", label: "11-50 employees" },
  { value: "51-100", label: "51-100 employees" },
  { value: "101-500", label: "101-500 employees" },
  { value: "501-1000", label: "501-1,000 employees" },
  { value: "1001-plus", label: "1,001+ employees" },
];

interface CompanyInformationFormProps {
  userId: string;
  initialData?: Partial<CompanyInformationFormData>;
  logo?: string | null;
}

export function CompanyInformationForm({ userId, initialData, logo }: CompanyInformationFormProps) {
  const saveBusinessMutation = useSaveBusinessBasicInfo();

  // Fetch user groups from API for dynamic Program / user group options
  const { data: userGroupsData } = useUserGroups(undefined, { page: 1, limit: 100 });
  const userGroups = (userGroupsData as any)?.data || (userGroupsData as any) || [];
  const programUserGroupOptions: MultiSelectOption[] = Array.isArray(userGroups)
    ? userGroups.map((group: any) => ({
        // Use group name as the value so it matches the API's userGroupNames array
        value: group.name,
        label: group.name,
      }))
    : [];

  const [descriptionLength, setDescriptionLength] = useState(
    initialData?.businessDescription?.length || 0,
  );

  const form = useForm<CompanyInformationFormData>({
    resolver: zodResolver(companyInformationSchema),
    defaultValues: {
      businessName: initialData?.businessName || "",
      businessLegalEntityType: initialData?.businessLegalEntityType || "",
      yearOfRegistration: initialData?.yearOfRegistration || "",
      sector: initialData?.sector || [],
      businessDescription: initialData?.businessDescription || "",
      programUserGroup: initialData?.programUserGroup || [],
      twoXCriteria: initialData?.twoXCriteria || [],
      numberOfEmployees: initialData?.numberOfEmployees || "",
      companyWebsite: initialData?.companyWebsite || "",
      businessPhotos: initialData?.businessPhotos || [],
      videoLinks: initialData?.videoLinks || [],
    },
  });

  const onSubmit = async (data: CompanyInformationFormData) => {
    try {
      // Parse year - handle "not-registered" case
      const year =
        data.yearOfRegistration === "not-registered"
          ? new Date().getFullYear()
          : parseInt(data.yearOfRegistration, 10);

      // Parse number of employees from range string
      const noOfEmployees = data.numberOfEmployees
        ? parseInt(data.numberOfEmployees.split("-")[0] || "0", 10)
        : undefined;

      // Transform video links - assuming VideoLinkInput returns array of strings (URLs)
      const videoLinks = (data.videoLinks || []).map((url) => {
        let source = "other";
        if (url.includes("youtube.com") || url.includes("youtu.be")) {
          source = "youtube";
        } else if (url.includes("vimeo.com")) {
          source = "vimeo";
        }
        return { url, source };
      });

      // Resolve selected program/user group name back to its ID for the API
      const selectedProgramName = data.programUserGroup[0];
      const selectedProgram =
        Array.isArray(userGroups) && selectedProgramName
          ? (userGroups as any[]).find(
              (g) => g.name === selectedProgramName,
            )
          : undefined;

      await saveBusinessMutation.mutateAsync({
        userId,
        data: {
          logo: logo || undefined,
          name: data.businessName,
          entityType: data.businessLegalEntityType,
          year,
          sectors: data.sector,
          description: data.businessDescription || undefined,
          userGroupId: selectedProgram?.id || undefined,
          criteria: data.twoXCriteria || undefined,
          noOfEmployees,
          website: data.companyWebsite || undefined,
          videoLinks: videoLinks.length > 0 ? videoLinks : undefined,
          businessPhotos: data.businessPhotos || undefined,
        },
      });

      toast.success("Company information saved successfully.");
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.error ||
        error?.message ||
        "Failed to save company information.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-2xl text-midnight-blue mb-2">
          Company Information
        </h2>
        <div className="h-px bg-primaryGrey-100 flex-1" />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Business Name, Legal Entity Type, Year, Sector - Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Business Name */}
            <FormField
              control={form.control}
              name="businessName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primaryGrey-400">
                    Business name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter business name"
                      {...field}
                      className={cn(
                        "h-10",
                        form.formState.errors.businessName && "border-red-500"
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Business Legal Entity Type */}
            <FormField
              control={form.control}
              name="businessLegalEntityType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primaryGrey-400">
                    Business legal entity type
                  </FormLabel>
                  <FormControl>
                    <SelectWithDescription
                      options={businessLegalEntityTypeOptions}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Select business type"
                      triggerClassName="h-10"
                      error={!!form.formState.errors.businessLegalEntityType}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Year of Business Registration */}
            <FormField
              control={form.control}
              name="yearOfRegistration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primaryGrey-400">
                    Year of business registration
                  </FormLabel>
                  <FormControl>
                    <SelectWithDescription
                      options={yearOptions}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Select year of registration"
                      triggerClassName="h-10"
                      error={!!form.formState.errors.yearOfRegistration}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Sector */}
            <FormField
              control={form.control}
              name="sector"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primaryGrey-400">
                    Sector
                  </FormLabel>
                  <FormControl>
                    <MultiSelectDropdown
                      options={sectorOptions}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Select business sector"
                      triggerClassName="h-10"
                      error={!!form.formState.errors.sector}
                      searchable
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Business Description - 2 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="businessDescription"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="text-primaryGrey-400">
                    Business description
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Textarea
                        placeholder="Briefly describe what the business does here..."
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          setDescriptionLength(e.target.value.length);
                        }}
                        maxLength={500}
                        className={cn(
                          "h-24 pr-16",
                          form.formState.errors.businessDescription && "border-red-500"
                        )}
                      />
                      <div className="absolute bottom-2 right-2 text-xs text-primaryGrey-400">
                        {descriptionLength}/500
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Program / User Group, 2X Criteria, No. of Employees, Company Website - Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Program / User Group */}
            <FormField
              control={form.control}
              name="programUserGroup"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primaryGrey-400">
                    Program / user group
                  </FormLabel>
                  <FormControl>
                    <MultiSelectDropdown
                      options={programUserGroupOptions}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Select program/user group"
                      triggerClassName="h-10"
                      error={!!form.formState.errors.programUserGroup}
                      searchable
                      maxDisplay={2}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 2X Criteria */}
            <FormField
              control={form.control}
              name="twoXCriteria"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primaryGrey-400">
                    2X Criteria
                  </FormLabel>
                  <FormControl>
                    <MultiSelectDropdown
                      options={twoXCriteriaOptions}
                      value={field.value || []}
                      onValueChange={field.onChange}
                      placeholder="Select 2X Criteria"
                      triggerClassName="h-10"
                      error={!!form.formState.errors.twoXCriteria}
                      searchable
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* No. of Employees */}
            <FormField
              control={form.control}
              name="numberOfEmployees"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primaryGrey-400">
                    No. of employees
                  </FormLabel>
                  <FormControl>
                    <SelectWithDescription
                      options={numberOfEmployeesOptions}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Select no. of employees"
                      triggerClassName="h-10"
                      error={!!form.formState.errors.numberOfEmployees}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Company Website Link */}
            <FormField
              control={form.control}
              name="companyWebsite"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primaryGrey-400">
                    Company website link
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="Enter website link"
                      {...field}
                      className={cn(
                        "h-10",
                        form.formState.errors.companyWebsite && "border-red-500"
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Upload Business Photos */}
          <FormField
            control={form.control}
            name="businessPhotos"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primaryGrey-400">
                  Upload business photos
                </FormLabel>
                <div className="text-xs text-primaryGrey-400 mb-2">
                  Share up to 5 images of the business premises, product or service offerings, team etc
                </div>
                <FormControl>
                  <div className="max-w-xl">
                    <ImageUpload
                      value={field.value || []}
                      onChange={field.onChange}
                      multiple
                      maxFiles={5}
                      maxSizeMB={2}
                      acceptedFormats={["PNG", "JPG", "JPEG"]}
                      error={!!form.formState.errors.businessPhotos}
                      errorMessage={form.formState.errors.businessPhotos?.message}
                      showPreview
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Video Links */}
          <FormField
            control={form.control}
            name="videoLinks"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primaryGrey-400">
                  Video links
                </FormLabel>
                <div className="text-xs text-primaryGrey-400 mb-2">
                  Add up to 3 video links showcasing the business activities and operations
                </div>
                <FormControl>
                  <VideoLinkInput
                    value={field.value || []}
                    onChange={field.onChange}
                    maxLinks={3}
                    error={!!form.formState.errors.videoLinks}
                    errorMessage={form.formState.errors.videoLinks?.message}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Action Button */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              size="lg"
              type="submit"
              className="text-white border-0"
              disabled={saveBusinessMutation.isPending}
              style={{
                background:
                  "linear-gradient(90deg, var(--green-500, #0C9) 0%, var(--pink-500, #F0459C) 100%)",
              }}
            >
              {saveBusinessMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

