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
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSMEOnboarding } from "../_context/sme-onboarding-context";
import { useSMEUser, useSaveBusinessBasicInfo } from "@/lib/api/hooks/sme";
import { useUserGroups } from "@/lib/api/hooks/useUserGroups";
import { toast } from "@/hooks/use-toast";

const companyInformationSchema = z.object({
  companyLogo: z.string().optional(),
  businessName: z.string().min(1, "Business name is required"),
  businessLegalEntityType: z.string().min(1, "Business legal entity type is required"),
  yearOfRegistration: z.string().min(1, "Year of business registration is required"),
  sector: z.array(z.string()).min(1, "At least one sector is required"),
  businessDescription: z.string().min(1, "Business description is required").max(100, "Business description must be 100 characters or less"),
  programUserGroup: z.array(z.string()).min(1, "At least one program/user group is required"),
  twoXCriteria: z.array(z.string()).optional(),
  numberOfEmployees: z.string().optional(),
  companyWebsite: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  businessPhotos: z.array(z.string()).optional(),
  videoLinks: z.array(z.string()).optional(),
});

type CompanyInformationFormData = z.infer<typeof companyInformationSchema>;

const businessLegalEntityTypeOptions: SelectOption[] = [
  { value: "sole-proprietorship", label: "Sole Proprietorship" },
  { value: "general-partnership", label: "General Partnership" },
  { value: "llp", label: "Limited Liability Partnership (LLP)" },
  { value: "llc", label: "Limited Liability Company (LLC)" },
  { value: "private-limited", label: "Private Limited Company" },
  { value: "s-corporation", label: "S Corporation" },
  { value: "c-corporation", label: "C Corporation" },
];

const yearOptions: SelectOption[] = [
  { value: "not-registered", label: "Not yet registered" },
  ...Array.from({ length: 10 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { value: year.toString(), label: year.toString() };
  }),
];

const sectorOptions: MultiSelectOption[] = [
  { value: "agriculture", label: "Agriculture & Farming" },
  { value: "education", label: "Education & Training" },
  { value: "food-beverage", label: "Food & Beverage" },
  { value: "healthcare", label: "Healthcare" },
  { value: "retail-wholesale", label: "Retail & Wholesale Trade" },
  { value: "transportation", label: "Transportation & Logistics" },
];

// User groups will be fetched from API

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

export function Step2CompanyInformation() {
  const router = useRouter();
  const { userId, onboardingState, refreshState } = useSMEOnboarding();
  const [descriptionLength, setDescriptionLength] = useState(0);
  const saveBusinessMutation = useSaveBusinessBasicInfo();
  
  // Fetch user groups from API
  const { data: userGroupsData } = useUserGroups(undefined, { page: 1, limit: 100 });
  // Handle both PaginatedResponse and direct array responses
  const userGroups = (userGroupsData as any)?.data || (userGroupsData as any) || [];
  const userGroupOptions: MultiSelectOption[] = Array.isArray(userGroups) 
    ? userGroups.map((group: any) => ({
        value: group.id,
        label: group.name,
      }))
    : [];
  
  // Fetch full user details if userId is present
  const { data: userDetail, isLoading: isLoadingUser } = useSMEUser(userId || "", {
    enabled: !!userId,
  });
  
  // Determine if we're editing (userId exists, regardless of completion status)
  const isEditing = !!userId;
  // Use userDetail business data which has all fields, fallback to onboardingState for basic name
  const businessData = userDetail?.business;

  const form = useForm<CompanyInformationFormData>({
    resolver: zodResolver(companyInformationSchema),
    defaultValues: {
      companyLogo: "",
      businessName: "",
      businessLegalEntityType: "",
      yearOfRegistration: "",
      sector: [],
      businessDescription: "",
      programUserGroup: [],
      twoXCriteria: [],
      numberOfEmployees: "",
      companyWebsite: "",
      businessPhotos: [],
      videoLinks: [],
    },
  });

  // Load existing data if userId is present
  useEffect(() => {
    if (userId && businessData) {
      // Map number of employees to form format (range string)
      const mapNoOfEmployees = (count: number | null): string => {
        if (!count) return "";
        if (count <= 10) return "1-10";
        if (count <= 50) return "11-50";
        if (count <= 100) return "51-100";
        if (count <= 500) return "101-500";
        if (count <= 1000) return "501-1000";
        return "1001-plus";
      };

      // Map video links from API format to form format (array of strings)
      // API returns: { url: string; source: string | null }[]
      // Form expects: string[]
      const videoLinksForm = businessData.videoLinks?.map(v => v.url) || [];

      form.reset({
        companyLogo: businessData.logo || "",
        businessName: businessData.name || "",
        businessLegalEntityType: businessData.entityType || "",
        yearOfRegistration: businessData.yearOfIncorporation?.toString() || "",
        sector: businessData.sectors || [],
        businessDescription: businessData.description || "",
        programUserGroup: businessData.userGroupIds || [],
        twoXCriteria: businessData.selectionCriteria || [],
        numberOfEmployees: mapNoOfEmployees(businessData.noOfEmployees),
        companyWebsite: businessData.website || "",
        businessPhotos: businessData.businessPhotos || [],
        videoLinks: videoLinksForm,
      });
      if (businessData.description) {
        setDescriptionLength(businessData.description.length);
      }
    }
  }, [userId, businessData, form]);

  const handleCancel = () => {
    if (userId) {
      router.push(`/entrepreneurs/create?userId=${userId}&step=1`);
    } else {
      router.push("/entrepreneurs/create?step=1");
    }
  };

  const onSubmit = async (data: CompanyInformationFormData) => {
    if (!userId) {
      toast({
        title: "Error",
        description: "Please complete Step 1 first.",
        variant: "destructive",
      });
      router.push("/entrepreneurs/create?step=1");
      return;
    }

    try {
      // Parse year - handle "not-registered" case
      const year = data.yearOfRegistration === "not-registered" 
        ? new Date().getFullYear() 
        : parseInt(data.yearOfRegistration, 10);

      // Parse number of employees from range string
      const noOfEmployees = data.numberOfEmployees 
        ? parseInt(data.numberOfEmployees.split("-")[0] || "0", 10)
        : undefined;

      // Transform video links - assuming VideoLinkInput returns array of strings (URLs)
      // We'll need to extract source from URL or set default
      const videoLinks = (data.videoLinks || []).map((url) => {
        // Try to detect source from URL
        let source = "other";
        if (url.includes("youtube.com") || url.includes("youtu.be")) {
          source = "youtube";
        } else if (url.includes("vimeo.com")) {
          source = "vimeo";
        }
        return { url, source };
      });

      await saveBusinessMutation.mutateAsync({
        userId,
        data: {
          logo: data.companyLogo || undefined,
          name: data.businessName,
          entityType: data.businessLegalEntityType,
          year,
          sectors: data.sector,
          description: data.businessDescription || undefined,
          userGroupId: data.programUserGroup[0] || undefined, // Take first if multiple
          criteria: data.twoXCriteria || undefined,
          noOfEmployees,
          website: data.companyWebsite || undefined,
          videoLinks: videoLinks.length > 0 ? videoLinks : undefined,
          businessPhotos: data.businessPhotos || undefined,
        },
      });

      toast({
        title: "Success",
        description: "Company information saved successfully.",
      });

      refreshState();
      router.push(`/entrepreneurs/create?userId=${userId}&step=3`);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error || error?.message || "Failed to save company information.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-primary-green">STEP 2/7</div>
          {isEditing && (
            <div className="text-xs text-primaryGrey-400 bg-primaryGrey-50 px-2 py-1 rounded">
              Editing existing data
            </div>
          )}
        </div>
        <h2 className="text-2xl font-semibold text-midnight-blue mb-2">
          Company Information
        </h2>
        <p className="text-sm text-primaryGrey-500">
          Provide the key details about the business.
        </p>
      </div>

      {isLoadingUser && userId ? (
        <div className="flex items-center justify-center py-8">
          <p className="text-sm text-primaryGrey-500">Loading company information...</p>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Company Logo - with border */}
          <FormField
            control={form.control}
            name="companyLogo"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primaryGrey-400 mb-2 block">
                  Company logo (Optional)
                </FormLabel>
                <FormControl>
                  <div className="border border-primaryGrey-200 rounded-md p-4">
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      circular
                      maxSizeMB={5}
                      acceptedFormats={["PNG", "JPG", "JPEG"]}
                      error={!!form.formState.errors.companyLogo}
                      errorMessage={form.formState.errors.companyLogo?.message}
                      showPreview
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Business Name, Legal Entity Type, Year, Sector - Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Business Name */}
            <FormField
              control={form.control}
              name="businessName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required className="text-primaryGrey-400">
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
                  <FormLabel required className="text-primaryGrey-400">
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
                  <FormLabel required className="text-primaryGrey-400">
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
                  <FormLabel required className="text-primaryGrey-400">
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
                <FormLabel required className="text-primaryGrey-400">
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
                      maxLength={100}
                      className={cn(
                        "h-24 pr-16",
                        form.formState.errors.businessDescription && "border-red-500"
                      )}
                    />
                    <div className="absolute bottom-2 right-2 text-xs text-primaryGrey-400">
                      {descriptionLength}/100
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
                  <FormLabel required className="text-primaryGrey-400">
                    Program / user group
                  </FormLabel>
                  <FormControl>
                    <MultiSelectDropdown
                      options={userGroupOptions}
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
                    2X Criteria (optional)
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
                    No. of employees (optional)
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
                    Company website link (optional)
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

          {/* Upload Business Photos - Reduced size */}
          <FormField
            control={form.control}
            name="businessPhotos"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primaryGrey-400">
                  Upload business photos (optional)
                </FormLabel>
                <div className="text-xs text-primaryGrey-400 mb-2">
                  Share up to 5 images of the business premises, product or service offerings, team etc
                </div>
                <FormControl>
                  <div className="max-w-2xl">
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
                  Video links (optional)
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
              disabled={saveBusinessMutation.isPending || isLoadingUser}
              style={{
                background:
                  "linear-gradient(90deg, var(--green-500, #0C9) 0%, var(--pink-500, #F0459C) 100%)",
              }}
            >
              {isLoadingUser
                ? "Loading..."
                : saveBusinessMutation.isPending
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
