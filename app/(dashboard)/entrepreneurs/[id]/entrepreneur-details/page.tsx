"use client";

import { EntrepreneurDetailsForm } from "./_components/entrepreneur-details-form";

export default function EntrepreneurDetailsPage() {
  // TODO: Fetch entrepreneur data using the ID
  // For now, using placeholder data matching the image
  const initialData = {
    firstName: "Cecile",
    lastName: "Soul",
    email: "cecile.soul@gmail.com",
    phoneNumber: "254712345678",
    gender: "female",
    dateOfBirth: new Date("1990-10-10"),
    identificationNumber: "2345678",
    taxIdentificationNumber: "A00156789544",
    positionHeld: "executive",
  };

  return <EntrepreneurDetailsForm initialData={initialData} />;
}

