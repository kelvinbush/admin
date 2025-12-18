"use client";

import { useSearchParams } from "next/navigation";
import { EntrepreneurDetailsForm } from "@/app/(dashboard)/entrepreneurs/[id]/entrepreneur-details/_components/entrepreneur-details-form";
import { useSMEUser } from "@/lib/api/hooks/sme";

export default function EntrepreneurDetailsPage() {
  const searchParams = useSearchParams();
  const entrepreneurId = searchParams.get("entrepreneurId");

  const { data, isLoading, isError } = useSMEUser(entrepreneurId || "", {
    enabled: !!entrepreneurId,
  });

  if (!entrepreneurId) {
    return (
      <div className="text-sm text-red-500">
        Entrepreneur ID is required. Please navigate from the loan application list.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-sm text-primaryGrey-500">
        Loading entrepreneur details...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="text-sm text-red-500">
        Failed to load entrepreneur details.
      </div>
    );
  }

  const user = data.user;

  // Map API data to form initial values
  const positionValue = user.position || "";
  const knownPositions = ["founder", "executive", "senior", "other"];
  const isKnownPosition = knownPositions.includes(positionValue);

  const initialData = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phoneNumber: user.phone,
    gender: user.gender || "",
    dateOfBirth: user.dob ? new Date(user.dob) : undefined,
    identificationNumber: user.idNumber || "",
    taxIdentificationNumber: user.taxNumber || "",
    positionHeld: isKnownPosition ? positionValue : "other",
    specifyPosition: isKnownPosition ? "" : positionValue,
  };

  return (
    <EntrepreneurDetailsForm
      userId={entrepreneurId}
      initialData={initialData}
    />
  );
}
