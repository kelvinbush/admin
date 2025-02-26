"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetEntrepreneurQuery } from "@/lib/redux/services/user";
import ProfileForm from "@/components/business-profile/profile-form";
import { useParams } from "next/navigation";

// Profile Form Schema
const profileFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(6, "Phone number must be at least 6 digits"),
  gender: z.enum(["female", "male", "other"]),
  birthDate: z.string(),
  positionHeld: z.string().min(1, "Position is required"),
});

export type TProfileForm = z.infer<typeof profileFormSchema>;

const PersonalInformation = () => {
  const { userId } = useParams();

  const {
    data: user,
    error: userError,
    isLoading: userIsLoading,
  } = useGetEntrepreneurQuery({ guid: userId as string });

  const profileForm = useForm<TProfileForm>({
    resolver: zodResolver(profileFormSchema),
  });

  useEffect(() => {
    if (user?.personal) {
      const { personal } = user;
      const formData = {
        firstName: personal.firstName || "",
        lastName: personal.lastName || "",
        email: personal.email || "",
        phoneNumber: personal.phoneNumber || "",
        gender: personal.gender || "other",
        birthDate: personal.birthDate?.split("T")[0] || "",
        positionHeld: personal.positionHeld || "",
      };

      // Use setTimeout to ensure the form is properly initialized
      setTimeout(() => {
        profileForm.reset(formData);
      }, 0);
    }
  }, [profileForm, user]);

  if (userError) {
    return <div>Error loading user data</div>;
  }

  if (userIsLoading) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <ProfileForm form={profileForm} />
    </div>
  );
};

export default PersonalInformation;
