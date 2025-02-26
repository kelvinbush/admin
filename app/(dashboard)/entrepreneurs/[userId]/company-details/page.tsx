"use client";

import { redirect, useParams } from "next/navigation";

export default function CompanyDetailsPage() {
  const { userId } = useParams();

  redirect(`/entrepreneurs/${userId}/company-details/information`);
}
